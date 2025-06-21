import { Customer } from "../model/customer.js";
import { Address } from "../model/address.js";
import { mail } from "../mail/manager.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import Util from '../util/util.js';
import { v4 as uuidv4 } from 'uuid';
import { PersonalAccessTokenController } from "./personalAccessTokenController.js";

import dotenv from 'dotenv'
dotenv.config();

class Controller {

    async find(customerId){
        
        const customer = await Customer.findOne({ where: { id: customerId } });

        if (customer == null) {
            return {
                error: "Não há usuário."
            }
        } else {
            return customer;
        }

    }

    async register(name, email, password, token = null){
        // Permite que name, email, password e token sejam nulos

        // Só verifica duplicidade se email não for nulo
        if (email != null) {
            let data = await Customer.findOne({ where: { email: email } });
            if(data != null){
                return {
                    "error": "Usuário já existe."
                };
            }
        }

        // Criptografa a senha apenas se não for nula
        let hash = null;
        if (password != null) {
            const salt = bcrypt.genSaltSync(10);
            hash = bcrypt.hashSync(password, salt);
        }

        // Usa o token fornecido ou gera um novo
        const customerToken = token ?? uuidv4();

        // Cria o usuário mesmo com campos nulos
        const data = await Customer.create({
            name: name ?? null,
            email: email ?? null,
            password: hash,
            token: customerToken
        });

        // Só envia email se email não for nulo
        if(email != null){
            const templateFilePath = path.join(Util.getTemplatePath(import.meta.url), '../mail/template/welcome.html');
            fs.readFile(templateFilePath, 'utf8', (err, content) => {
                if (err) throw err;
                let plainHTML = content.toString().replace("{name}", name ?? "");
                mail.sendEmail(email, name ?? "", "Bem vinda ao VivaTshirt!", plainHTML);
            });
        }

        return {
            id: data.id,
            name: data.name,
            email: data.email,
            token: data.token,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    }

    async findCustomerByToken(customerToken){

        const customer = await Customer.findOne({ where: { token: customerToken } });

        if (customer == null) {
            return {
                error: "Não há usuário."
            }
        } else {

            //gerando o jwt
            let encodedJwt = jwt.sign({
                data: customer
            }, process.env.JWT_SECRET, { expiresIn: '45h' });

            return {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                token: customer.token,
                createdAt: customer.createdAt,
                updatedAt: customer.updatedAt,
                jwt_token: encodedJwt
            };
        }

    }

    async login(email, password){
        
        let customer = await Customer.findOne({
            where: { email: email},
            attributes: { include: ['password'] }
        });
        
        if(customer == null){
            return {
                "error": "Usuário não existe."
            };
        }
        
        if(bcrypt.compareSync(password, customer.password) == true){

            //gerando o jwt
            let encodedJwt = jwt.sign({
                data: customer
            }, process.env.JWT_SECRET, { expiresIn: '45h' });

            return {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                token: customer.token,
                createdAt: customer.createdAt,
                updatedAt: customer.updatedAt,
                jwt_token: encodedJwt
            };

        }else{
            return {
                "error": "A senha é inválida."
            };
        }

    }

    async update(customerId, name, email, password){

        const customer = await Customer.findOne({ where: { id: customerId } });

        if(customer == null){
            return {
                "error": "Usuário não existe."
            };
        }

        customer.update({            
            name: name,
            email: email
        });

        customer.save();

        return customer;

    }

    async delete(customerId){

        const customer = await Customer.findOne({ where: { id: customerId } });

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

    //envia o email de "esqueci a senha"
    async sendForgotPasswordCode(email) {
        
        const customer = await Customer.findOne({
            where:{
                email: email
            }
        });

        if (customer == null) {
            return {
                error: "Usuário não existe."
            }
        }

        const generatedCode = Util.generateCode(5);

        //registrar codigo no db..
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);//1hr ele expira
        await PersonalAccessTokenController.register("forgot_password", customer.id, customer.name, generatedCode, null, Date.now(), expiresAt);

        //enviar email com codigo...
        //recupera o caminho do template do email html...
        const templateFilePath = path.join(Util.getTemplatePath(import.meta.url), '../mail/template/forgotPassword.html');

        //busca pelo arquivo hmtl
        fs.readFile(templateFilePath, 'utf8', (err, content) => {
            if (err) throw err;
            
            //pega o html do template de emaisl e muda as variaveis na string...
            let plainHTML = content.toString().replace("{name}", customer.name);
            plainHTML = plainHTML.toString().replace("{code}", generatedCode);
            plainHTML = plainHTML.toString().replace("{reset_password_link}", "#");

            //envia email de esqueci senha
            mail.sendEmail(customer.email, customer.name, "Redefinição de Senha VivaTshirt", plainHTML);
        });

        return {
            "message": "O código de redefinição de senha foi enviado ao e-mail com sucesso."
        }

    }

    async changePassword(customerId, oldPassword, newPassword, code) {

        const customer = await Customer.findOne({
            where: { id: customerId },
            attributes: { include: ['password'] }
        });

        if(customer == null){
            return {
                "error": "Usuário não existe."
            };
        }

        const personalAT = await PersonalAccessTokenController.verifyByCode(code);

        if(personalAT.error){
            return personalAT;
        }

        if(bcrypt.compareSync(oldPassword, customer.password) == true){

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(newPassword, salt);

            customer.update({
                password: hash
            });

            customer.save();

            //deletar codigo de recuperação antes de retornar para usuario..
            await PersonalAccessTokenController.deleteAllRelated(customer.id);

            return {
                message: "Senha alterada com sucesso."
            };

        }else{
            return {
                "error": "A senha antiga é inválida."
            };
        }

    }
    
    //encontra todos os endereços desse ususario pelo id dele...
    async listAdresses(customerId) {
        
        return await Address.findAll({where: {customer_id: customerId}})

    }

    async getCustomerAddress(customerId){

        const address = await Address.findOne({where:
            {
                customer_id: customerId
            }
        });

        if (address == null) {
            return {
                error: "Não há endereço definido."
            }
        } else {
            return address;
        }

    }

}

const CustomerController = new Controller();

export {CustomerController}