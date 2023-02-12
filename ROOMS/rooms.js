const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const axios = require('axios');

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const allCreatedRooms = [];
const Room = require('./roommodels');
const User = require('../users/usermodels');

app.post('/api/rooms', (req, res) => {
    const addNewRoom = req.body.roomNumber
    if (typeof addNewRoom == 'number') {
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

const user = new User(2, 'John', 'Doe', 'P1234567', '01/01/2000');

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
        if (findRoom.roomStatus == 0) {
            findRoom.roomStatus = user.id
            const state = 'entered'
            // axios.put('http://localhost:4000/api/users/${user.id}/state', {state})
            //     .then(response => {
                    console.log(findRoom);
                    res.status(200).json(findRoom);
                // })
                // .catch(error => {
                //     console.log(error);
                //     res.status(500).json({ error });
                // });
        }
        else {
            console.log('room is occupied by user: ', user.id);
            res.status(500).json('room is occupied by user: ' + user.id);
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
        if (findRoom.roomStatus != 0) {
            findRoom.roomStatus = 0
            const state = 'exited'
            // axios.put('http://localhost:4000/api/users/${user.id}/state', {state})
            //     .then(response => {
                    console.log(findRoom);
                    res.status(200).json(findRoom);
                // })
                // .catch(error => {
                //     console.log(error);
                //     res.status(500).json({ error });
                // });
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

// app.listen(4000, () => {
//     console.log('service listening on port 4000 for connect with Users service');
// });

module.exports = app