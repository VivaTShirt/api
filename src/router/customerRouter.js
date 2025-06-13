import express from "express";
import { verifyJwt } from "../middleware/auth.js";
import { body, validationResult } from "express-validator";
import { CustomerController } from "../controller/customerController.js";

const customerRouter = express.Router();

customerRouter.get('/:id/address',[
  param('id').exists().withMessage("ID de usuário é obrigatório.").notEmpty().withMessage("ID de usuário inválido."),
], verifyJwt, (req, res) => {
    CustomerController.listAdresses(req.params.id)
    .then(customer => {       
        return res.send(customer);
    })
    .catch(error => {
        return res.status(500).send({ error: error.message });
    });
});

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
            return res.status(400).send({
                missing: validate.array()
            });
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

customerRouter.put('/update/:id', [
        param('id').exists().withMessage("ID de usuário inválido.").notEmpty().withMessage("ID de usuário inválido."),
        body('email').exists().withMessage("Email é obrigatório.").notEmpty().withMessage("Email Inválido.").notEmpty().withMessage("Preencha o email."),
        body('name').exists().withMessage("Nome é obrigatório.").notEmpty().withMessage("Preencha o nome."),
        body('document').exists().withMessage("Documento é obrigatório.").notEmpty().withMessage("Preencha o documento.")
    ], verifyJwt, (req, res) => {

        const validate = validationResult(req);

        if (validate.isEmpty() == false) {
            return res.status(400).send({
                missing: validate.array()
            });
        }

        CustomerController.update(req.params.id, req.body.name, req.body.email, req.body.document)
        .then(customer => {
            return res.send(customer);
        })
        .catch(error => {
            return res.status(500).send({ error: error.message });
        });

});

customerRouter.delete('/delete/:id', [
        param('id').exists().withMessage("ID de usuário inválido.").notEmpty().withMessage("ID de usuário inválido.")
    ], verifyJwt, (req, res) => {

        CustomerController.delete(req.params.id)
        .then(customer => {
            return res.send(customer);
        })
        .catch(error => {
            return res.status(500).send({ error: error.message });
        });

});

customerRouter.patch('/update-password/:id', [
        param('id').exists().withMessage("ID de usuário inválido.").notEmpty().withMessage("ID de usuário inválido."),
        body('old_password').exists().withMessage("Senha antiga é obrigatória.").notEmpty().withMessage("Preencha a senha antiga."),
        body('new_password').exists().withMessage("Nova senha é obrigatória.").notEmpty().withMessage("Preencha a nova senha.")
    ], verifyJwt, (req, res) => {

        const validate = validationResult(req);

        if (validate.isEmpty() == false) {
            return res.status(400).send({
                missing: validate.array()
            });
        }

        CustomerController.updatePassword(req.params.id, req.body.old_password, req.body.new_password)
        .then(customer => {
            return res.send(customer);
        })
        .catch(error => {
            return res.status(500).send({ error: error.message });
        });

});

export {customerRouter};