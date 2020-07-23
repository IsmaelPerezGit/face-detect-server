const express = require("express");
const app = express();
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const pg = knex({
    client: "pg",
    connection: {
        host: "127.0.0.1",
        user: "ismaelperez",
        password: "",
        database: "facedetect",
    },
});

pg.select("*")
    .from("users")
    .then(data => {
        console.log(data);
    });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const db = {
    users: [
        {
            id: "123",
            name: "John",
            email: "John@email.com",
            password: "password",
            entries: 0,
            joined: new Date(),
        },
        {
            id: "124",
            name: "Sally",
            email: "Sally@email.com",
            password: "password",
            entries: 0,
            joined: new Date(),
        },
    ],
};

app.get("/", (req, res) => {
    res.send(db.users);
});

app.post("/signin", (req, res) => {
    if (
        req.body.email === db.users[0].email &&
        req.body.password === db.users[0].password
    ) {
        res.json(db.users[0]);
    } else {
        res.status(400).json("error logging in...");
    }
});

app.post("/register", (req, res) => {
    const { email, name, password } = req.body;

    pg("users")
        .returning("*")
        .insert({ email, name, joined: new Date() })
        .then(user => res.json(user[0]))
        .catch(err => res.status(400).json("Unable to register..."));
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
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json("unable to get entries"));
});

app.listen(4000, () => {
    console.log("App listening on port 3000");
});
