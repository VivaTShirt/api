import express from "express";

//rotas
import { customerRouter } from "./customerRouter.js";
import { addressRouter } from "./addressRouter.js";
import { personalAccessTokenRouter } from "./personalAcessTokenRouter.js";
import { googleRouter } from "./googleRouter.js";

const version1Router = express.Router();

version1Router.use(`/customer`, customerRouter);
version1Router.use(`/address`, addressRouter);
version1Router.use(`/token`, personalAccessTokenRouter);
version1Router.use(`/google`, googleRouter);

export {version1Router};