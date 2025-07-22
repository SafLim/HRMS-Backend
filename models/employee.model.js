import { model, Schema } from "mongoose";

const employeeSchema = new Schema(
  {
    name: String,
    email: String,
    designation: String,
    department: String,
    userType: String,
    salary: Number,
    password: String,
  },
  { timestamps: true }
);

const employeeModel = model("Employee", employeeSchema);
export default employeeModel;
