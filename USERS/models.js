

const users = [];
 
module.exports= class User{
 
    constructor(first_name, last_name, pasport_id, data_birth){
        this.id = id
        this.first_name = first_name;
        this.last_name = last_name;
        this.pasport_id = pasport_id;
        this.data_birth = data_birth;
    }
    save(){
        users.push(this);
    }
    static getAll(){
        return users;
    }
}