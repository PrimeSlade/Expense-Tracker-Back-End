const typeSelector = async (user_id, id, knex) => {
  try {
    const [{ transaction_type }] = await knex
      .select("transaction_type")
      .from("datas")
      .where({
        user_id: user_id,
        id: id,
      });

    return transaction_type;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = typeSelector;
