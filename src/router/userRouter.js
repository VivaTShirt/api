import express from "express";
import { CustomerController } from "../controller/customerController.js";

const userRouter = express.Router();

userRouter.get('/all', (req, res) => {
    
    res.send(CustomerController.findAllOnJson());

});

export {userRouter};