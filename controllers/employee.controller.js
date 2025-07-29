import employeeModel from "../models/employee.model.js";
import bcrypt from "bcrypt";

//Adding employee
export async function createEmployee(req, res) {
  try {
    //1. Extract the data
    const { name, email, designation, department, salary, password, userType } =
      req.body;

    //2. Check if data is correct/validate the data such as email, password, name and all
    if (
      !name ||
      !email ||
      !designation ||
      !department ||
      !salary ||
      !password ||
      !userType
    ) {
      return res.status(400).json({ message: "All the fields are required!" });
    }

    //3. Check if email already exist in db
    const isEmailExist = await employeeModel.findOne({ email });
    if (isEmailExist) {
      return res.status(400).json({ message: "This email already exists." });
    }


    const hashedPassword = await bcrypt.hash(password,10);



    //4. Store the data in database
    const employeeData = await employeeModel.create({
      name,
      email,
      designation,
      department,
      salary,
      password:hashedPassword,
      userType,
    });

    //5. Send successful message
    return res.status(201).json({ message: "User created successfully.", data: employeeData });
  } catch (error) {
    // IF any error occurs send response of error
    console.log("Error:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
}

//Function to get all the employee data
export async function getAllEmployees(req, res) {
  try {
    const allEmployee = await employeeModel.find();

    if (allEmployee.length === 0) {
      return res.status(400).json({ message: "No employee record found" });
    }
    res.status(200).json({ message: "Data found.", data: allEmployee });
  } catch (error) {
    console.log("Error while getting employee data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

//Function to get employee by ID
export async function getEmployeeById(req, res) {
  try {
    //1. Extract employee ID from request parameters(req.params.id)
    const id = req.params.id;
    //const {id}= req.params;

    //2. Use EmployeeModel.findById(id) to get the record.
    const employee = await employeeModel.findById(id);

    //3. IF not found, return_404 with a message
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    //4. If found, return the employee data with status 200
    res
      .status(200)
      .json({ message: "Data of that employee found.", data: employee });
  } catch (error) {
    console.log("Error while getting employee by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

//Function to update employee data
export async function updateEmployee(req, res) {
  try {
    let hashedPassword;
    //1. Kun employee ko data update garni ho?
    const id = req.params.id;

    //2. K K data update garno ho
    const { name, email, designation, department, salary, password, userType } =
      req.body;
     
    if (password){
        hashedPassword= await bcrypt.hash(password,10);
    }
    
    // const updatedData=req.body;

    //  if(updatedData.password){
    //     updatedData.password= await bcrypt.hash(updatedData,10);
    //  }

        


    //3. La data update garum hai
    const updatedEmployee = await employeeModel.findByIdAndUpdate(
      id,
      { name, email, designation, department, salary, password:hashedPassword, userType },
      { new: true } //jun recent update bhako data pls give me re
    );

    //4. La message pathaidim
    res
      .status(200)
      .json({ message: "Employee data updated.", data: updatedEmployee });
  } catch (error) {
    console.log("Error while updating employee:", error);
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({ message: "Email already exists." });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function deleteEmployee(req,res){
    try {
        //1. Kun employee ko delete garni id chiayooo
        const id= req.params.id;

        //2. Await cuz time lagxa. Employee bhanne table ma jau ani tyo id khoja ani delete gara
        //tyo deleted ko data last time auxa tyo chai deletedEmployee ma rakha re
        const deletedEmployee= await employeeModel.findByIdAndDelete(id);

        if(!deletedEmployee){
            return res.status(404).json({message:"Employee not found."})
        }

        res.status(200).json({message:"Employee data deleted.", data:deletedEmployee});

    } catch (error) {
        console.log("Error while deleting Employee:", error);
        res.status(500).json({message:"Internal Server Error"});
    }
}