const isAdmin = (req, res, next) => {

  if (req.user.role !== "admin") {
    return res.status(403).send("Admin only access");
  }
  next();
};

module.exports = isAdmin;