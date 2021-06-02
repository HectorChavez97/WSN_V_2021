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

app.use('/apis/api-docs/nodos', swaggerUI.serve, swaggerUI.setup(swaggerNodosDoc));
app.use('/apis/auth', authRotuer);
app.use('/apis/lecturas', lecturasRouter);
app.use('/apis/valores', valuesRouter);
app.use('/apis/nodo', nodesRouter);
app.use('/apis/variables', variablesRouter);
app.use('/apis/usuario', usersRouter);

module.exports = app;
