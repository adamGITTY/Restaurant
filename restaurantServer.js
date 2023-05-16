const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
process.stdin.setEncoding("utf8");
const Mong = require("./mongo.js");
let portNumber = 3000;

app.use(bodyParser.urlencoded({extended:false}));
app.set("views", path.resolve(__dirname, "pages"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/pages'));
let mongo = new Mong();


app.get("/", (request, response) => {
    response.render("index", {});
})

app.get("/menu", (request, response) => {
    response.render("menu", {});
})

app.get("/order", (request, response) => {
    response.render("order", {});
})

app.get("/find", (request, response) => {
    response.render("find", {msg: ""});
})

app.post("/order", async (request, response) => {
    let {name, email, pn, addy, apps, meals, drinks, deserts, comments} = request.body;
    await mongo.insertApp(name, email, pn, addy, apps, meals, drinks, deserts, comments).catch(console.error);;
    let variables = {
        name: name,
        addy: addy,
        pn: pn,
        cm: comments,
        em: email,
        apps: apps,
        meals: meals,
        drinks: drinks,
        deserts: deserts
    }
    response.render("orderConf", variables);
})

app.post("/find", async (request, response) => {
    let {name} = request.body;
    let found = await mongo.findOne(name).catch(console.error);;
    if (found == "None"){
        response.render("find", {msg: "Your Name Could Not Be Found"});
    }
    else {
        let variables = {
            name: found.name,
            addy: found.address,
            pn: found.phoneNumber,
            cm: found.comments,
            em: found.email,
            apps: found.appetizers,
            meals: found.meals,
            drinks: found.drinks,
            deserts: found.deserts
        }
        response.render("orderConf", variables);
    }
})


app.listen(portNumber);
console.log(`Web server started and running at http://localhost:${portNumber}`);