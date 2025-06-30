require('dotenv').config();
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const generateToken = (userId,res)=>{
     const token = jwt.sign({userId},secret,{expiresIn:"7d"});

     res.cookie("jwt",token,{
        maxAge: 7 * 24 * 60 * 60 * 1000, //MS
        httpOnly: true, // prevent XSS attacks cross-site request scripting attacks
        sameSite: "strict",// CRSF attacks cross-site request forgery attacks
        secure:process.env.NODE_ENV !=="development",
     });
     
     return token;
}




module.exports=generateToken;