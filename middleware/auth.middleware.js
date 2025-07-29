import jwt from "jsonwebtoken";
export function authorizeToken (req,res, next){
    // 1. Extract token from Headers
    const authHeader= req.headers.authorization;

    // 2. Check if token is available
    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(400).json({message:"No Token provided."});
    }

    // 3. Split the token
    const token= authHeader.split(" ")[1];

    
    try {
        // 4. Verify the token
        const decoded= jwt.verify(token,process.env.JWT_SECRET);

        // 5. If unverifie, send error response
        const {userType}= decoded;
        if(userType.toLowerCase()==="employee"){
            return res.status(400).json({message:"Access Denied"})
        }
        next(); //yespaxi aune function lai run garxa re
    // 6. If verified, check roles
    } catch (error) {
        //If token unverified, send error response
        console.log("Error verifying token:", error);
        res.status(400).json({message:"Invalid Token"});
    }
    

}