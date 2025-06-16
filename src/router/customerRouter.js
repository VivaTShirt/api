import express from "express";
import { verifyJwt } from "../middleware/auth.js";
import { body, validationResult, param } from "express-validator";
import { CustomerController } from "../controller/customerController.js";

const customerRouter = express.Router();

customerRouter.get('/:id', verifyJwt, (req, res) => {
    
    CustomerController.find(req.params.id)
    .then(customer => {       
        return res.send(customer);
    })
    .catch(error => {
        return res.status(500).send({ 
            error: error.message,
            trace: error.stack
        });
    });

});

customerRouter.post('/register', [
        body('email').exists().withMessage("Email é obrigatório.").notEmpty().withMessage("Email Inválido.").notEmpty().withMessage("Preencha o email."),
        body('password').exists().withMessage("Senha é obrigatória.").notEmpty().withMessage("Preencha a senha."),
        body('name').exists().withMessage("Nome é obrigatório.").notEmpty().withMessage("Preencha o nome.")
    ], (req, res) => {
    
        const validate = validationResult(req);

        if (validate.isEmpty() == false) {
            return res.status(400).send({
                missing: validate.array()
            });
        }
        
        CustomerController.register(req.body.name, req.body.email, req.body.password)
        .then(register => {
            return res.send(register);
        })
        .catch(error => {
            return res.status(500).send({ 
                error: error.message,
                trace: error.stack
            });
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

        console.log(req.body.email, req.body.password);
        

        CustomerController.login(req.body.email, req.body.password)
        .then(login => {       
            return res.send(login);
        }).catch(error => {
            return res.status(500).send({ 
                error: error.message,
                trace: error.stack
            });
        });

});

customerRouter.put('/update/:id', [
        param('id').exists().withMessage("O ID do usuário é obrigatório.").notEmpty().withMessage("Preencha o ID do usuário."),
        body('email').exists().withMessage("Email é obrigatório.").notEmpty().withMessage("Email Inválido.").notEmpty().withMessage("Preencha o email."),
        body('name').exists().withMessage("Nome é obrigatório.").notEmpty().withMessage("Preencha o nome.")
], verifyJwt, (req, res) => {

        const validate = validationResult(req);

        if (validate.isEmpty() == false) {
            return res.status(400).send({
                missing: validate.array()
            });
        }

        CustomerController.update(req.params.id, req.body.name, req.body.email)
        .then(customer => {
            return res.send(customer);
        }).catch(error => {
            return res.status(500).send({ 
                error: error.message,
                trace: error.stack
            });
        });

});

customerRouter.delete('/delete/:id', [
        param('id').exists().withMessage("O ID do usuário é obrigatório.").notEmpty().withMessage("Preencha o ID do usuário.")
    ], verifyJwt, (req, res) => {

        CustomerController.delete(req.params.id)
        .then(customer => {
            return res.send(customer);
        }).catch(error => {
            return res.status(500).send({ 
                error: error.message,
                trace: error.stack
            });
        });

});

//atualiza a  senha do usuário usando o codigo
customerRouter.patch('/update-password/:id', [
        param('id').exists().withMessage("O ID do usuário é obrigatório.").notEmpty().withMessage("Preencha o ID do usuário."),
        body('token').exists().withMessage("Token field is missed.").notEmpty().withMessage("Fill security token field."),
        body('old_password').exists().withMessage("Senha antiga é obrigatória.").notEmpty().withMessage("Preencha a senha antiga."),
        body('new_password').exists().withMessage("Nova senha é obrigatória.").notEmpty().withMessage("Preencha a nova senha.")
    ], verifyJwt, (req, res) => {

        const validate = validationResult(req);

        if (validate.isEmpty() == false) {
            return res.status(400).send({
                missing: validate.array()
            });
        }

        CustomerController.changePassword(req.params.id, req.body.old_password, req.body.new_password, req.body.token)
        .then(customer => {
            return res.send(customer);
        }).catch(error => {
            return res.status(500).send({ 
                error: error.message,
                trace: error.stack
            });
        });

});

//envia email de recuperação de senha
customerRouter.post('/forgot-password/mail', [
    body('email').exists().withMessage("Email é obrigatório.").notEmpty().withMessage("Preencha o email."),
], (req, res) => {

    const validate = validationResult(req);

    if (validate.isEmpty() == false) {
        return res.status(400).send({
            missing: validate.array()
        });
    }

    CustomerController.sendForgotPasswordCode(req.body.email).then((result) => {

        return res.send(result);

    }).catch(error => {
        return res.status(500).send({ 
            error: error.message,
            trace: error.stack
        });
    });

});

//lista endereços do usuário
customerRouter.get('/address/:id', [
    param('id').exists().withMessage("O ID do usuário é obrigatório.").notEmpty().withMessage("Preencha o ID do usuário.")
], verifyJwt, (req, res) => {

    const validate = validationResult(req);

    if (validate.isEmpty() == false) {
        return res.status(400).send({
            missing: validate.array()
        });
    }

    CustomerController.listAdresses(req.params.id).
    then((addresses) => {
        return res.send(addresses)
    }).catch(error => {
        return res.status(500).send({ 
            error: error.message,
            trace: error.stack
        });
    });

});

//retorna o endereço atual do usuario
customerRouter.get('/address/current/:id', [
    param('id').exists().withMessage("O ID do usuário é obrigatório.").notEmpty().withMessage("Preencha o ID do usuário.")
], verifyJwt, (req, res) => {

    const validate = validationResult(req);

    if (validate.isEmpty() == false) {
        return res.status(400).send({
            missing: validate.array()
        });
    }

    CustomerController.getCustomerAddress(req.params.id).
    then((address) => {
        return res.send(address)
    }).catch(error => {
            return res.status(500).send({ 
                error: error.message,
                trace: error.stack
            });
    });

});

export {customerRouter};