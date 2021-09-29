const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const session = require("express-session");
const { google } = require("googleapis");

const Client_Id = "673782142776-u14jcqe3ilfip29brfvg9gvufji3jqkr.apps.googleusercontent.com";
const Client_Secret = "WPmpTNEoy7x5QDcavFnSDiF6";
const Redirection_Url = "http://localhost:4000/api/event/oauthcallback";

const client = new google.auth.OAuth2(
    Client_Id,
    Client_Secret,
    Redirection_Url
);

const PORT = process.env.PORT || 4000;

app.set("view engine", "ejs");
app.use(bodyParser.json());

app.get('/', function(req, res) {
    var url = getAuthUrl();
    res.render("login", { url: url });
});

app.use(session({
    secret: "NoSecretForSession",
    resave: true,
    saveUninitialized: true
}));

function getAuthUrl() {
    var scopes = [
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/calendar'
    ];
    var url = client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
    return url;
}

app.get("/api/event/oauthcallback", function(req, res) {
    var session = req.session;
    var code = req.query.code;
    client.getToken(code, function(err, tokens, body) {
        session.tokens = tokens;
        console.log(tokens);
        client.setCredentials(tokens);
    });
    res.render("event");
})

app.listen(PORT, function() {
    console.log("listeneing on 4000 PORT");
});
