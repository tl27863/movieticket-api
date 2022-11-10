const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

function authToken(req, res, next){
    const token = req.cookies['auth-token'];
    if(!token) return res.status(401).send({message: "accessDenied"});
    //console.log(token);
    jwt.verify(token, process.env.token_secret, (err, verified) => {
        if(err) {
            err instanceof jwt.TokenExpiredError 
            ? res.status(401).send({message: "tokenExpire"})
            : res.status(401).send({message: "accessDenied"});
            return;
        }
        req.user = verified;
        //console.log(req.user);
        return next();
    });
}

function authRole(req, res, next){
    User.findById(req.user).exec((err, user) => {
        if(err) {
            return res.status(502).send({message: "dbIssue"});
        }

        Role.find({_id: { $in: user.roles}}, (err, roles) => {
            if(err) {
                return res.status(502).send({message: "dbIssue"});
            }

            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                    return next();
                }
            }
      
            return res.status(403).send({message: "unauthorized"});
        })
    });
};

module.exports.authToken = authToken;
module.exports.authRole = authRole; 