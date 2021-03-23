var env = {};
env.development = {
  env: "dev",
  ApiHost: "http://localhost:8080/",
};

env.production = {
  env: "prod",
  ApiHost: "https://wewin.bigbirdgo.com/",
};

module.exports = env[process.env.NODE_ENV || "prod"];
