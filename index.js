const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
    res.send("Hello");
});

app.post("/signin", (req, res) => {
    if (
        req.body.email === db.users[0].email &&
        req.body.password === db.users[0].password
    ) {
        res.json("Success");
    } else {
        res.status(400).json("error logging in...");
    }
});

app.listen(4000, () => {
    console.log("App listening on port 3000");
});
