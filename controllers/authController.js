const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const handleLogin = async (req, res) => {
    const {user, pwd} = req.body;
    if(!user || !pwd){
        return res.status(400).json({'message' : 'Username and passwords are required.'});
    }
    const foundUser = await User.findOne({ username: user }).exec();
    if(!foundUser) return res.sendStatus(401); // Unauthorized

    // matching password with database
    const match = await bcrypt.compare(pwd, foundUser.password);
    if(match){
        // create JWTs here
        const accessToken = jwt.sign(
            { "username": foundUser.username},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10m'}
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        );

        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000}) // secure : true needed later
        res.json({ accessToken });
    }else{
        res.sendStatus(401);
    }
}

module.exports = {handleLogin};