/**
 * Módulo main del proyecto VidaDigital
 */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const swaggerUI = require('swagger-ui-express');
const swaggerNodosDoc = require('./config/swagger.nodos.json');
const swaggerCovidDoc = require('./config/swagger.covid.json');

const app = express();

const authRotuer = require('./routes/auth.router');
const valuesRouter = require('./routes/values.route');
const nodesRouter = require('./routes/nodos.route');
const lecturasRouter = require('./routes/lecturas.route');
const variablesRouter = require('./routes/variables.route');
const usersRouter = require('./routes/usuarios.route');

app.get('/apis', function (req, res) {
    res.send('Back end O2020')
  })

app.use(cors());
app.use(bodyParser.json());

app.use('/apis/api-docs/nodos', swaggerUI.serve, swaggerUI.setup(swaggerNodosDoc));
app.use('/apis/api-docs/covid', swaggerUI.serve, swaggerUI.setup(swaggerCovidDoc));
app.use('/apis/auth', authRotuer);
app.use('/apis/lecturas', lecturasRouter);
app.use('/apis/valores', valuesRouter);
app.use('/apis/nodo', nodesRouter);
app.use('/apis/variables', variablesRouter);
app.use('/apis/usuario', usersRouter);

module.exports = app;
