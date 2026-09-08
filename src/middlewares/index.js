module.exports = {
  //Auth
  auth: require("./auth/auth"),
  isAdmin: require("./auth/isAdmin"),

  //Core
  errorHandler: require("./core/errorHadler"),
  isHealthyConnect: require("./core/isHealthyConnect"),
  unimplemented: require("./core/uninmplemented"),

  //Request
  injectRessource: require("./request/injectRessource"),
  setBodyParams: require("./request/setBodyParams"),
  setFilters: require("./request/setFilters"),

  //Validation
  validateBody: require("./validation/validateBody"),
  verifExist: require("./validation/verifExist"),
};
