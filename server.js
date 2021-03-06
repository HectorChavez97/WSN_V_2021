/**
 * Módulo main del proyecto VidaDigital
 */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const swaggerUI = require('swagger-ui-express');
const swaggerNodosDoc = require('./config/swagger.nodos.json');

const app = express();

const authRotuer = require('./routes/auth.router');
const valuesRouter = require('./routes/values.route');
const nodesRouter = require('./routes/nodos.route');
const lecturasRouter = require('./routes/lecturas.route');
const variablesRouter = require('./routes/variables.route');
const usersRouter = require('./routes/usuarios.route');

app.use(cors());
app.use(bodyParser.json());

app.use('/wsnv21/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerNodosDoc));
app.use('/wsnv21/api/auth', authRotuer);
app.use('/wsnv21/api/lecturas', lecturasRouter);
app.use('/wsnv21/api/valores', valuesRouter);
app.use('/wsnv21/api/nodo', nodesRouter);
app.use('/wsnv21/api/variables', variablesRouter);
app.use('/wsnv21/api/usuario', usersRouter);

module.exports = app;
