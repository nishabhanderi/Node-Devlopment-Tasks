const express = require("express");
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
router.post("/upload", auth,upload.single("image"),(req,res)=>{
    res.json({
        message:"File upload",
        file:req.file
    });
});
router.get("/profile",auth,(req,res)=>{
    res.json({
        message:"protected route",
        user:req.user.id
    });
});

module.exports = router;