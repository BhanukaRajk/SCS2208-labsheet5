const express = require("express");
const multer = require("multer");
const path = require("path");

// Set port
var port = 3083;
const app = express();

// Configure storing details
const storage = multer.diskStorage({
    // Storing place
    destination: (req, file, cb) => {
        cb(null, "Uploads")
    },

    // File storing settings
    filename: (req, file, cb) => {
        console.log(file)
        // File naming
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage})

// File path settings
app.set("views", path.join(__dirname, "/views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// link with html file
app.get("/form", (req, res) => {
    res.render("form");
});

// Connection with form
app.post("/form", upload.single("picture"), (req, res) => {
    res.send("Image file uploaded");
});

app.listen(port);
console.log("Port:", port);