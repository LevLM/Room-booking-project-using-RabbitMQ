class User {
    constructor(id, first_name, last_name, pasport_id, data_birth, state) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.pasport_id = pasport_id;
        this.data_birth = data_birth;
        this.state = state;
    }
  }
  
module.exports = User;