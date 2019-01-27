const fotografiasController = require('../controllers').fotografias;
const md_auth = require('../authenticated/authenticated');
const cm = require('connect-multiparty');
const md_upload = cm({uploadDir:'./server/uploads/fotografias'});

module.exports = (app) => {
    app.post('/api/fotografias',md_auth.auth,fotografiasController.create);
    app.put('/api/fotografias/:id',md_auth.auth,fotografiasController.update);
    app.post('/api/upload-fotografia/:id',[md_auth.auth,md_upload],fotografiasController.updateFotografia);
}