// import User from "../routes/models/user.models.js";
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateTokens.js";
export const signup= async (req,res)=>{
    try{
        const{fullName,username,password,confirmPassword,gender}=req.body;

        if(password!=confirmPassword){
            return res.status(400).json({error:"Passwords did not match"})
        }

        const user=await User.findOne({username});

        if(user){
            return res.status(400).json({error:"Username already exists"})
        }

        //hashing
        const salt=await bcrypt.genSalt(10);
        console.log(typeof password); // should be 'string'
        console.log(typeof salt);     // should be 'string'

        const hashedPassword=await bcrypt.hash(password,salt);

        const boyProfilePic=`https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic=`https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender=="male" ? boyProfilePic:girlProfilePic
            

        });
        if(newUser){
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();
            


        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            password:newUser.password,
            profilePic:newUser.profilePic

        });
    }
    else{
        res.status(400).json({error:"Invalid User Data"});
    }

    }catch(error){
        console.log("error in signup controller",error.message);
        res.status(500).json({errro:"Internal Server Error"});

    }
};
export const login= async (req,res)=>{
    // console.log("logOutpuser");
    try {
        const {username,password}=req.body;
        const user=await User.findOne({username});
        const isPasswordCorrect= await bcrypt.compare(password, user?.password || "");
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Passwords did not match"})


        }
        generateTokenAndSetCookie(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            password:user.password,
            profilePic:user.profilePic

        });


        
    } catch (error) {
        console.log("error in login controller",error.message);
        res.status(500).json({errro:"Internal Server Error"});
    
        
    }
};
export const logout= async (req,res)=>{
    // console.log("logInuser");
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"logged out succesfully"});
        
    } catch (error) {
        console.log("error in login controller",error.message);
        res.status(500).json({errro:"Internal Server Error"});

        
    }
};