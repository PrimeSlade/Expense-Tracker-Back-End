const logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.json("cookie is removed");
};

module.exports = logout;
