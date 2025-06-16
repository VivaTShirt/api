import { DataTypes } from "sequelize";
import { databaseInstance } from "../connection/database.js";

class personalAccessTokenModel {
    constructor() {
        databaseInstance.define('personal_access_token', 
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true, // Se o ID for gerado automaticamente pelo banco de dados
                    allowNull: false,
                },
                tokenable_type: {
                    type: DataTypes.TEXT, // Sequelize mapeia TEXT para VARCHAR(255) ou similar por padrão, ou TEXT se for maior
                    allowNull: false,
                },
                tokenable_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                name: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                token: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    unique: true, // Tokens geralmente são únicos
                },
                abilities: {
                    type: DataTypes.TEXT, // Assumindo que é uma string JSON ou texto puro de habilidades
                    allowNull: true, // 0 no seu dado indica que é NULLABLE
                },
                last_used_at: {
                    type: DataTypes.DATE, // Mapeia DATETIME para DATE no Sequelize
                    allowNull: true, // 0 no seu dado indica que é NULLABLE
                },
                expires_at: {
                    type: DataTypes.DATE,
                    allowNull: true, // 0 no seu dado indica que é NULLABLE
                }
            },
            {
                // Opções do modelo
                tableName: 'personal_access_token', // Nome real da tabela no banco de dados
            }
        );
    }

    getModel(){
        return databaseInstance.models.personal_access_token;
    }

}

const personalAccessToken = new personalAccessTokenModel().getModel();

export {personalAccessToken};