
import { obtenerSuperheroePorId, obtenerTodosLosSuperheroes, 
    buscarSuperheroesPorAtributo, obtenerSuperHeroesMayoresDe30, actualizarHeroe, eliminarHeroePorId, eliminarPorNombre,
    agregarDB, modificarHeroe} from '../services/superHeroesServices.mjs';

import { renderizarSuperheroe, renderizarListaSuperHeroes} from '../views/responseView.mjs';
import SuperHero from '../models/SuperHero.mjs';
import { check, body, validationResult } from 'express-validator';

export async function obtenerSuperheroePorIdController(req, res) {
    const {id} = req.params;
    const superheroe = await obtenerSuperheroePorId(id);
    if(superheroe){
        res.send(renderizarSuperheroe(superheroe));
    }else{
        res.status(404).send({mensaje: 'Superheroe no encontrado'});
    }
}

export async function obtenerTodosLosSuperheroesController(req, res) {
    const superheroes = await obtenerTodosLosSuperheroes();
    res.render('paginas/dashboard', {superheroes, title: 'dashboard'}) 
   // res.send(renderizarListaSuperHeroes(superheroes));
}

export async function buscarSuperheroesPorAtributoController(req, res) {
    const {atributo, valor} = req.params;
    const superheroes = await buscarSuperheroesPorAtributo(atributo, valor);

    if(superheroes.length > 0){
        res.send(renderizarListaSuperHeroes(superheroes));
    }else{
        res.status(404).send({mensaje: 'No se encontraron SupeHerores con ese atributo'})
    }
}

export async function obtenerSuperheroesMayoresDe30Controller(req, res) {
    const superheroes = await obtenerSuperHeroesMayoresDe30();
    res.send(renderizarListaSuperHeroes(superheroes));
}


export async function insertarHeroeController(req, res) {
    try {
        const nuevoHeroe = new SuperHero(req.body);
        await nuevoHeroe.save();
        res.status(201).send({ mensaje: "Superhéroe agregado exitosamente", superheroe: nuevoHeroe });
    } catch (error) {
        res.status(500).send({ mensaje: "Error al agregar superhéroe", error });
    }
}

export async function actualizarHeroeController(req, res) {
    try {
        const { id } = req.params; // Extraer el id del héroe desde los parámetros.
        const datosActualizados = req.body; // Extraer los datos a actualizar desde el body.
        
        const actualizado = await actualizarHeroe(id, datosActualizados);

        if (!actualizado) {
            return res.status(404).json({ mensaje: "Héroe no encontrado o no se pudo actualizar" });
        }

        return res.status(200).json({ mensaje: "Héroe actualizado con éxito", datos: actualizado });
    } catch (error) {
        console.error("Error al actualizar el héroe:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor", error: error.message });
    }
}


export async function eliminarHeroeControllerID(req,res) {
    try {
        const { id } = req.params; // Obtener el ID de los parámetros de la URL.
        // Intentar eliminar el héroe.
        const heroeEliminado = await eliminarHeroePorId(id);

        if (!heroeEliminado) {
            return res.status(404).json({ mensaje: "Héroe no encontrado" });
        }

        // Responder al cliente en caso de éxito.
        return res.status(200).json({ mensaje: "Héroe eliminado con éxito", datos: heroeEliminado });
    } catch (error) {
        console.error("Error al eliminar el héroe:", error);

        // Responder con un error genérico.
        return res.status(500).json({ mensaje: "Error interno del servidor", error: error.message });
    }
}


export async function eliminarHeroeControllerName(req, res) {
    try {
        const { nombre } = req.params;
        const heroeEliminado = await eliminarPorNombre(nombre);

        if (!heroeEliminado) {
            return res.status(404).json({ mensaje: "Héroe no encontrado con ese nombre." });
        }

        return res.status(200).json({ mensaje: "Héroe eliminado con éxito.", datos: heroeEliminado });
    } catch (error) {
        console.error("Error al eliminar el héroe:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor.", error: error.message });
    }
}



