const knex = require("../../knex/knex.js");
const bcrypt = require("bcrypt");

module.exports.info = async (req, res) => {
  const user_id = req.user;

  const { name, email } = req.body;

  //test whether the email is valid or not
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (email && !emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address!!" });
  }

  try {
    const [user] = await knex("users")
      .where({ id: user_id })
      .update({
        name: name,
        email: email,
      })
      .returning(["name", "email", "amount", "currency"]);

    if (user) {
      res.cookie("jwt", "", { maxAge: 1 });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Could not change user info" });
  }
};

module.exports.password = async (req, res) => {
  const user_id = req.user;

  const { password } = req.body;

  //check if the password len is at least 6
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password length must be over 6 or at least 6" });
  }

  //salt
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);

  try {
    const [pass] = await knex("passwords")
      .where({ user_id: user_id })
      .update({
        hash: hash,
      })
      .returning("hash");

    if (pass) {
      res.cookie("jwt", "", { maxAge: 1 });
    }

    res.status(200).json("Password successfully changed");
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Could not change your password" });
  }
};
