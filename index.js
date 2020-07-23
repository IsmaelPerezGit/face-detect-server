const express = require("express");
const app = express();
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const Clarifai = require("clarifai");
const CLARIFAI_KEY = require("./keys");

const pg = knex({
    client: "pg",
    connection: {
        host: "127.0.0.1",
        user: "ismaelperez",
        password: "",
        database: "facedetect",
    },
});

const clar = new Clarifai.App({
    apiKey: CLARIFAI_KEY,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send(db.users);
});

app.post("/signin", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json("incorrect form submission");
    }
    pg.select("email", "hash")
        .from("login")
        .where("email", "=", email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            isValid
                ? pg
                      .select("*")
                      .from("users")
                      .where("email", "=", email)
                      .then(user => res.json(user[0]))
                      .catch(err => res.status(400).json("unable to get user"))
                : res.status(400).json("wrong credentials");
        })
        .catch(err => res.status(400).json("wrong credentials"));
});

app.post("/register", (req, res) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json("incorrect form submission");
    }
    const hash = bcrypt.hashSync(password);
    pg.transaction(trx => {
        trx.insert({ hash, email })
            .into("login")
            .returning("email")
            .then(loginEmail => {
                return trx("users")
                    .returning("*")
                    .insert({ email: loginEmail[0], name, joined: new Date() })
                    .then(user => res.json(user[0]));
            })
            .then(trx.commit)
            .catch(trx.rollback);
    }).catch(err => res.status(400).json("Unable to register..."));
});

app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    pg.select("*")
        .from("users")
        .where({ id })
        .then(user =>
            user.length ? res.json(user[0]) : res.status(400).json("Not found")
        )
        .catch(err => res.status(400).json("Error getting user..."));
});

app.put("/image", (req, res) => {
    const { id } = req.body;
    pg("users")
        .where("id", "=", id)
        .increment("entries", 1)
        .returning("entries")
        .then(entries => res.json(entries[0]))
        .catch(err => res.status(400).json("unable to get entries"));
});

app.post("/imageurl", (req, res) => {
    clar.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json("unable to work with API"));
});

app.listen(4000, () => {
    console.log("App listening on port 3000");
});
