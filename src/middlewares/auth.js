const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAuthorised = token === "xyz";

  if (isAuthorised) {
    next();
  } else {
    res.status(401).send("Not authorised");
  }
};

const userAuth = (req, res, next) => {
  const token = "xyz";
  const isAuthorised = token === "xyz";

  if (isAuthorised) {
    next();
  } else {
    res.status(401).send("user Not authorised");
  }
};




module.exports = {
  adminAuth, userAuth
}