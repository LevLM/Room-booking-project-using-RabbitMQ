const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const axios = require('axios');
const amqp = require('amqplib/callback_api');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'admin',
  host: 'db',
  database: 'bookroom',
  password: 'ghbdtn11',
  port: 5432,
})

const Room = require('./roommodels');
const QUEUE_NAME = 'user_created';

app.post('/api/rooms', (req, res) => {
    const NewRoomNumber = req.body.roomNumber
    if (typeof NewRoomNumber !== 'number') {
        return 'type error';
    }
    let roomExists = false;
    pool.query('SELECT roomNumber, roomStatus FROM rooms', (error, result) => {
        if (error) {
            console.error('Error executing query', error);
            return;
        }
        const allCreatedRooms = result.rows.map(row => new Room(row.roomnumber, row.roomstatus));
        for (const room of allCreatedRooms) {
            if (room.roomNumber == NewRoomNumber) {
                roomExists = true;
                break;
            }
        }
        if (roomExists) {
            console.log('room already exist');
            res.json({error: 'room already exist'});
        } else {
            const { roomNumber, roomStatus } = req.body;
            if (!roomNumber) {
                return res.status(400).send({ error: 'Invalid data' });
            }
            const newRoom = new Room(roomNumber, roomStatus);
            const savedRoom = newRoom.save();
            if (savedRoom) {
                console.log('New room created successfully:', savedRoom);
                res.status(201).send('Room created successfully');
            } else {
                console.log('Error: New room could not be saved');
                res.status(500).send('Error: New room could not be saved');
            }
        }
    });
});

app.delete('/api/rooms/:id', (req, res) => {
    pool.query('SELECT roomNumber, roomStatus FROM rooms', (error, result) => {
        if (error) {
            console.error('Error executing query', error);
            return;
        }
        const allCreatedRooms = result.rows.map(row => new Room(row.roomNumber, row.roomStatus));
    
        if (allCreatedRooms.length == 0) {
            res.json("allCreatedRooms Is Empty")
            return "allCreatedRooms Is Empty"
        }
    });
    let id = req.params.id;
    pool.query('DELETE FROM rooms WHERE roomNumber = $1', [id], (error, result) => {
        if (error) {
            console.error('Error executing query', error);
            return res.status(500).send('Error deleting room');
        }

        if (result.rowCount === 0) {
            console.log('Room not found');
            return res.status(404).send('Room not found');
        }

        console.log(`Room ${id} deleted successfully`);
        res.status(204).send();
    });
});

app.get('/api/rooms/:id', async (req, res) => {
    let roomNumber = req.params.id;
    console.log('view room by roomNumber ' + roomNumber);
    const queryText = 'SELECT * FROM rooms WHERE roomNumber = $1';
    const values = [roomNumber];
    const { rows } = await pool.query(queryText, values);
    const findRoom = rows[0];
    console.log(findRoom ? findRoom : 'not found');
    res.json(findRoom ? findRoom : 'not found');
});

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
    let roomNumber = req.params.id
    try {
        const { rows } = await pool.query('SELECT * FROM rooms WHERE roomNumber = $1', [roomNumber]);
        if (rows.length > 0) {
            const findRoom = rows[0];
            if (findRoom) {
                const user_id = req.body.user_id;
                let response;
                try {
                    response = await axios.get(`http://users:4022/api/users/${user_id}`);
                } catch (error) {
                        console.log('get failed: ' + error);
                }
                const user = response.data;
                if (user.state == 'entered') {
                    console.log(user.first_name, user.last_name, 'is already in one of the rooms');
                    res.json(user.first_name + ' ' + user.last_name + ' is already in one of the rooms');
                } else {
                    if (findRoom.roomStatus == null) {
                        findRoom.roomStatus = user.user_id
                        await pool.query('UPDATE rooms SET roomStatus = $1 WHERE roomNumber = $2', [user.user_id, roomNumber]);
                        const state = 'entered'
                        const server2 = `http://users:4022/api/users/${user.user_id}/state`;
                        try {
                            const response = await axios.put(server2, { state });
                            findRoom.roomStatus = user.user_id;
                            console.log(findRoom);
                            res.status(200).json({ roomStatus: findRoom.roomStatus }); 
                        } catch (error) {
                            console.log('put failed: ' + error);
                            res.status(500).json({ error });
                        }
                    } else {
                        console.log('room is occupied by user: ', user.user_id);
                        res.status(500).json('room is occupied by user: ' + user.user_id);
                    }
                }
            }
        } else {
          res.status(404).send(`Room ${roomNumber} not found`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
});

app.post('/api/rooms/:id/exituser', async (req, res) => {
    let roomNumber = req.params.id
    try {
        const { rows } = await pool.query('SELECT * FROM rooms WHERE roomNumber = $1', [roomNumber]);
        if (rows.length > 0) {
            const findRoom = rows[0];
            if (findRoom) {
                const user_id = req.body.user_id;
                let response;
                try {
                    response = await axios.get(`http://users:4022/api/users/${user_id}`);
                } catch (error) {
                        console.log('get failed: ' + error);
                }
                const user = response.data;
                if (user.state != 'entered') {
                    console.log(user.first_name, user.last_name, 'is not in one of the rooms');
                    res.json(user.first_name + ' ' + user.last_name + ' is not in one of the rooms');
                } else {
                    if (findRoom.roomStatus != 0) {
                        findRoom.roomStatus = 0
                        await pool.query('UPDATE rooms SET roomStatus = $1 WHERE roomNumber = $2', [0, roomNumber]);
                        const state = 'exited'
                        const server2 = `http://users:4022/api/users/${user.user_id}/state`;
                        try {
                            const response = await axios.put(server2, { state });
                            findRoom.roomStatus = 0
                            console.log(findRoom);
                            res.status(200).json({ roomStatus: findRoom.roomStatus });
                        } catch (error) {
                            console.log(error);
                            res.status(500).json({ error });
                        }
                    } else {
                        console.log('room is not occupied');
                        res.status(500).json('room is not occupied');
                    }
                }
            }
        } else {
            res.status(404).send(`Room ${roomNumber} not found`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
});

app.listen(5050, () => {
    console.log('server started on port 5050');
});

module.exports = app