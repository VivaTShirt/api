import { DataTypes } from "sequelize";
import { databaseInstance } from "../connection/database.js";

class AddressModel {
    constructor() {
        databaseInstance.define('address', 
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                address: DataTypes.STRING,
                address_number: DataTypes.STRING,
                neighborhood: DataTypes.STRING,
                city: DataTypes.STRING,
                state: DataTypes.INTEGER,
                is_active: DataTypes.BOOLEAN,
                customer_id: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'customer',
                        key: 'id'
                    }
                }
            },
            {
                tableName: "address"
            }
        );
    }

    getModel(){
        return databaseInstance.models.address;
    }

}

const Address = new AddressModel().getModel();

export {Address};