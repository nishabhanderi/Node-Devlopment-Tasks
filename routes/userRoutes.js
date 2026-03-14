const express = require("express");
const User = require("../models/user.js");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const userController = require("../controllers/userController");
const multer = require("multer");

const storage = multer.diskStorage({
    destination:"uploads/",
    filename:(req,file,cb)=>{
        cb(null, Date.now()+ "-" + file.originalname);
    }
});
const upload = multer({storage});

router.post("/register",userController.register);

router.post("/login" ,userController.login);
router.post("/upload", auth,upload.single("image"), async  (req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({message:"No file upload"});
        }
    const user = await User.findById(req.user.id);
    if(!user){
        return res.status(400).json({message:"User not found"}); 
    }
    user.image =`/uploads/${ req.file.filename}`;
    await user.save();
    res.json({
        message:"File upload",
        file:req.file,
        image:user.image
    });
}catch(error){
    console.log(error);
    res.status(500).json({message:"server error"});
}
});



router.get("/profile",auth,(req,res)=>{
    res.json({
        message:"protected route",
        user:req.user.id
    });
});

module.exports = router;