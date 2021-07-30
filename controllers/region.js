const { response } = require("express");
const { Region, Ciudad } = require("../models");



//crear region
const crearRegion = async (req, res = response) => {

  const { nombre } = req.body;


  const regionBD = await Region.findOne({ nombre: nombre });

  if (regionBD) {
    return res.status(400).json({
      msg: `La region ${regionBD.nombre}, ya existe!`
    });
  }

  //generar data para guardar
  const data = {
    nombre: nombre.toUpperCase(),
  }
  const region = new Region(data);

  //guardar BD
  await region.save();

  res.status(201).json(region);
}


//asignar ciudad-region
const addCiudad = async (req, res = response) => {
  const { ciudad } = req.body;
  const { id } = req.params;
  console.log( ciudad );
  if (ciudad == '') {
    return res.status(400).json({
      msg: `La ciudad no es válido!`
    });
  }

  //consultar si existe
  const region = await Region.findById(id);
  console.log(region.ciudades);
  if (region.ciudades.includes(ciudad)) {
    return res.status(400).json({
      msg: `La ciudad ${regionBD.nombre}, ya existe!`
    });
  }

  const asignarCiudad = await Region.findByIdAndUpdate(id, {
    $push: { ciudades: ciudad },
  });
  res.json(asignarCiudad);
}


//eliminar region
const eliminarRegion = async (req, res = response) => {

  const { id } = req.params;
  const regionBorrado = await Region.findByIdAndUpdate(id, { estado: false }, { new: true });

  res.json(regionBorrado);
}







module.exports = {
  crearRegion,
  eliminarRegion,
  addCiudad
}