const knex = require("../../knex/knex");
const amountSelector = require("../../utils/amountSelector");
const upadateAmount = require("../../utils/upadateAmount");

const create = async (req, res) => {
  //get id from middleware
  const user_id = req.user;

  const { category, note, created_at, cost, transaction_type } = req.body;

  //get amount from db
  const amount = await amountSelector(user_id, knex);

  knex.transaction(async (trx) => {
    try {
      if (transaction_type === "Expense") {
        await upadateAmount(user_id, amount - cost, trx);
      } else if (transaction_type === "Income") {
        await upadateAmount(user_id, amount + cost, trx);
      }
      //create new list
      const [data] = await trx("datas")
        .insert({
          category: category,
          note: note,
          created_at: created_at,
          cost: cost,
          user_id: user_id,
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

      await trx.commit();
      res.status(200).json(data);
    } catch (error) {
      await trx.rollback();
      console.error(error);
      res.status(400).json({ error: "could not create a new list" });
    }
  });
};

module.exports = create;
