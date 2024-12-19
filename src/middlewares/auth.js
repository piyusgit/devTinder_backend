const adminAuth = (req, res, next) => {
  // logic here for admin is authorized
  console.log("Admin auth Middleware");
  const token = "admin";
  const isAdminAuthorized = token === "admin";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  // logic here for admin is authorized
  console.log("user auth Middleware");
  const token = "admin";
  const isAdminAuthorized = token === "admin";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
