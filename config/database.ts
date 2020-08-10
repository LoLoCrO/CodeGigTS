import { Sequelize } from "sequelize";

const db = new Sequelize("codegig", "root", null, {
  host: "localhost",
  dialect: "mysql",
});

export default db;
