const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app2 = express();
const User = require('./usermodels');
const amqp = require('amqplib/callback_api');
const port = 4022;

app2.use(bodyParser.urlencoded({ extended: false }));
app2.use(bodyParser.json());

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'admin',
  host: 'db',
  database: 'bookroom',
  password: 'ghbdtn11',
  port: 5432,
})

const QUEUE_NAME = 'user_created';

amqp.connect('amqp://rabbitmq:5672', function(error0, connection) {  
    if (error0) {
      throw error0;
    }
  connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }
      channel.assertQueue(QUEUE_NAME, {
        durable: false
      });

    app2.post('/api/users', (req, res) => {
      try {
        const { user_id, first_name, last_name, pasport_id, data_birth } = req.body;
        if (!user_id || !first_name || !last_name || !pasport_id || !data_birth) {
            return res.status(400).send({ error: 'Invalid data' });
        }
        let userExists = false;
        pool.query('SELECT user_id, first_name, last_name, pasport_id, data_birth FROM users', (error, result) => {
          if (error) {
              console.error('Error executing query', error);
              return;
          }
          const allCreatedUsers = result.rows.map(row => new User(row.user_id, row.first_name, row.last_name, row.pasport_id, row.data_birth));
          console.log(allCreatedUsers);
          for (const user of allCreatedUsers) {
              if (user.user_id == user_id) {
                  userExists = true;
                  break;
              }
          }
          if (userExists) {
            console.log('user already exist');
            res.json({error: 'user already exist'});
          } else {
            const newUser = new User(user_id, first_name, last_name, pasport_id, data_birth);
            newUser.save();
            const message = JSON.stringify(newUser);
            channel.sendToQueue(QUEUE_NAME, Buffer.from(message));
            console.log(" [x] Sent %s", message);
            res.status(201).send('User created successfully: ' + JSON.stringify(newUser));
            console.log('User created successfully ', newUser)
          }
        });
      } catch (error) {
        console.error('Error creating user', error);
        res.status(500).send({ error: 'Something went wrong while creating user' });
      }
    });
  });
});

app2.get('/api/users/:id', async (req, res) => {
    let user_id = req.params.id;
    console.log('view user id=#' + user_id);
    const findUser = await User.getUserByUser_id(user_id);
    console.log(findUser ? findUser : 'not found');
    res.json(findUser ? findUser : 'not found');
});

app2.put('/api/users/:id/state', async (req, res) => {
  try {
    const user_id = req.params.id;
    const state = req.body.state;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const selectQuery = 'SELECT * FROM users WHERE user_id = $1';
      const selectValues = [user_id];
      const { rows } = await client.query(selectQuery, selectValues);
      if (rows.length === 0) {
        return res.status(404).send({ error: 'User not found' });
      }
      const user = rows[0];
      user.state = state;
      const updateQuery = 'UPDATE users SET state = $1 WHERE user_id = $2';
      const updateValues = [state, user_id];
      await client.query(updateQuery, updateValues);
      await client.query('COMMIT');
      console.log(rows);
      res.status(200).json({ message: 'User state updated successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

app2.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});

module.exports = app2
