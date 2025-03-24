const knex = require("../knex/knex.js");

const amountSelector = async (user_id) => {
  try {
    const [{ amount }] = await knex
      .select("amount")
      .where({ id: user_id })
      .from("users");
    const prevAmount = Number(amount);

    return prevAmount;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = amountSelector;
