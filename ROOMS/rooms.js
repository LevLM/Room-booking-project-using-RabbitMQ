const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const axios = require('axios');
const amqp = require('amqplib/callback_api');

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const allCreatedRooms = [];
const Room = require('./roommodels');
// const User = require('../users/usermodels');
const QUEUE_NAME = 'user_created';

app.post('/api/rooms', (req, res) => {
    const addNewRoom = req.body.roomNumber
    if (typeof addNewRoom == 'number') {
        for (const room of allCreatedRooms) {
            if (room.roomNumber == addNewRoom) {
                console.log('room already exist');
                res.json({error: 'room already exist'});
            }
        }
        const newCreatedRoom = new Room(addNewRoom, 0);
        allCreatedRooms.push(newCreatedRoom);
        res.json(allCreatedRooms)
        console.log(allCreatedRooms)
    } else {
        console.log('type error')
        res.status(400).json('type error')
    }
});

app.delete('/api/rooms/:id', (req, res) => {
    if (allCreatedRooms.length == 0) {
        res.json("allCreatedRooms Is Empty")
        return "allCreatedRooms Is Empty"
    }
    let id = req.params.id;
    for (const room of allCreatedRooms) {
        if (room.roomNumber == id) {
            const index = allCreatedRooms.indexOf(room);
            allCreatedRooms.splice(index, 1);
            console.log('room #', id, ' deleted from allCreatedRooms')
            res.json('room #' + id + ' deleted from allCreatedRooms')
        }
        else {
            console.log('room #', id, ' is not created')
            res.json('room #' + id + ' is not created')
        }
    }
    console.log(allCreatedRooms)
});

app.get('/api/rooms/:id', (req, res) => {
    let id = req.params.id;
    console.log('view room by roomnumber ' + id);
    let findRoom = null;
    for (const room of allCreatedRooms) {
        if (room.roomNumber == id) {
            findRoom = room;
            break;
        }
    }
    console.log(findRoom ? findRoom : 'not found');
    res.json(findRoom ? findRoom : 'not found');
});

// const user = new User(2, 'John', 'Doe', 'P1234567', '01/01/2000');

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
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", QUEUE_NAME);
    channel.consume(QUEUE_NAME, function(msg) {
      const userData = JSON.parse(msg.content.toString());
      console.log(" [x] Received %s", msg.content.toString());
    }, {
      noAck: true
    });
  });
});

app.post('/api/rooms/:id/enteruser', async (req, res) => {
    let id = req.params.id
    let findRoom = null;
    for (const room of allCreatedRooms) {
        if (room.roomNumber == id) {
            findRoom = room;
            break;
        }
    }
    if (findRoom) {
        // const user.id = req.body.user.id;
        const userId = 2;
        const response = await axios.get(`http://localhost:4022/api/users/${userId}`);
        const user = response.data;
        if (user.state == 'entered') {
            console.log(user.first_name, user.last_name, 'is already in one of the rooms');
            res.json(user.first_name + ' ' + user.last_name + ' is already in one of the rooms');
        } else {
            if (findRoom.roomStatus == 0) {
                findRoom.roomStatus = user.id
                const state = 'entered'
                const server2 = `http://localhost:4022/api/users/${user.id}/state`;
                try {
                    const response = await axios.put(server2, { state });
                    console.log(findRoom);
                    res.status(200).json(findRoom);
                } catch (error) {
                    console.log(error);
                    res.status(500).json({ error });
                }
            }
            else {
                console.log('room is occupied by user: ', user.id);
                res.status(500).json('room is occupied by user: ' + user.id);
            }
        }
    }
    else {
        console.log('room not found');
        res.json('room not found');
    }
});

app.post('/api/rooms/:id/exituser', async (req, res) => {
    let id = req.params.id
    let findRoom = null;
    for (const room of allCreatedRooms) {
        if (room.roomNumber == id) {
            findRoom = room;
            break;
        }
    }
    if (findRoom) {
        // const user.id = req.body.user.id;
        const userId = 2;
        const response = await axios.get(`http://localhost:4022/api/users/${userId}`);
        const user = response.data;
        if (findRoom.roomStatus != 0) {
            findRoom.roomStatus = 0
            const state = 'exited'
            const server2 = `http://localhost:4022/api/users/${user.id}/state`;
            try {
                const response = await axios.put(server2, { state });
                console.log(findRoom);
                res.status(200).json(findRoom);
            } catch (error) {
                console.log(error);
                res.status(500).json({ error });
            }
        }
        else {
            console.log('room is not occupied');
            res.status(500).json('room is not occupied');
        }
    }
    else {
        console.log('room not found');
        res.json('room not found');
    }
});

app.listen(5050, () => {
    console.log('server started on port 5050');
});

module.exports = app