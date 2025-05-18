import express from "express";
import { version1Router } from "./src/router/version1Router.js";

const app = express();
const port = 3000

//routes
app.use("/v1", version1Router);


//main
app.get('/', (req, res) => {

  res.send("API V1 VivaTshirt");

});

app.listen(port, () => {
  console.log(`App de exemplo esta rodando na porta ${port}`)
});