const express = require("express");

const app = express();
const {PORT} = require("./config/serverConfig");

const prepareAndStartServer = ()=>{
    app.use(express.json());

    app.listen(PORT,(error)=>{
        if(error) {
            console.log("Error while started the auth server");
            process.exit(1); // stop the server
        }
        console.log(`Auth server started at port: ${PORT}`);
    })
}

prepareAndStartServer();
