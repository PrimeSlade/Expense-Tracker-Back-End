require('dotenv').config(); 
const user = process.env.USER;
const password = process.env.DBPASSWORD;

const knex = require('knex')({
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: user,
      password: password,
      database: 'Expense Tracker',
    },
  });

module.exports = knex;