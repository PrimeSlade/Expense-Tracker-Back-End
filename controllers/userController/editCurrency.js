const knex = require("../../knex/knex.js");
const API_KEY = process.env.API_KEY;
const amountSelector = require("../../utils/amountSelector.js");
const upadateAmount = require("../../utils/upadateAmount.js");

//for converting
const convert = (prevAmount, rate) => {
  return Math.round(prevAmount * rate); //need to check later VERY IMPORTANT
};

const editCurrency = async (req, res) => {
  const user_id = req.user;
  const { newCurrency } = req.body;

  try {
    //select currency
    const [{ currency }] = await knex
      .select("currency")
      .from("users")
      .where({ id: user_id });

    //fetch currency api
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${currency}`
    );
    const { conversion_rates } = await response.json();

    //getting costs from datas
    const list = await knex
      .select(["id", "cost"])
      .where({ user_id: user_id })
      .from("datas");

    knex.transaction(async (trx) => {
      try {
        //get amount from db
        const prevAmount = await amountSelector(user_id, trx);

        //updating user
        const newAmount = convert(prevAmount, conversion_rates[newCurrency]);

        await upadateAmount(user_id, newAmount, trx, newCurrency);

        //updating datas
        await Promise.all(
          list.map(async (l) => {
            const newMoney = Number(l.cost);
            const newCost = convert(newMoney, conversion_rates[newCurrency]);

            await trx("datas").where({ id: l.id }).update({
              cost: newCost,
            });
          })
        );

        await trx.commit();
        res.status(200).json("successful");
      } catch (error) {
        await trx.rollback();
        console.error(error);
        res.status(400).json({ error: "could not change currency" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "could not get rates" });
  }
};

module.exports = editCurrency;
