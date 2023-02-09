const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const allCreatedRooms = [];
const Room = require('./models');

app.post('/api/rooms', (req, res) => {
    const addNewRoom = req.body.roomNumber
    console.log(addNewRoom)
    console.log(typeof addNewRoom)
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

// app.post('/api/rooms/:id/enteruser', (req, res) => {
//     let id = req.params.id
//     let user = req.body.user
//     if ((allCreatedRooms[id]) && (!(roomStatus[id]))) {
//         roomStatus[id] = user.id
//     }
// });

// app.post('/api/rooms/:id/exituser', (req, res) => {
//     let id = req.params.id
//     let user = req.body.user
//     if ((allCreatedRooms[id]) && (roomStatus[id] == user)) {
//         roomStatus[id] = 0
//     }
// });

app.listen(5050, () => {
    console.log('server started');
});