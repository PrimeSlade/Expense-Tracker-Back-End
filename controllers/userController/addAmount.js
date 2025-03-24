const knex = require("../../knex/knex.js");
const amountSelector = require("../../utils/amountSelector");

const addAmount = async (req, res) => {
  //need to add change curr
  const user_id = req.user;
  const { amount } = req.body;
  const newAmount = Number(amount);

  const prevAmount = await amountSelector(user_id);

  try {
    const [user] = await knex("users")
      .where({ id: user_id })
      .update({
        amount: newAmount + prevAmount,
      })
      .returning(["name", "email", "amount", "currency"]);

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Could not add an amount" });
  }
};

module.exports = addAmount;
