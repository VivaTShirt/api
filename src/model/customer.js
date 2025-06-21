import { DataTypes } from "sequelize";
import { databaseInstance } from "../connection/database.js";

class CustomerModel {
    constructor() {
        databaseInstance.define('customer', 
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: DataTypes.STRING,
                email: DataTypes.STRING,
                password: DataTypes.STRING,
                token: DataTypes.STRING
            },
            {
                tableName: "customer",
                defaultScope: {
                    attributes: { exclude: ['password'] }
                }
            }            
        );
    }

    getModel(){
        return databaseInstance.models.customer;
    }

}

const Customer = new CustomerModel().getModel();

export {Customer};