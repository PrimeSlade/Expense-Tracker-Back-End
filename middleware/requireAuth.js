const knex = require("../knex/knex");
const json = require("jsonwebtoken");

//middleware to check if the token is valid or not
const requireAuth = async (req, res, next) => {
  //get token from cookie
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send("Token is required");
  }

  const bearerToken = token.split(" ")[1];

  if (!bearerToken) {
    return res.status(403).send("Bearer token is missing");
  }

  try {
    //verify that jwt is valid or not
    const { id } = json.verify(bearerToken, process.env.SECRETKEY);

    const [user] = await knex.select("id").from("users").where({ id: id });

    //store in the req.user
    req.user = user.id;

    next();
  } catch (error) {
    console.log("been there");
    console.log(error);
    res.status(401).json({ error: "Access token is not authorized" });
  }
};

module.exports = requireAuth;
