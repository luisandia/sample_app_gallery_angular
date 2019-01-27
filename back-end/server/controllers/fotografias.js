const fotografias = require('../models').fotografias;
const fs = require('fs');
const thumb = require('node-thumbnail').thumb;
const path = require('path');

function create(req,res){
    let body = req.body;
    console.log(body)
    fotografias.create(body)
    .then(fotografia => {
        res.status(200).send({fotografia});
    })
    .catch(err => {
        res.status(500).send({message:"One error occurs on save image"})
    })
}

function update(req,res){
    fotografias.findById(req.params.id)
    .then(fotografia => {
        fotografia.update(req.body)
        .then(() =>{
            res.status(200).send({fotografia});
        })
        .catch(err => {
            res.status(500).send({message:"Error on update photo"})
        })
    })
    .catch(err => {
        res.status(500).send({message:"Error on find photo"})
    })
}

function updateFotografia(req,res){
    let id = req.params.id;
    function deleteFile(file_path,message) {
        fs.unlink(file_path, (err) => {
            if (err) {
                res.status(500).send({ message: 'Error on delete file' });
            }
        });
        res.status(500).send({ message: message, err: err });
    }

    if(req.files){
        let file_path = req.files.foto.path;
        let file_split = file_path.split('/');
        let file_name = file_split[3];
        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1];
        if(file_ext == 'jpg'){
            let new_photo = {};
            new_photo.imagen = file_name;
            fotografias.findById(id)
            .then(fotografia => {
                fotografia.update(new_photo)
                .then(() => {
                    let newPath = `./server/uploads/fotografias/${file_name}`
                    let thumbPath = './server/uploads/fotografias/thumbs';
                    thumb({
                        source:path.resolve(newPath),
                        destination: path.resolve(thumbPath),
                        width:200,
                        suffix:''
                    }).then(() =>{
                        res.status(200).send({fotografia})
                    })
                    .catch(err => {
                        res.status(600).send({message:'An error occurs on create thumbnail'})
                    })
                })
                .catch(err => {
                    deleteFile(file_path,'An error occurs on update photo');
                })
            })
            .catch(err => {
                deleteFile(file_path,'Error on search photo');
            })
        }else {
            deleteFile(file_path,'Extension invalida');
        }
    }else {
        res.status(400).send({message:'You must select photo'});
    }
}

function getFotografia(req,res){
    let fotografia = req.params.fotografia;
    let thumb = req.params.thumb;
    let path_photo = thumb?'./server/uploads/fotografias/thumbs/'+fotografia:'./server/uploads/fotografias/'+fotografia;

    fs.exists(path_photo,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_photo));
        }else {
            res.status(400).send({message:"Photo not exists"})
        }
    })
}

function getAll(req,res){
    fotografias.all({
        where:{
            activo:true
        },
        order:[
            ['numero','ASC']
        ]
    })
    .then(fotografias => {
        res.status(200).send({fotografias});
    })
}

module.exports = {
    create,
    update,
    updateFotografia,
    getFotografia,
    getAll
}