const knex = require("../../knex/knex");
const amountSelector = require("../../utils/amountSelector");

const deleteList = async (req, res) => {
  //get id from middleware
  const user_id = req.user;
  const id = parseInt(req.params.id);

  const prevAmount = await amountSelector(user_id);

  knex.transaction(async (trx) => {
    try {
      const [{ cost }] = await trx("datas")
        .where({
          id: id,
          user_id: user_id,
        })
        .del()
        .returning("cost");

      await trx("users")
        .where({ id: user_id })
        .update({
          amount: prevAmount + Number(cost),
        });

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
