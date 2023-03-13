const Pool = require('pg').Pool
const pool = new Pool({
  user: 'admin',
  host: 'db',
  database: 'bookroom',
  password: 'ghbdtn11',
  port: 5432,
})

class User {
  constructor(user_id, first_name, last_name, pasport_id, data_birth, state) {
        this.user_id = user_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.pasport_id = pasport_id;
        this.data_birth = data_birth;
        this.state = state;
    }

  async save() {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const queryText = 'INSERT INTO users(user_id, first_name, last_name, pasport_id, data_birth, state) VALUES($1, $2, $3, $4, $5, $6) RETURNING user_id';
      const values = [this.user_id, this.first_name, this.last_name, this.pasport_id, this.data_birth, this.state];
      const { rows } = await client.query(queryText, values);
      await client.query('COMMIT');
      return rows[0].user_id;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = User;