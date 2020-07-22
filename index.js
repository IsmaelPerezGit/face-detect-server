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
    res.json(db.users);
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

app.post("/register", (req, res) => {
    const { email, name, password } = req.body;

    db.users.push({
        id: "125",
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date(),
    });

    res.json(db.users[db.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    let found = false;
    db.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    });
    if (!found) {
        res.status(400).json("not found");
    }
});

app.post("/image", (req, res) => {
    const { id } = req.body;
    let found = false;
    db.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });
    if (!found) {
        res.status(400).json("not found");
    }
});

app.listen(4000, () => {
    console.log("App listening on port 3000");
});
