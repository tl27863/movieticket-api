const router = require('express').Router();
const User = require('../models/User');
const Role = require('../models/Role');
const RefreshToken = require('../models/RefreshToken');
const { registerValidation, loginValidation } = require('../verifiers/validation');
const { createRefreshToken, verifyRefreshExpire} = require('../verifiers/refreshToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const{ error } = registerValidation(req.body);
    if(error) return res.status(400).send({message: "emailOrPassInvalid"});

    const duplicate = await User.findOne({email: req.body.email});
    if(duplicate) return res.status(400).send({message: "userExist"});    

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        password: hashPass
    });

    user.save((err, user) => {
        if(err) {
            return res.status(502).send({message: "dbIssue"});
        }

        Role.findOne({ name: "user"}, async (err, role) => {
            if(err) {
                return res.status(502).send({message: "dbIssue"});
            }
            user.roles = [role._id];
            user.save(err => {
                if(err) {
                    return res.status(502).send({message: "dbIssue"});
                }
                res.send({message: "regSuccess"});
            });
        });        
    });
});

router.post('/login', async (req, res) => {
    const{ error } = loginValidation(req.body);
    if(error) return res.status(400).send({message: "emailOrPassInvalid"});

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send({message: "NuserExist"});  

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send({message: "passInvalid"});

    const token = jwt.sign({_id: user._id}, process.env.token_secret, {expiresIn: 300});
    const refreshToken = await createRefreshToken(user);
    res.status(200)
        .cookie('auth-token', token, {expires: new Date(Date.now() + 300 * 1000), httpOnly: true, secure: false})
        .cookie('refresh-token', refreshToken, {expires: new Date(Date.now() + 86400 * 3 * 1000), httpOnly: true, secure: false})
        .send({message: "logSuccess"});
});

router.post('/token', async (req, res) => {
    const refreshToken = req.cookies['refresh-token'];

    if(!refreshToken) return res.status(401).send({message: "accessDenied"});

    try {
        const verToken = await RefreshToken.findOne({ token: refreshToken});
        if(!verToken) return res.status(403).send({message: "unauthorized"});

        if(verifyRefreshExpire(verToken)) {
            RefreshToken.findOneAndDelete({_id: verToken._id});
            return res.status(403).send({message: "unauthorized"});
        }

        const newToken = jwt.sign({_id: verToken.user._id}, process.env.token_secret, {expiresIn: 300});
        return res.status(200)
            .cookie('auth-token', newToken, {expires: new Date(Date.now() + 300 * 1000), httpOnly: true, secure: false})
            .send({message: "refreshSuccess"});
    } catch(err) {
        return res.status(502).send({message: "dbIssue"});
    }
});

module.exports = router;