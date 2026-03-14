const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail.js");
const multer = require("multer");

exports.register = async(req,res,next)=>{
    try{
        
    const {name,email,password}= req.body || {};
    
    if(!name || !email || !password){
   return res.status(400).json({
      message:"All fields required"
   });
}
 const existingUser = await User.findOne({email});

if(existingUser){
 return res.status(400).json({
  message:"Email already registered"
 });
}

    const hashedPassword = await bcrypt.hash(password,10);

    const user = new User({
        name,
        email,
        password:hashedPassword
    });
    await user.save();
//sendEmail(email,"Welcome", "registration successful");
    res.json({message:"User Registered"});
    
}catch(err){
     next(err);
}
};
exports.login = async(req,res,next)=> {
    try{
 const {email,password} = req.body || {};

 if(!email || !password){
   return res.status(400).json({
      message:"Email and password required"
   });
}


 const user = await User.findOne({email});
 
 if(!user){
    return res.status(404).json({
        message:"User not found"
    });

 };
 const match = await bcrypt.compare(password,user.password);
 if (!match){
    return res.status(401).json({message:"wrong password"});
 };
 const token = jwt.sign(
    {id:user._id},
    process.env.JWT_SECRET,
   { expiresIn:"1d"}
);
 res.json({ message: "Login successful",token});
}catch(err){
    next(err);
}
};
