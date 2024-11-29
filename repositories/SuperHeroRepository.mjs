
import SuperHero from '../models/SuperHero.mjs';
import IRepository from './IRepository.mjs';

class SuperHeroRepository extends IRepository{
    async obtenerPorId(id){
        return await SuperHero.findById(id);
    }
    async obtenerTodos(){
        return await SuperHero.find({});
    }
    async buscarPorAtributo(atributo, valor) {
        try {
            if (!atributo || valor === undefined) {
                throw new Error("Atributo y valor son requeridos para realizar la búsqueda.");
            }
    
            // Obtener información del esquema para validar el tipo de atributo
            const schemaType = SuperHero.schema.path(atributo);
    
            if (!schemaType) {
                throw new Error(`El atributo '${atributo}' no existe en el modelo.`);
            }
    
            let query;
            // Si el atributo es un número, usamos una búsqueda exacta
            if (schemaType.instance === 'Number') {
                if (isNaN(valor)) {
                    throw new Error(`El valor para el atributo '${atributo}' debe ser un número.`);
                }
                query = { [atributo]: Number(valor) };
            } else if (schemaType.instance === 'String') {
                // Si el atributo es una cadena, usamos una expresión regular
                query = { [atributo]: new RegExp(valor, 'i') };
            } else {
                throw new Error(`El tipo del atributo '${atributo}' no es compatible con las búsquedas.`);
            }
    
            // Realizar la búsqueda
            const resultados = await SuperHero.find(query);
            return resultados;
        } catch (error) {
            console.error("Error en buscarPorAtributo:", error.message);
            throw error;
        }
    }
    
    async obtenerMayoresDe30() {
        return await SuperHero.find({
            edad: { $gt: 30 },
            planetaOrigen: 'Tierra',
            poderes: { $exists: true, $not: { $size: 0 } } 
        });
    }


    async actualizarHeroe(id, datosActualizados) {
        return await SuperHero.findOneAndUpdate(
            { _id: id }, // búsqueda por id.
            datosActualizados, // Datos a actualizar.
            { new: true } // documento actualizado.
        );
    }
    
    async eliminarHeroePorId(id){
        return await SuperHero.findByIdAndDelete(id);
    }

    async eliminarPorNombre(nombre){
        return await SuperHero.findOneAndDelete({nombreSuperHeroe: nombre});
    }

    async agregarDB(datosheroe){
        return await new SuperHero(datosheroe).save();
    }

    async editarHeroePUT(actualizado){
        return await SuperHero.findByIdAndUpdate(actualizado, {new: true});
        
    }

    async modificarHeroe(datos){
        return await SuperHero.findByIdAndUpdate({ _id: datos.id }, // Criterio de búsqueda por id.
            datos, // Datos a actualizar.
            { new: true } )
    }

}

export default new SuperHeroRepository();