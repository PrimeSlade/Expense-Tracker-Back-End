const knex = require("../../knex/knex.js");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid"); // uuid

//register
const register = async (req, res) => {
  const { name, email, password, amount } = req.body;

  //Checking if the email, name and password are empty or not!
  if (!name || !email || !password || !amount) {
    res.json("Could not register !!!");
    return;
  }

  //check if the email is valid
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address!!" });
  }

  //check if the password len is at least 6
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password length must be over 6 or at least 6" });
  }

  //salt
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);

  //use trx when we have more than one operation
  knex.transaction(async (trx) => {
    try {
      //insert into users
      const [user] = await trx("users")
        .insert({
          id: uuidv4(),
          name: name,
          email: email,
          joined: new Date(),
          amount: amount,
          currency: "THB",
          img_url:
            "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg",
        })
        .returning("id");

      // //insert into passwords
      const password = await trx("passwords").insert({
        hash: hash,
        user_id: user.id,
      });

      await trx.commit();
      res.status(201).json(user);
    } catch (error) {
      await trx.rollback();
      console.log(error);
      res.status(400).send({ error: error.detail });
    }
  });
};

module.exports = register;
