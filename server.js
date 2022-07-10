const { MongoClient, ObjectID } = require("mongodb");
const Express = require("express");
const BodyParser = require("body-parser");
const Cors = require("cors");

const server = Express();

server.use(BodyParser.json());
server.use(BodyParser.urlencoded({ extended: true }));
server.use(Cors());

server.listen("3000", async () => {
    try {
        console.log("Listening at port 3000...");
    } catch (e) {
        console.error(e);
    }
});