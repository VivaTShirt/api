import express from "express";
import { verifyJwt } from "../middleware/auth.js";
import { body, param, validationResult } from "express-validator";
import { AddressController } from "../controller/addressController.js";

const addressRouter = express.Router();

addressRouter.get('/:id', verifyJwt, (req, res) => {
    
    AddressController.find(req.params.id)
    .then(address => {       
        return res.send(address);
    }).catch(error => {
        return res.status(500).send({ 
            error: error.message,
            trace: error.stack
        });
    });

});

addressRouter.post('/register', [
        body('address').exists().withMessage("Endereço é obrigatório.").notEmpty().withMessage("Endereço Inválido.").notEmpty().withMessage("Preencha o endereço."),
        body('address_number').exists().withMessage("Número é obrigatório.").notEmpty().withMessage("Preencha o número."),
        body('neighborhood').exists().withMessage("Bairro é obrigatório.").notEmpty().withMessage("Preencha o bairro."),
        body('city').exists().withMessage("Cidade é obrigatória.").notEmpty().withMessage("Preencha a cidade."),
        body('state').exists().withMessage("Estado é obrigatório.").notEmpty().withMessage("Preencha o estado.")
    ], verifyJwt, (req, res) => {
        
        //validando os dados
        const validate = validationResult(req);

        if (validate.isEmpty() == false) {
            return res.status(400).send({
                missing: validate.array()
            });
        }

        //registrando
        AddressController.register(req.body.address, req.body.address_number, req.body.neighborhood, req.body.city, req.body.state).then((address) => {
            return res.status(200).send(address);
        }).catch(error => {
            return res.status(500).send({ 
                error: error.message,
                trace: error.stack
            });
        });

});

addressRouter.put('/update/:id', [
        param('id').exists().withMessage("ID de endereço inválido.").notEmpty().withMessage("ID de endereço inválido."),
        body('address').exists().withMessage("Endereço é obrigatório.").notEmpty().withMessage("Endereço Inválido.").notEmpty().withMessage("Preencha o endereço."),
        body('address_number').exists().withMessage("Número é obrigatório.").notEmpty().withMessage("Preencha o número."),
        body('neighborhood').exists().withMessage("Bairro é obrigatório.").notEmpty().withMessage("Preencha o bairro."),
        body('city').exists().withMessage("Cidade é obrigatória.").notEmpty().withMessage("Preencha a cidade."),
        body('state').exists().withMessage("Estado é obrigatório.").notEmpty().withMessage("Preencha o estado.")
    ], verifyJwt, (req, res) => {
        
        //validando os dados
        const validate = validationResult(req);

        if (validate.isEmpty() == false) {
            return res.status(400).send({
                missing: validate.array()
            });
        }

        //editando
        AddressController.update(req.params.id, req.body.address, req.body.address_number, req.body.neighborhood, req.body.city, req.body.state).then((address) => {
            return res.status(200).send(address);
        }).catch(error => {
            return res.status(500).send({ 
                error: error.message,
                trace: error.stack
            });
        });

});

addressRouter.delete('/delete/:id', [
        param('id').exists().withMessage("ID de endereço inválido.").notEmpty().withMessage("ID de endereço inválido."),
], verifyJwt, (req, res) => {

    //validando os dados
    const validate = validationResult(req);

    if (validate.isEmpty() == false) {
        return res.status(400).send({
            missing: validate.array()
        });
    }

    //deletando
    AddressController.delete(req.params.id)
    .then((address) => {
        return res.status(200).send(address);
    }).catch(error => {
        return res.status(500).send({ 
            error: error.message,
            trace: error.stack
        });
    });

});

//muda o estado do endereço... status = false true
addressRouter.patch('/active/:id', [
    param('id').exists().withMessage("O ID do endereço é obrigatório.").notEmpty().withMessage("Preencha o ID do endereço."),
    body('customer_id').exists().withMessage("O ID do endereço é obrigatório.").notEmpty().withMessage("Preencha o ID do endereço."),
    body('status').exists().withMessage("O ID do endereço é obrigatório.").notEmpty().withMessage("Preencha o ID do endereço."),
], verifyJwt, (req, res) => {

    AddressController.toggleActive(req.params.id, req.body.customer_id, req.body.status).
    then((result) => {
        return res.send(result)
    }).catch(error => {
        return res.status(500).send({ 
            error: error.message,
            trace: error.stack
        });
    });

});

export {addressRouter};