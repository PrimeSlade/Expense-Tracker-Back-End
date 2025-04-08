const knex = require("../../knex/knex");

const displayList = async (req, res) => {
  const user_id = req.user;

  try {
    const list = await knex
      .select([
        "id",
        "category",
        "note",
        "created_at",
        "cost",
        "icon_name",
        "transaction_type",
      ])
      .where({ user_id: user_id })
      .from("datas");

    res.status(200).json(list);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Could not display lists" });
  }
};

module.exports = displayList;
