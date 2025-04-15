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
      .returning(["email", "id", "img_url", "name", "currency "]);

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

  const { oldPassword, newPassword } = req.body;

  //salt
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(newPassword, salt);

  try {
    //check if whether the pass is correct or not
    const [userPassword] = await knex
      .select("hash")
      .from("passwords")
      .where({ user_id: user.id });
    const isValid = bcrypt.compareSync(oldPassword, userPassword.hash);

    if (!isValid) {
      res.json.status(400).json({ error: "Password does not match!" });
      return;
    }

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
