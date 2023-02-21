const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app2 = express();
const User = require('./usermodels');
// const axios = require('axios');
const amqp = require('amqplib/callback_api');
const port = 4022;

// Configuring body parser middleware
app2.use(bodyParser.urlencoded({ extended: false }));
app2.use(bodyParser.json());

const allUsers = [];
const user3 = new User(3, 'Ivan', 'Ivanov', '123', '01/04/2001');
allUsers.push(user3);
const user4 = new User(4, 'Petr', 'Petrov', '567', '01/08/2011');
allUsers.push(user4);

const QUEUE_NAME = 'user_created';

app2.post('/api/users', (req, res) => {
    const { id, first_name, last_name, pasport_id, data_birth } = req.body;
    if (!id || !first_name || !last_name || !pasport_id || !data_birth) {
        return res.status(400).send({ error: 'Invalid data' });
    }
    const newUser = new User(id, first_name, last_name, pasport_id, data_birth);
    allUsers.push(newUser);

    amqp.connect('amqp://localhost:5672', function(error0, connection) {
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
          // Send user data to Room service
          const message = JSON.stringify(newUser);
          channel.sendToQueue(QUEUE_NAME, Buffer.from(message));
          console.log(" [x] Sent %s", message);
        });
        // setTimeout(function() {
        //   connection.close();
        //   process.exit(0);
        // }, 500);
    });

    res.status(201).send('User created successfully ');
    console.log('User created successfully ', allUsers)
});

app2.get('/api/users/:id', (req, res) => {
    let id = req.params.id;
    console.log('view user id=#' + id);
    let findUser = null;
    for (const user of allUsers) {
        if (user.id == id) {
            findUser = user;
            break;
        }
    }
    console.log(findUser ? findUser : 'not found');
    res.json(findUser ? findUser : 'not found');
});

// Get user state endpoint
app2.put('/api/users/:id/state', (req, res) => {
    let id = req.params.id
    const state = req.body.state;
    const user = allUsers.find(user => user.id == id);
    if (!user) {
      return res.status(404).send({error: 'User not found'});
    }
    user.state = state;
    console.log(allUsers)
    res.status(200).json({ message: 'User state updated successfully' });
});

app2.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});

module.exports = app2
