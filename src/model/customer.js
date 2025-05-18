import { DataTypes } from "sequelize";
import { databaseInstance } from "../connection/database.js";

class CustomerModel {
    constructor() {
        databaseInstance.define('customer', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            address: DataTypes.INTEGER,
            number: DataTypes.STRING,
            neighborhood: DataTypes.STRING,
            city: DataTypes.STRING,
            state: DataTypes.STRING
        });
    }

    getModel(){
        return databaseInstance.models.customer;
    }

}

const Customer = new CustomerModel().getModel();

export {Customer};