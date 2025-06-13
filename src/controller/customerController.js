import { Customer } from "../model/customer.js";
import { Address } from "../model/address.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv'
dotenv.config();

class Controller {

    // async findAll(){
        
    //     return await Customer.findAll();

    // }

    async find(requestedId){
        
        return await Customer.findOne({ where: { id: requestedId } });

    }

    async register(name, email, document, password){
        
        let data = await Customer.findOne({ where: { email: email } });

        if(data != null){
            return {
                "error": "Usuário já existe."
            };
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        data = await Customer.create({
            name: name,
            email: email,
            document: document,
            password: hash
        });

        return {
            name: data.name,
            email: data.email,
            document: data.document,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    }

    async login(email, password){
        
        let customer = await Customer.findOne({ where: { email: email} });

        if(customer == null){
            return {
                "error": "Usuário não existe."
            };
        }
        
        if(bcrypt.compareSync(password, customer.password) == true){

            //gerando o jwt
            let encodedJwt = jwt.sign({
                data: customer
            }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return {
                name: customer.name,
                email: customer.email,
                document: customer.document,
                createdAt: customer.createdAt,
                updatedAt: customer.updatedAt,
                token: encodedJwt
            };

        }else{
            return {
                "error": "A senha é inválida."
            };
        }

    }

    async update(requestedId, name, email, document, password){

        const customer = await Customer.findOne({ where: { id: requestedId } });

        if(customer == null){
            return {
                "error": "Usuário não existe."
            };
        }

        customer.update({            
            name: name,
            email: email,
            document: document
        });

        customer.save();

        return {
            message: "Usuário atualizado com sucesso."
        }

    }

    async delete(requestedId){

        const customer = await Customer.findOne({ where: { id: requestedId } });

        if(customer == null){
            return {
                "error": "Usuário não existe."
            };
        }

        customer.destroy();

        return {
            message: "Usuário deletado com sucesso."
        }

    }

    async findByEmail(email) {
        
        return await Customer.findOne({ where: { email: email } });

    }

    //encontra todos os endereços desse ususario pelo id dele...
    async listAdresses(requestedId) {
        
        return await Address.findAll({where: {customer_id: requestedId}})

    }

    async addAddress(requestedId, address, address_number, neighborhood, city, state) {

        const customer = await Customer.findOne({ where: { id: requestedId } });

        if(customer == null){
            return {
                "error": "Usuário não existe."
            };
        }

        const data = await Address.create({
            customer_id: requestedId,
            address: address,
            address_number: address_number,
            neighborhood: neighborhood,
            city: city,
            state: state
        });

        return {
            id: data.id,
            customer_id: data.customer_id,
            address: data.address,
            address_number: data.address_number,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        };

    }

    async updateAddress(requestedId, address, address_number, neighborhood, city, state) {

        const data = await Address.findOne({ where: { id: requestedId } });

        if(data == null){
            return {
                "error": "Endereço não existe."
            };
        }

        data.update({
            address: address,
            address_number: address_number,
            neighborhood: neighborhood,
            city: city,
            state: state
        });

        data.save();

        return {
            message: "Endereço atualizado com sucesso."
        };

    }

    async changePassword(requestedId, oldPassword, newPassword) {

        const customer = await Customer.findOne({ where: { id: requestedId } });

        if(customer == null){
            return {
                "error": "Usuário não existe."
            };
        }

        if(bcrypt.compareSync(oldPassword, customer.password) == true){

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(newPassword, salt);

            customer.update({
                password: hash
            });

            customer.save();

            return {
                message: "Senha alterada com sucesso."
            };

        }else{
            return {
                "error": "A senha antiga é inválida."
            };
        }

    }

}

const CustomerController = new Controller();

export {CustomerController}