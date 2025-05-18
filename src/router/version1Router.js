import express from "express";

//rotas
import { userRouter } from "./userRouter.js";


const version1Router = express.Router();

version1Router.use(`/user`, userRouter);

export {version1Router};