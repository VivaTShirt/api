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
                document: DataTypes.STRING,
                password: DataTypes.STRING,
                address_id: DataTypes.INTEGER,
                token: DataTypes.STRING
            },
            {
                tableName: "customer"
            }
        );
    }

    getModel(){
        return databaseInstance.models.customer;
    }

}

const Customer = new CustomerModel().getModel();

export {Customer};