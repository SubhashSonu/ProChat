const cloudinary = require("../lib/cloudinary");
const generateToken = require("../lib/utils");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const handleControlSignup =async(req,res)=>{
    const {fullName,email,password} = req.body;

    try {
    // hash password   152566 =>akjhuhfiuhiuhwe
    if(!fullName || !email || !password){
       return res.status(400).json({message:"All fields are required"});
    }
    if(password.length<6){
        return res.status(400).json({message:"Password must be at least 6 characters"})
    }

    const user = await User.findOne({email});

    if(user){
        return res.status(400).json({message:"Email already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = new User({
        fullName,
        email,
        password:hashedPassword
    })

    if(newUser){
       // generate jwt token
       generateToken(newUser._id,res);
       await newUser.save();
       res.status(201).json({_id:newUser._id,email:newUser.email,profilePic: newUser.profilePic,})
    }
    else{
        res.status(400).json({message: "Invalid user data"});
    }

        
    } catch (error) {
        console.log("Error in signup controller",error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
};

const handleControlLogin = async(req,res)=>{
    const {email,password} = req.body;
    try {
       const user = await User.findOne({email});
        if(!user){
           return res.status(400).json({message:"Invalid credentials"})
       }
      

      const isPasswordCorrect = await bcrypt.compare(password,user.password);
       
      if(!isPasswordCorrect){
           return res.status(400).json({message:"Invalid credentials"})
       }

       generateToken(user._id,res)

       res.status(200).json({_id:user.id,fullName: user.fullName,email:user.email,profilePic:user.profilePic})
      
        
    } catch (error) {
        console.log("Error in login controller",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const handleControlLogOut = (req,res)=>{
   try {
    res.cookie("jwt","",{
        maxAge:0
    })
    res.status(200).json({message:"Logged Out successfully"});
   } catch (error) {
    console.log("Error in logout controller",error.message);
    res.status(500).json({message:"Internal Server Error"});
   }
};

const handleControlUpdateProfile = async(req,res)=>{
  try {
    const {profilePic} = req.body;
    const userId = req.user._id;
    
    const user = await User.findById(userId);

     // If profilePic is empty, remove image
    if(!profilePic){
        if (user.cloudinaryId) {
        await cloudinary.uploader.destroy(user.cloudinaryId);
      }

      user.profilePic = '';
      user.cloudinaryId = null;
      await user.save();

      return res.status(200).json(user);
    }
    
    // upload new image 
    // delete old one
    if (user.cloudinaryId) {
      await cloudinary.uploader.destroy(user.cloudinaryId);
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url,
        cloudinaryId: uploadResponse.public_id,
    },
        {new:true});

    res.status(200).json(updatedUser);

  } catch (error) {
    console.log("error in update profile",error.message);
    res.status(500).json({message: "Internal server error"});
  }
};

const checkAuth = (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth Controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}


module.exports ={
    handleControlSignup,
    handleControlLogin,
    handleControlLogOut,
    handleControlUpdateProfile,
    checkAuth
}