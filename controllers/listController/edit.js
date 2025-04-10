const knex = require("../../knex/knex.js");
const amountSelector = require("../../utils/amountSelector.js");
const upadateAmount = require("../../utils/upadateAmount.js");
const typeSelector = require("../../utils/typeSelector.js");

const calcNewAmount = (cost, prevAmount, newCost, transaction_type) => {
  if (transaction_type === "Expense") {
    return Number(cost) + prevAmount - newCost;
  } else if (transaction_type === "Income") {
    return prevAmount - Number(cost) + newCost;
  }
};

const edit = async (req, res) => {
  const user_id = req.user;
  const { category, note, created_at, newCost, transaction_type } = req.body;
  const id = parseInt(req.params.id);

  //get amount from db
  const prevAmount = await amountSelector(user_id, knex);

  knex.transaction(async (trx) => {
    try {
      //might slow performance
      const [{ cost }] = await trx("datas")
        .select("cost")
        .where({ user_id: user_id, id: id }); //String

      const [data] = await trx("datas")
        .where({ user_id: user_id, id: id })
        .update({
          category: category,
          note: note,
          created_at: created_at,
          cost: newCost,
          transaction_type: transaction_type,
        })
        .returning([
          "id",
          "category",
          "note",
          "created_at",
          "cost",
          "transaction_type",
        ]);

      //if the user changes cost
      if (newCost) {
        const type = await typeSelector(user_id, id, trx);
        const newAmount = calcNewAmount(cost, prevAmount, newCost, type);
        await upadateAmount(user_id, newAmount, trx);
      }

      await trx.commit();

      res.status(200).json(data);
    } catch (error) {
      await trx.rollback();

      console.error(error);
      json.status(400).json({ error: "Could not edit a list" });
    }
  });
};

module.exports = edit;
