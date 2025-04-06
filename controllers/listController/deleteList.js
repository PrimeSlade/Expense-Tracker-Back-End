const knex = require("../../knex/knex");
const amountSelector = require("../../utils/amountSelector");
const upadateAmount = require("../../utils/upadateAmount");
const typeSelector = require("../../utils/typeSelector");

const deleteList = async (req, res) => {
  //get user id from middleware
  const user_id = req.user;
  //get id from params
  const id = parseInt(req.params.id);

  knex.transaction(async (trx) => {
    try {
      //get type from db
      const type = await typeSelector(user_id, id, trx);

      //get amount from db
      const prevAmount = await amountSelector(user_id, trx);
      //del from datas
      const [{ cost }] = await trx("datas")
        .where({
          id: id,
          user_id: user_id,
        })
        .del()
        .returning("cost");

      //upadate amount
      if (type === "Expense") {
        await upadateAmount(user_id, prevAmount + Number(cost), trx);
      } else if (type === "Income") {
        await upadateAmount(user_id, prevAmount - Number(cost), trx);
      }

      await trx.commit();

      res.status(200).json("successfully deleted");
    } catch (error) {
      await trx.rollback();

      console.error(error);
      json.status(400).json({ error: "Could not delete a list" });
    }
  });
};

module.exports = deleteList;
