const knex = require("../../knex/knex");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRETEKEY, { expiresIn: "3d" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //find email in the database
    const [user] = await knex
      .select("email", "id", "img_url", "name")
      .from("users")
      .where({ email: email });

    //if not valid send 400
    if (!user) return res.status(400).json({ error: "Email is invalid !!!" });

    //check password is valid
    const [userPassword] = await knex
      .select("hash")
      .from("passwords")
      .where({ user_id: user.id });
    const isValid = bcrypt.compareSync(password, userPassword.hash);
    if (!isValid)
      return res.status(400).json({ error: "password is incorrect !!!" });

    const token = createToken(user.id);

    //send cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

module.exports = login;
