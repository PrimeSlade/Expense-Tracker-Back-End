const upadateAmount = async (user_id, amount, knex) => {
  try {
    const [user] = await knex("users")
      .where({ id: user_id })
      .update({
        amount: amount,
      })
      .returning(["name", "email", "amount", "currency"]);

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = upadateAmount;
