import express from "express";
import expressHandlebars from "express-handlebars";
import bodyParser from "body-parser";
import path from "path";
import db from "./config/database";
import gigs from "./routes";

db.authenticate()
  .then(() => {
    console.log("DB connected!");

    const server = express();

    server.use(express.static(path.join(__dirname, "public")));

    server.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
    server.set("view engine", "handlebars");

    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());

    server.use("/gigs", gigs);

    server.get("/", (req, res) => res.render("index", { layout: "landing" }));

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => console.log(`Server started on ${PORT}`));
  })
  .catch((err) => console.log(err));
