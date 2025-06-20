import express from "express";
import session from 'express-session';
import { version1Router } from "./src/router/version1Router.js";
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config();

const app = express();
const port = 3000

// passa a aplicação para application/json
app.use(express.json());

//configura o session
app.use(session({
  secret: process.env.SESSION_SECRET_PASS,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false // Deixa `false` para desenvolvimento (sem HTTPS). Em produção, coloque `true` se usar HTTPS.
  }
}));

console.log(process.env.SPA_APPLICATION_URL);

//configura o cors
var corsOptions = {
  origin: process.env.SPA_APPLICATION_URL,
  optionsSuccessStatus: 200,
  credentials: true
}

app.use("/v1", cors(corsOptions), version1Router);

//main
app.get('/', (req, res) => {

  return res.send("API V1 VivaTshirt");

});

app.listen(port, () => {
  console.log(`App de exemplo esta rodando na porta ${port}`)
});