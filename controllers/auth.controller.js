import employeeModel from "../models/employee.model.js";
 import bcrypt from "bcrypt";
 import jwt from "jsonwebtoken";
 

 export const loginEmployee = async (req, res)=>{
    try {
        // extract email and password from request body
        const {email,password}=req.body;

        // check if email and password are provided
        if(!email ||!password){
            return res.status(400).json({message:"email and password is required"});
        }
        // check if email is valid
        const user= await employeeModel.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        // check if password is correct
        const isPasswordValid= await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({message:"invalid password"});
        }
        //create a  token  by using Jwt library
        const token = jwt.sign(
            {id:user._id,
             email:user.email,
              userType:user.userType},     
            process.env.JWT_SECRECT,{expiresIn:"1day"});

        // send response with token and user data
        return res.status(200).json({
            message:"Login successful",
            token,
            user:{
                _id:user.id,
                email:user.email,
                role:user.userType
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({message:"Internal server error"});
        
    }
}