const knex = require('../knex/knex');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid'); // uuid 

//register
const register = async(req,res) => {
    const {name,email,password} = req.body;

    //Checking if the email, name and password are empty or not!
    if(!name || !email ||!password){
        res.json("Could not register !!!");
        return;
    }

    //check if the email is valid
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(email)){
        return res.status(400).json("Invalid email address!!");
    }

    //check if the password len is at least 6
    if(password.length < 6){
        return res.status(400).json("Password length must be over 6 or at least 6");
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password,salt);

    //use trx when we have more than one operation
    knex.transaction(async trx => {
        try {
            //insert into users
            const [user] = await trx('users').insert({
                id: uuidv4(),
                name: name,
                email: email,
                joined: new Date(),
                amount: 0
            }).returning('id');
            
            // //insert into passwords
            const password = await trx('passwords').insert({
                hash: hash,
                user_id: user.id
            })
            
            await trx.commit();
            res.status(201).json(user);

        } catch (error) {
            await trx.rollback();
            console.log(error);
            res.status(400).send(error.detail);
        }
    })

}

module.exports = register;