import SuperHeroRepository from '../repositories/SuperHeroRepository.mjs';
//import superHeroeRepository from '../repositories/SuperHeroRepository.mjs'; 

export async function obtenerSuperheroePorId(id) {
    return await SuperHeroRepository.obtenerPorId(id);
}

export async function obtenerTodosLosSuperheroes() {
    return await SuperHeroRepository.obtenerTodos(); 
}

export async function buscarSuperheroesPorAtributo(atributo, valor) {
    return await SuperHeroRepository.buscarPorAtributo(atributo, valor);
}

export async function obtenerSuperHeroesMayoresDe30() {
    return await SuperHeroRepository.obtenerMayoresDe30();
}


export async function actualizarHeroe(id, datosActualizados) {
    return await SuperHeroRepository.actualizarHeroe(id, {
        ...datosActualizados, // Incluye los datos del body. ... toma todas las propiedades del objeto y las copia dentro del nuevo
        ultimaActualizacion: new Date(), // Sobrescribe o agrega la fecha de actualización.
    });
}


export async function eliminarHeroePorId(id) {
    return await SuperHeroRepository.eliminarHeroePorId(id)
}


export async function eliminarPorNombre(nombre) {
    return await SuperHeroRepository.eliminarPorNombre(nombre);
}

export async function agregarDB(datosHeroe) {
    return await SuperHeroRepository.agregarDB(datosHeroe);
}


export async function modificarHeroe(datos) {
    return await SuperHeroRepository.modificarHeroe(datos);
}
 