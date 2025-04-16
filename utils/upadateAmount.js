const upadateAmount = async (user_id, amount, knex, currency) => {
  try {
    const [user] = await knex("users")
      .where({ id: user_id })
      .update({
        amount: amount,
        currency: currency,
      })
      .returning(["email", "id", "img_url", "name", "currency "]);

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = upadateAmount;
