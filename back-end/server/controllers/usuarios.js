const usuarios = require('../models').usuarios;
const jwt = require('../services/jwt');
function create(req, res) {
  usuarios.create(req.body)
      .then(usuario => {res.status(200).send({usuario})})
      .catch(err => {res.status(500).send({err})})
}

function login(req,res){
    usuarios.findOne({
        where:{
            usuario:req.body.usuario,
            password:req.body.password
        }
    })
    .then(usuario => {
        if(usuario!==null){
            if(req.body.token){
                res.status(200).send({token:jwt.createToken(usuario)})
            }else{
                res.status(200).send({usuario:usuario})
            }
        }
        else
            res.status(401).send({message:"Access not authorized"})
    })
    .catch(err=> {
        res.status(500).send({message:'something wrong on user or password',error:err})
    })
}

function getAll(req,res){
    usuarios.all()
    .then(usuarios=>{
        res.status(200).send({usuarios})
    })
    .catch(err=>{
        res.status(500).send({message:"Error on getAll usuarios"})
    })
}
module.exports={
    create,
    login,
    getAll
}