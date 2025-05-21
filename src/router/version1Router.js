import express from "express";

//rotas
import { customerRouter } from "./customerRouter.js";

const version1Router = express.Router();

version1Router.use(`/customer`, customerRouter);

export {version1Router};