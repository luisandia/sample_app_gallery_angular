let nJwt = require('njwt');
let config = require('../config/config');
let secret = config.token_secret;

function auth(req,res,next){
    if(!req.headers.authorization){
        return res.status(403).send({message:"La peticion no tiene la cabecera de autenticacion"})
    }

    let token = req.headers.authorization.replace(/['"]+/g,'');
    let payload = nJwt.verify(token,secret,(err,verified)=>{
        if(err){
            return res.status(400).send({message:"Access Denied"})
        }else {
            next();
        }
    })
}

module.exports = {
    auth
}