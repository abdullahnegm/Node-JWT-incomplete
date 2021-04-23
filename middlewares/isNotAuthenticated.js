function isNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return res.redirect("/posts");
  return next();
}

module.exports = isNotAuthenticated;
