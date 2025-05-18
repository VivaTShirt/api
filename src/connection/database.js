import { Sequelize } from "sequelize";
import 'dotenv/config'

class Database{
  
  constructor() {
    this.sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      dialect: 'mysql'
    });
  }


  getInstace() {
    return this.sequelize;
  }

}

const databaseInstance = new Database().getInstace();

export {databaseInstance};