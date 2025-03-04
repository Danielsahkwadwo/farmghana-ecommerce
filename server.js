const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const mongoDB= process.env.DATABASE.replace('<password>',"ecommerce616263")

mongoose
  .connect(mongoDB)
  .then((data) => {
   console.log('database connected successfully')
  })
  .catch((err) => {
    console.log(err.message);
  });

  const server = app.listen(process.env.PORT ?? 3000, () => {
    console.log(`server started on port ${process.env.PORT}`);
  });

  process.on('unhandledRejection', err=>{
    console.log(err.message)
    server.close(()=>{
      process.exit(1)
    })
  })
  
  process.on('uncaughtException', err=>{
    console.log(err.message)
    server.close(()=>{
      process.exit(1)
    })
  })