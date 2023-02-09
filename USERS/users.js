const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const allUsers = [];
const userStatus = [];

app.get('/api/users/:id/enterroom', (req, res) => {
    let id = req.params.id
    let user = allUsers.find(t => t.id == id);
    for (let i = 1; i = roomStatus.length; i++) {
        if (user.id == roomStatus[i]) {
            console.log(user, ' in the room', i)
            res.json(user + ' in the room' + i)
        }
      }
});



app.listen(4000, () => {
    console.log('server started');
});