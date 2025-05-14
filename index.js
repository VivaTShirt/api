const express = require('express')

const app = express();
const port = 3000

import userRouter from './src/router/userRouter.js';

app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`App de exemplo esta rodando na porta ${port}`)
});