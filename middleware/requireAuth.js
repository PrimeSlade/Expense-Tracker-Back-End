const knex = require("../knex/knex");
const json = require("jsonwebtoken");

//middleware to check if the token is valid or not
const requireAuth = async (req, res, next) => {
  //get token from cookie
  const token = req.cookies.jwt;

  if (!token)
    return res.status(401).json({ error: "Authenticaion token requried" });

  try {
    //verify that jwt is valid or not
    const { id } = json.verify(token, process.env.SECRETEKEY);

    const [user] = await knex.select("id").from("users").where({ id: id });

    //store in the req.user
    req.user = user.id;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
