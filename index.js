import express from "express";
import { version1Router } from "./src/router/version1Router.js";
import cors from 'cors';

const app = express();
const port = 3000

app.use(express.json());// passa a aplicação para application/json

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

app.use("/v1", cors(corsOptions), version1Router);


//main
app.get('/', (req, res) => {

  return res.send("API V1 VivaTshirt");

});

app.listen(port, () => {
  console.log(`App de exemplo esta rodando na porta ${port}`)
});