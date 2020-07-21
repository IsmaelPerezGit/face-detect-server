const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Hello");
});

app.listen(4000, () => {
    console.log("App listening on port 3000");
});
