const knex = require("../../knex/knex.js");
const amountSelector = require("../../utils/amountSelector.js");
const upadateAmount = require("../../utils/upadateAmount.js");

const calcNewAmount = (cost, prevAmount, newCost) => {
  return Number(cost) + prevAmount - newCost;
};

const edit = async (req, res) => {
  const user_id = req.user;
  const { categories, note, created_at, newCost, icon_name } = req.body;
  const id = parseInt(req.params.id);

  //get amount from db
  const prevAmount = await amountSelector(user_id, knex);

  //check whether the amount is greater than or not
  if (prevAmount < newCost) {
    res.status(400).json({ error: "insufficient amount" });
    return;
  }

  knex.transaction(async (trx) => {
    try {
      //might slow performance
      const [{ cost }] = await trx("datas")
        .select("cost")
        .where({ user_id: user_id, id: id }); //String

      const [data] = await trx("datas")
        .where({ user_id: user_id, id: id })
        .update({
          categories: categories,
          note: note,
          created_at: created_at,
          cost: newCost,
          icon_name: icon_name,
        })
        .returning([
          "id",
          "categories",
          "note",
          "created_at",
          "cost",
          "icon_name",
        ]);

      //if the user changes cost
      if (newCost) {
        const newAmount = calcNewAmount(cost, prevAmount, newCost);
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
