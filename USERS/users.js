const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app2 = express();
const User = require('./usermodels');
// const axios = require('axios');
// const amqp = require('amqplib/callback_api');
const port = 4000;

// Configuring body parser middleware
app2.use(bodyParser.urlencoded({ extended: false }));
app2.use(bodyParser.json());

const allUsers = [];
const user3 = new User(3, 'Ivan', 'Ivanov', '123', '01/04/2001');
allUsers.push(user3);
const user4 = new User(4, 'Petr', 'Petrov', '567', '01/08/2011');
allUsers.push(user4);
// const userStatus = [];

// app.get('/api/users/:id/enterroom', (req, res) => {
//     let id = req.params.id
//     let user = allUsers.find(t => t.id == id);
//     for (let i = 1; i = roomStatus.length; i++) {
//         if (user.id == roomStatus[i]) {
//             console.log(user, ' in the room', i)
//             res.json(user + ' in the room' + i)
//         }
//       }
// });

app2.post('/api/users', (req, res) => {
    console.log(req.body)
    const { id, first_name, last_name, pasport_id, data_birth } = req.body;
    if (!id || !first_name || !last_name || !pasport_id || !data_birth) {
        return res.status(400).send({ error: 'Invalid data' });
    }
    const newUser = new User(id, first_name, last_name, pasport_id, data_birth);
    allUsers.push(newUser);
    // amqp.connect('amqp://localhost', (error0, connection) => {
    //     if (error0) {
    //       throw error0;
    //     }
    //     connection.createChannel((error1, channel) => {
    //       if (error1) {
    //         throw error1;
    //       }
    //       const exchange = 'user_registration';
    //       const msg = JSON.stringify({ newUser });
    
    //       channel.assertExchange(exchange, 'fanout', {
    //         durable: false
    //       });
    //       channel.publish(exchange, '', Buffer.from(msg));
    //       console.log(` [x] Sent ${msg}`);
    //     });
    
    //     setTimeout(() => {
    //       connection.close();
    //       process.exit(0);
    //     }, 500);
    //   });
    res.status(201).send('User created successfully ');
    console.log('User created successfully ', allUsers)
});

// Get user state endpoint
app2.put('/api/users/:id/state', (req, res) => {
    let id = req.params.id
    const state = req.body.state;
    const user = allUsers.find(user => user.id === id);
    if (!user) {
      return res.status(404).send({error: 'User not found'});
    }
    user.state = state;
    // save the updated user to the database
    saveUser(user);
    res.status(200).json({ message: 'User state updated successfully' });
});

app2.listen(port, () => {
    console.log('server started at http://localhost:${port}');
});

module.exports = app2
