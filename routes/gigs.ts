import { Router } from "express";
import db from "../config/database";
import Gig from "../models/Gig";
import { Op } from "sequelize";

const Gigs = (router: Router) => {
  router.get("/", (req, res) => {
    Gig.findAll()
      .then((gigs) =>
        res.render("gigs", { gigs: gigs.map((gig) => gig.toJSON()) })
      )
      .catch((err) => res.json(err));
  });

  router.get("/add", (req, res) => res.render("add"));

  router.post("/add", (req, res) => {
    let { title, technologies, budget, description, contact_email } = req.body;
    let errors = [];

    if (!title) {
      errors.push({ text: "Please add a title" });
    }
    if (!technologies) {
      errors.push({ text: "Please add some technologies" });
    }
    if (!description) {
      errors.push({ text: "Please add a description" });
    }
    if (!contact_email) {
      errors.push({ text: "Please add a contact email" });
    }

    // Check for errors
    if (errors.length > 0) {
      res.render("add", {
        errors,
        title,
        technologies,
        budget,
        description,
        contact_email,
      });
    } else {
      if (!budget) {
        budget = "Unknown";
      } else {
        budget = `$${budget}`;
      }

      // Make lowercase and remove space after comma
      technologies = technologies.toLowerCase().replace(/,[ ]+/g, ",");

      // Insert into table
      Gig.create({
        title,
        technologies,
        description,
        budget,
        contact_email,
      })
        .then((gig) => res.redirect("/gigs"))
        .catch((err) => res.render("error", { error: err.message }));
    }
  });

  router.get("/search", (req, res) => {
    let { term } = req.query;

    // Make lowercase
    term = term.toString().toLowerCase();

    Gig.findAll({ where: { technologies: { [Op.like]: "%" + term + "%" } } })
      .then((gigs) => res.render("gigs", { gigs }))
      .catch((err) => res.render("error", { error: err }));
  });
};

export default Gigs;
