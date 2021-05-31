const Model = require('./Model');

class User extends Model {
    constructor() {
        super();
    }
    registered(students) {
        try{
            let client = this.client;
            client.get('id', function(err, id){
                client.incr('id', function(err, data){
                    if(data){
                        let arr = [
                            `id`, `${id}`,
                            `first_name`, `${students.first_name}`,
                            `last_name`, `${students.last_name}`,
                            `email`, `${students.email}`,
                            `password`, `${students.password}`,
                        ];
                        client.hmset(`${students.email}`, arr, function(err, msg){
                            console.log(msg, "Successfully registered and added to database!");
                        });
                    }else{
                        console.log("Something went wrong!");
                    }
                });
            });
            return true;
        } catch(err) {
            console.log("Error: ", err);
        }
    }
    async loginProcess(students) {
        try {
            let userExist = await this.get_all_users(students.email);
            if(userExist){
                if(userExist.password == students.password){
                    return Promise.resolve(userExist);
                }
            }else{
                return Promise.resolve(false);
            }
        } catch(err) {
            console.log("Error: ", err);
        }
    }
    get_all_users(email) {
        return new Promise((resolve, reject)=>{
            let client = this.client;
            client.hgetall(email, function(err, data){
                if(data){
                    return resolve(data); 
                }else{
                    return resolve(false);
                }
            });
        });
    }
}
module.exports = new User;