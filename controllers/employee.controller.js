import employeeModel from "../models/employee.model.js";


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
    const isEmailExist = await employeeModel.findOne({email});
    if (isEmailExist) {
      return res.status(400).json({ message: "This email already exists." });
    }

    //4. Store the data in database
    const employeeData = await employeeModel.create({
      name,
      email,
      designation,
      department,
      salary,
      password,
      userType,
    });

    //5. Send successful message
    return res.status(201).json({message:"User created successfully."});

  } catch (error) {
    // IF any error occurs send response of error
    console.log("Error:", error);
    res.status(500).json({message:"Internal Server Error."});
  }
}




//Function to get all the employee data
export async function getAllEmployees(req,res){
    try {
        const allEmployee= await employeeModel.find();

        if(allEmployee.length ===0){
            return res.status(400).json({message:"No employee record found"});
        }
        res.status(200).json({message:"Data found.", data:allEmployee})
    } catch (error) {
        console.log("Error while getting employee data:", error);
        res.status(500).json({message:"Internal Server Error"});
    }
}





//Function to get employee by ID
export async function getEmployeeById(req,res){
    try {
        //1. Extract employee ID from request parameters(req.params.id)
        const id=req.params.id;
        //const {id}= req.params;

        //2. Use EmployeeModel.findById(id) to get the record.
        const employee= await employeeModel.findById(id);


        //3. IF not found, return_404 with a message
        if(!employee){
            return res.status(404).json({message:"Employee not found."});
        }

        //4. If found, return the employee data with status 200
        res.status(200).json({message:"Data of that employee found.",data:employee});
    } catch (error) {
        console.log("Error while getting employee by ID:", error);
        res.status(500).json({message:"Internal Server Error"});
    }
}