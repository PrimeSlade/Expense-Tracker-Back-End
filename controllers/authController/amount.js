const knex = require("../../knex/knex");
const amountSelector = require("../../utils/amountSelector");

const amount = async (req, res) => {
  const user_id = req.user;

  try {
    const amount = await amountSelector(user_id, knex);
    res.status(200).json(amount);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "could not get your amount" });
  }
};

module.exports = amount;
