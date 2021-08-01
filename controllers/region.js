const { response } = require("express");
const { Region, Ciudad } = require("../models");





//obtenerRegioness - páginado- total- populate
const obtenerRegiones = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, regiones] = await Promise.all([ //envío arreglo, demora menos 
      Region.countDocuments(query),
      Region.find(query)
          .skip(Number(desde))
          .limit(Number(limite))
  ]);
  res.json({
      total,
      regiones
  });
}


//obtenerServicio - populate
const obtenerRegion = async (req, res = response) => {
  const { id } = req.params;
  const region = await Region.findById(id);

  res.json(region);
}


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
  addCiudad,
  obtenerRegion,
  obtenerRegiones
}