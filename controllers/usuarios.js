const { response } = require('express');

const usuariosPost = (req, res) => {
    const body = req.body;

    res.json ({
        msg: 'POST API - Controlador',
        body
    });
  }

  const usuariosPut = (req, res) => {
    res.json ({
        msg: 'Put API - Controlador'
    });
  }

const usuariosGet = (req, res) => {
    res.json ({
        msg: 'get API - Controlador'
    });
  }


const usuariosDelete = (req, res) => {
    res.json ({
        msg: 'Delete API - Controlador'
    });
  }

  module.exports = {
      usuariosGet,
      usuariosPost,
      usuariosPut,
      usuariosDelete
  }