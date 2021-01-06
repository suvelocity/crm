require("dotenv").config();
module.exports = {
  development: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    define: {
      underscored: true,
    },
    logging: false,
  },
  test: {
    username: "root",
    password: process.env.MYSQL_PASSWORD || null,
    database: process.env.MYSQL_DATABASE || "crm_test",
    host: process.env.MYSQL_HOST || '127.0.0.1',
    dialect: "mysql",
    define: {
      underscored: true,
    },
    logging: false,
  },
  production: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    define: {
      underscored: true,
    },
    logging: false,
  },
};
