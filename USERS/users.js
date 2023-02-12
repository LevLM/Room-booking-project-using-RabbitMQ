const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const User = require('./usermodels');
const amqp = require('amqplib/callback_api');

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const allUsers = [];
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

app.post('/api/users', (req, res) => {
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

app.listen(4000, () => {
    console.log('server started');
});

module.exports = app