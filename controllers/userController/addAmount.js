const knex = require("../../knex/knex.js");
const amountSelector = require("../../utils/amountSelector");
const upadateAmount = require("../../utils/upadateAmount.js");

const addAmount = async (req, res) => {
  //need to add change curr
  const user_id = req.user;
  const { amount } = req.body;
  const newAmount = Number(amount);

  try {
    const prevAmount = await amountSelector(user_id);

    const user = await upadateAmount(user_id, newAmount + prevAmount, knex);

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Could not add an amount" });
  }
};

module.exports = addAmount;
