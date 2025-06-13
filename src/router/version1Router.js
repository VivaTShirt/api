import express from "express";

//rotas
import { customerRouter } from "./customerRouter.js";
import { addressRouter } from "./addressRouter.js";

const version1Router = express.Router();

version1Router.use(`/customer`, customerRouter);
version1Router.use(`/address`, addressRouter);

export {version1Router};