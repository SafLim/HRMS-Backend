import express from "express";
import morgan from "morgan";
import mongoose from "mongoose"; // Importing mongoose

import dotenv from "dotenv"; // importing dotenv
import { createEmployee, getAllEmployees, getEmployeeById } from "./controllers/employee.controller.js";
dotenv.config(); // Configuring .env file

const app = express();
const PORT = process.env.PORT;

// For logging
app.use(morgan("dev"));
app.use(express.json())


// Creating Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Nodejs!" });
});




//employee ko routes
app.post("/employee/create", createEmployee);
//two parameters: one is path second is when that path is taken which fucntion should run....route and handler

app.get("/employee/getAllEmployees", getAllEmployees);
//same ting as above but js for extracting all the employees from the db

app.get("/employee/getAllEmployees/:id", getEmployeeById);
//colon id cuz id is dynamic as in it keeps on changing re





// Database Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ Database Connection Done.");
    app.listen(PORT, () => {
      console.log("Server is running at port: ", PORT);
    });
  })
  .catch((err) => {
    console.log("❌ Datbase connection Failed.", err);
  });
