const User = require("../models/User")
const jwt = require('jsonwebtoken');
const randString = require("../utils/randString");
const sendMail = require("../utils/sendEmail");
 
const createToken =(_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn:'3d'})
}

//login user
const loginUser = async (req, res) => {
    const {email, password} = req.body;
    
    try {
        const user = await User.login(email, password)

        if (user.isValid) {
            const token = createToken(user._id);
            res.status(200).json({email, token}) 
        } else {
            res.status(422).json({error: "email not verified"})
        }
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//signup user
const signupUser = async (req, res) => {
    const {email, password} = req.body;

    const uniqueString = randString();
    const isValid = false;

    try {
        const user = await User.signup(email, password, uniqueString, isValid)
        const status = await sendMail(email, uniqueString);
        // console.log("verification status", status);
        if(user){
            res.status(200).json({info: "verification mail sent"})
        }
        // const token = createToken(user._id);
        // res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {loginUser, signupUser}