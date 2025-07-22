const express = require("express");

const app = express();
const {PORT} = require("./config/serverConfig");
const appRoutes = require("./Routes/index");
const errorHandler = require("./middlewares/errorHandler");

const prepareAndStartServer = ()=>{
    app.use(express.json());
    app.use("/api",appRoutes);


    app.use(errorHandler);
    app.listen(PORT,(error)=>{
        if(error) {
            console.log("Error while started the auth server");
            process.exit(1); // stop the server
        }
        console.log(`Auth server started at port: ${PORT}`);
    })
}

prepareAndStartServer();
