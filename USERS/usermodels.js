class User {
  constructor(id, first_name, last_name, pasport_id, data_birth, state) {
        this.id = id;
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
      const queryText = 'INSERT INTO users(first_name, last_name, pasport_id, data_birth, state) VALUES($1, $2, $3, $4, $5) RETURNING id';
      const values = [this.first_name, this.last_name, this.pasport_id, this.data_birth, this.state];
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

module.exports = User;