//Con EJS 

export async function agregar(req, res) {
    const datosHeroe = req.body; 
    //const superHeroes = await obtenerTodosLosSuperheroes()
    try {
      // Llamamos a la función que guarda el superhéroe en la base de datos
      const guardar = await agregarDB(datosHeroe);
      
      // Si no se guardó correctamente, enviamos una respuesta de error
      if (!guardar) {
        return res.status(400).json({ message: 'Hubo un error al guardar el superhéroe' });
      }
      
      // Si se guardó correctamente, enviamos una respuesta exitosa
      return res.redirect('/api/heroes');
      //return res.status(201).json({ message: 'Superhéroe guardado exitosamente', hero: guardar });
    } catch (error) {
      // En caso de error, capturamos y mostramos el error
      console.error(error);
      return res.status(500).json({ message: 'Hubo un error en el servidor', error: error.message });
    }
  } 
  

export async function editHeroeId(req, res) {
    try{
        const {id}= req.params;
        const datosHeroe = await obtenerSuperheroePorId(id);
        //console.log(datosHeroes);
        if(!datosHeroe){
           return res.status(404).send("error al encontrarlo");
        }res.render('paginas/editSuperheroe', {datosHeroe, title: 'editar Heroe'});
    }catch(error){
       return res.status(500).send("ocurrio un error controller", error);
    }
}
 

 export async function editarGuardar(req, res) {
    const superheroes = await obtenerTodosLosSuperheroes();
    try {
        const datosActualizados = req.body; // Extraer los datos a actualizar desde el body.
        
        const actualizado = await modificarHeroe(datosActualizados);

        if (!actualizado) {
            return res.status(404).json({ mensaje: "Héroe no encontrado o no se pudo actualizar" });
        }
        return res.render('paginas/dashboard',{superheroes, title: 'dashboard'});
        //return res.status(200).json({ mensaje: "Héroe actualizado con éxito", datos: actualizado });
    } catch (error) {
        console.error("Error al actualizar el héroe:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor", error: error.message });
    }
 }

 














export async function middleware(req, res, next) {
    // Ejecuta las validaciones
    await body('nombreSuperHeroe')
        .trim()
        .notEmpty().withMessage('El nombre del superhéroe es obligatorio')
        .isLength({ min: 3, max: 60 }).withMessage('El nombre del superhéroe debe tener entre 3 y 60 caracteres')
        .run(req);

    await body('nombreReal')
        .trim()
        .notEmpty().withMessage('El nombre real es obligatorio')
        .isLength({ min: 3, max: 60 }).withMessage('El nombre real debe tener entre 3 y 60 caracteres')
        .run(req);

    await body('edad')
        .trim()
        .isInt({ min: 0 }).withMessage('La edad debe ser un número entero mayor a 0')
        .run(req);

    await body('poderes')
        .isArray().withMessage('Los poderes deben ser un arreglo')
        .notEmpty().withMessage('El arreglo de poderes no debe estar vacío')
        .custom((value) => {
            // Verifica que todos los elementos sean cadenas de texto
            return value.every(poder => typeof poder === 'string' && poder.trim().length >= 3 && poder.trim().length <= 60);
        })
        .withMessage('Cada poder debe ser una cadena con una longitud de entre 3 y 60 caracteres, sin espacios al inicio o al final')
        .custom((value) => {
            // Verifica que no haya elementos con espacios al inicio o al final
            return value.every(poder => poder.trim() === poder);
        })
        .withMessage('Cada poder no debe tener espacios al principio o al final')
        .run(req);

    // Verifica si hubo errores en las validaciones
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Si hay errores, retorna un mensaje de error con los detalles
        return res.status(400).json({ errors: errors.array() });
    }

    // Si no hubo errores, pasa al siguiente middleware o controlador
    next();
}
  