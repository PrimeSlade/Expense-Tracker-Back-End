const knex = require("../../knex/knex");
const amountSelector = require("../../utils/amountSelector");
const upadateAmount = require("../../utils/upadateAmount");

const deleteList = async (req, res) => {
  //get user id from middleware
  const user_id = req.user;
  //get id from params
  const id = parseInt(req.params.id);

  //get amount from db
  const prevAmount = await amountSelector(user_id);

  knex.transaction(async (trx) => {
    try {
      //del from datas
      const [{ cost }] = await trx("datas")
        .where({
          id: id,
          user_id: user_id,
        })
        .del()
        .returning("cost");

      //upadate amount
      await upadateAmount(user_id, prevAmount + Number(cost), trx);

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
