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
        const queryText = 'INSERT INTO users(roomNumber, roomStatus) VALUES($1, $2) RETURNING roomNumber';
        const values = [this.roomNumber, this.roomStatus];
        const { rows } = await client.query(queryText, values);
        await client.query('COMMIT');
        return rows[0].id;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }
}
  
module.exports = Room;
