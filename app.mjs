import express from 'express';
import {connectDB} from './config/dbConfig.mjs';
import superHeroRoutes from './routes/superHeroRoutes.mjs';
import expressEjsLayouts from 'express-ejs-layouts';
import path from 'path';


const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());//para darle formato json
connectDB();

app.set('view engine', 'ejs'); // Usa EJS como motor de vistas
app.set('views', path.resolve('./views'));//Define el directorio raíz de las vistas estatico
app.use(expressEjsLayouts);//middleware de layout
app.set('layout', 'layout');//archivo base para los layout es layout
app.use(express.static(path.resolve('./public')));//busca todo lo estatico en public, como los css
// Middleware para parsear los datos de los formularios
app.use(express.urlencoded({ extended: true }));  // Para formularios con método POST


app.use('/api', superHeroRoutes);


app.use((req, res) => {
    res.status(404).send({mensaje: "Ruta no encontrada"});
});


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
}); 