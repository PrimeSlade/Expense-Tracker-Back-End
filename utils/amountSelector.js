const knex = require('../knex/knex.js');

const amountSelector = async(user_id) => {
    const [{amount}] = await knex.select('amount').where({id:user_id}).from('users');
    const prevAmount = Number(amount);

    return prevAmount;
}

module.exports = amountSelector;