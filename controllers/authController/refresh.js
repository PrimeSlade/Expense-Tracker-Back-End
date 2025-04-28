const json = require("jsonwebtoken");
const knex = require("../../knex/knex");
const {
  createAccessToken,
  createRefreshToken,
} = require("../../utils/tokenGenerator");

const refresh = async (req, res) => {
  const token = req.cookies.jwt;

  if (!token)
    return res.status(401).json({ error: "Authenticaion token requried" });

  try {
    const { id } = json.verify(token, process.env.SECRETREFRESHKEY);

    const [user] = await knex.select("id").from("users").where({ id: id });

    if (!user) return res.status(404).json({ error: "User not found" });

    const accessToken = createAccessToken(id);
    const refreshToken = createRefreshToken(id);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = refresh;
