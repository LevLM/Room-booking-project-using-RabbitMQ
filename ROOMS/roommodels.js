const Pool = require('pg').Pool
const pool = new Pool({
  user: 'admin',
  host: 'db',
  database: 'bookroom',
  password: 'ghbdtn11',
  port: 5432,
})

class Room {
    constructor(roomNumber, roomStatus) {
      this.roomNumber = roomNumber;
      this.roomStatus = roomStatus;
    }
    async save() {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const queryText = 'INSERT INTO rooms(roomNumber, roomStatus) VALUES($1, $2) RETURNING roomNumber';
        const values = [this.roomNumber, this.roomStatus];
        const { rows } = await client.query(queryText, values);
        console.log('Room inserted into database with room number:', rows[0]);
        await client.query('COMMIT');
        console.log(rows[0]);
        return rows[0].id;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }
    static async getRoomByNumber(roomNumber) {
      const queryText = 'SELECT * FROM rooms WHERE roomNumber = $1';
      const values = [roomNumber];
      const { rows } = await pool.query(queryText, values);
      return rows.length ? rows[0] : null;
    }
    static getAllRooms(callback) {
      pool.query('SELECT roomNumber, roomStatus FROM rooms', (error, result) => {
        if (error) {
          console.error('Error executing query', error);
          callback(error, null);
          return;
        }
        const allCreatedRooms = result.rows.map(row => new Room(row.roomnumber, row.roomstatus));
        callback(null, allCreatedRooms);
      });
    }
    static findByRoomNumber(roomNumber, callback) {
      pool.query('SELECT roomNumber, roomStatus FROM rooms WHERE roomNumber = $1', [roomNumber], (error, result) => {
        if (error) {
          console.error('Error executing query', error);
          callback(error, null);
          return;
        }
        if (result.rows.length > 0) {
          const room = new Room(result.rows[0].roomNumber, result.rows[0].roomStatus);
          callback(null, room);
        } else {
          callback(null, null);
        }
      });
    }
    static deleteRoom(roomNumber, callback) {
      const query = {
        text: 'DELETE FROM rooms WHERE roomNumber = $1',
        values: [roomNumber],
      };
      pool.query(query, (error, result) => {
        if (error) {
          console.error('Error executing query', error);
          return callback(error);
        }
        if (result.rowCount == 0) {
          console.log('Room not found');
          return callback('Room not found');
        }
        console.log(`Room ${roomNumber} deleted successfully`);
        callback(null);
      });
    }
}
  
module.exports = Room;
