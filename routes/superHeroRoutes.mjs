import express from 'express';
import {
    obtenerSuperheroePorIdController,
    obtenerTodosLosSuperheroesController,
    buscarSuperheroesPorAtributoController,
    obtenerSuperheroesMayoresDe30Controller, insertarHeroeController,actualizarHeroeController,
    eliminarHeroeControllerID,eliminarHeroeControllerName,
    middleware, agregar, editHeroeId, editarGuardar
} from '../controllers/superheroesController.mjs';



const router = express.Router();

router.get('/heroes/mayores-30', obtenerSuperheroesMayoresDe30Controller);
router.get('/heroes', obtenerTodosLosSuperheroesController); 
router.get('/heroes/:id', obtenerSuperheroePorIdController);
router.get('/heroes/buscar/:atributo/:valor', buscarSuperheroesPorAtributoController);

//nuevas rutas

router.post('/heroes/agregarHeroe', middleware, insertarHeroeController);
router.put('/heroes/actualizarHeroe/:id', middleware, actualizarHeroeController);
router.delete('/heroes/borrarPorId/:id', eliminarHeroeControllerID);
router.delete('/heroes/borrarPorNombre/:nombre', eliminarHeroeControllerName);

//rutas ejs
router.get('/agregar', (req,res)=> res.render('paginas/addSuperhero',{title: 'agregar heroe'}));//entrega el formulario
router.post('/heroes/agregar', middleware, agregar);//manda el formulario hecho
router.get('/editar/:id',editHeroeId)
router.put('/heroes/editarHeroe', editarGuardar);

router.get('/inicio', (req, res)=>{
    res.render('index', {title: 'Inicio'})
})
 

export default router;  