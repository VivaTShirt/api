import express from "express";
import { verifyJwt } from "../middleware/auth.js";
import { body, validationResult } from "express-validator";
import { CustomerController } from "../controller/customerController.js";

const customerRouter = express.Router();

customerRouter.get('/:id', verifyJwt, (req, res) => {
    
    CustomerController.find(req.params.id)
    .then(customer => {       
        return res.send(customer);
    })
    .catch(error => {
        return res.status(500).send({ error: error.message });
    });

});

customerRouter.post('/register', [
        body('email').exists().withMessage("Email é obrigatório.").notEmpty().withMessage("Email Inválido.").notEmpty().withMessage("Preencha o email."),
        body('password').exists().withMessage("Senha é obrigatória.").notEmpty().withMessage("Preencha a senha."),
        body('name').exists().withMessage("Nome é obrigatório.").notEmpty().withMessage("Preencha o nome."),
        body('document').exists().withMessage("Documento é obrigatório.").notEmpty().withMessage("Preencha o documento.")
    ], (req, res) => {
    
        const validate = validationResult(req);

        if (validate.isEmpty() == false) {
            return res.status(400).send(validate.array());
        }
        
        CustomerController.register(req.body.name, req.body.email, req.body.document, req.body.password)
        .then(register => {       
            return res.send(register);
        })
        .catch(error => {
            return res.status(500).send({ error: error.message });
        });

});

customerRouter.post('/login', [
        body('email').exists().withMessage("Email é obrigatório.").isEmail().withMessage("Email Inválido.").notEmpty().withMessage("Preencha o email."),
        body('password').exists().withMessage("Senha é obrigatória.").notEmpty().withMessage("Preencha a senha.")
    ], (req, res) => {
        
        const validate = validationResult(req);

        if (validate.isEmpty() == false) {
            return res.status(400).send(validate.array());
        }

        CustomerController.login(req.body.email, req.body.password)
        .then(login => {       
            return res.send(login);
        })
        .catch(error => {
            return res.status(500).send({ error: error.message });
        });

});

export {customerRouter};