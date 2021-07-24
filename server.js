const connect = require("connect");
const serveStatic = require("serve-static");
const path = require("path");

connect()
    .use(serveStatic(__dirname))
    .listen(8080, function(){
        console.log("Server running on http://localhost:8080/demo");
    });