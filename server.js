import express from "express";
import morgan from "morgan";
import mongoose from "mongoose"; // Importing mongoose

import cors from "cors";

import dotenv from "dotenv"; // importing dotenv
import { createEmployee, deleteEmployee, getAllEmployees, getEmployeeById, updateEmployee } from "./controllers/employee.controller.js";
import { loginEmployee } from "./controllers/auth.controller.js";
import { authorizeToken } from "./middleware/auth.middleware.js";
dotenv.config(); // Configuring .env file

const app = express();
const PORT = process.env.PORT;







// For logging//Middlewares
app.use(morgan("dev"));
app.use(express.json())
app.use(cors());


// Creating Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Nodejs!" });
});




//employee ko routes
app.post("/employee", authorizeToken, createEmployee);
//two parameters: one is path second is when that path is taken which fucntion should run....route and handler

app.get("/employee",authorizeToken, getAllEmployees);
//same ting as above but js for extracting all the employees from the db

app.get("/employee/:id", getEmployeeById);
//colon id cuz id is dynamic as in it keeps on changing re

app.put("/employee/:id", updateEmployee);

app.delete("/employee/:id",authorizeToken, deleteEmployee);

app.post("/auth", loginEmployee);


//Route to verify token
app.get("/",authorizeToken,()=>{
  res.status(200).json({message:"Token Verified."});
})

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
