const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require('../models/userModel')

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password, pic} = req.body;
    if(!name || !email || !password){
        res.send(400);
        throw new error("Please Enter all fields")
    }

    const userExist = await User.findOne({email});

    if(userExist){
        res.status(400);
        throw new Error("User already Exist");
    }

    const user = await User.create({
        name,
        email, 
        password,
        pic
    });

    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            pic:user.pic,
            token : generateToken(user._id)
        });
    }else{
        res.status(400);
        throw new Error("User Failed to create");
    }
    
});


const authUser = asyncHandler(async (req, res)=>{
    const {email, password} = req.body;

    const user = await User.findOne({email});
    console.log("user", user)
    if(user && (await user.matchPassword(password))){
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            pic:user.pic,
            token : generateToken(user._id)
        });
    }else{
        res.status(400);
        throw new Error("invalid Credentials");
    }
    
});

//api/user?search = suraj
const allUser = asyncHandler(async (req, res)=>{
    const keyword = req.query.search ? {
        $or:[
            {name:{$regex: req.query.search, $options:"i"}},
            {email:{$regex: req.query.search, $options:"i"}}

        ]
    }
    :
    {};
    const users = await User.find(keyword).find({ _id:{$ne: req.user._id}});
 
    res.send(users)
    console.log(keyword)

});



module.exports = {registerUser, authUser, allUser};
