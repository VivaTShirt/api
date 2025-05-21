import { Customer } from "../model/customer.js";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv'
dotenv.config();

class Controller {

    async findAll(){
        
        return await Customer.findAll();

    }

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
            }, 'secret', { expiresIn: '1h' });

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

}

const CustomerController = new Controller();

export {CustomerController}