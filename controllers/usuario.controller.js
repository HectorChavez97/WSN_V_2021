/* eslint-disable no-restricted-globals */
/**
 * Módulo del controlador de usuarios.
 * Este archivo contiene todos los endpoints del controlador de usuarios.
 * @author Héctor Chávez Morales <hector.chavez.97@hotmail.com>
 */

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "express" }] */
const express = require('express');
const userModel = require('../db/usuario.model');
const encrypt = require('../config/encrypt');
const validarUser = require('../validators/usuario');
const { executionContext } = require('../db/executionContext');

/**
 * POST /api/usuario
 * @async
 * @exports addUsuario
 * @param {express.Request} req Request parameter.
 * @param {express.Response} res Response parameter.
 */
async function addUsuario(req, res) {
  const user = req.body;

  const errors = await validarUser.validarEsquema(user);
  if (errors.length > 0) {
    res.status(400).send(errors[0].stack);
  } else if (
    user.type.toLowerCase() !== validarUser.TYPES.ADMIN
    && user.type.toLowerCase() !== validarUser.TYPES.USER
  ) {
    res.status(400).send("Wrong type. Must be 'admin' or 'user'");
  } else {
    try {
      user.password = await encrypt.hashPassword(user.password);

      await executionContext(async (context) => {
        const { connection } = context;

        await userModel.addUsuario(connection, user);
        res.sendStatus(201);
      });
    } catch (exception) {
      if (Object.prototype.hasOwnProperty.call(exception, 'sqlMessage')) {
        res.status(400).send(exception.sqlMessage);
      } else {
        res.status(500).send(exception);
      }
    }
  }
}

/**
 * GET /api/usuario/:id
 * @exports getUsuario
 * @param {express.Request} req Request parameter.
 * @param {express.Response} res Response parameter.
 */
async function getUsuario(req, res) {
  const id = req.params.userID;

  executionContext((context) => {
    const { connection } = context;

    userModel
      .getUsuario(connection, id)
      .then((val) => res.send(val[0]))
      .catch((err) => {
        if (Object.prototype.hasOwnProperty.call(err, 'sqlMessage')) {
          res.status(400).send(err.sqlMessage);
        } else {
          res.status(500).send(err);
        }
      });
  });
}

/**
 * PATCH /api/usuario/edit/user-password/:id
 * @exports patchPassword
 * @param {express.Request} req Request parameter.
 * @param {express.Response} res Response parameter.
 */
async function patchUserPassword(req, res) {
  const userId = req.params.userID;
  const data = req.body;

  if (req.userType !== validarUser.TYPES.ADMIN) {
    res
      .status(400)
      .send(
        'You can only edit others password unless your role type is Admin',
      );
    return;
  }

  if (data.newPassword === undefined) {
    res.status(400)
      .send('Invalid body request. \'newPassword\' propierty is missing');
    return;
  }

  const passEncrypt = await encrypt.hashPassword(data.newPassword);

  executionContext((context) => {
    const { connection } = context;

    userModel
      .patchUserPassword(connection, userId, passEncrypt)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        if (Object.prototype.hasOwnProperty.call(err, 'sqlMessage')) {
          res.status(400).send(err.sqlMessage);
        } else {
          res.status(500).send(err);
        }
      });
  });
}

/**
 * PATCH /api/usuario/edit/type/:id
 * @exports patchType
 * @param {express.Request} req Request parameter.
 * @param {express.Response} res Response parameter.
 */
async function patchType(req, res) {
  const userId = req.params.userID;
  const data = req.body;

  executionContext((context) => {
    const { connection } = context;

    userModel
      .patchType(connection, userId, data.type)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        if (Object.prototype.hasOwnProperty.call(err, 'sqlMessage')) {
          res.status(400).send(err.sqlMessage);
        } else {
          res.status(500).send(err);
        }
      });
  });
}

/**
 * DELETE /api/usuario/:id
 * @exports deleteUsuario
 * @param {express.Request} req Request parameter.
 * @param {express.Response} res Response parameter.
 */
function deleteUsuario(req, res) {
  const userId = req.params.userID;

  if (req.userName !== userId && req.userType !== validarUser.TYPES.ADMIN) {
    res
      .status(400)
      .send(
        'You can only delete your own account unless your role type is Admin',
      );
    return;
  }

  executionContext((context) => {
    const { connection } = context;

    userModel
      .deleteUsuario(connection, userId)
      .then(() => res.sendStatus(200))
      .catch((err) => {
        if (Object.prototype.hasOwnProperty.call(err, 'sqlMessage')) {
          res.status(400).send(err.sqlMessage);
        } else {
          res.status(500).send(err);
        }
      });
  });
}

/**
 * GET /api/usuarios/all
 * @exports getUsuarios
 * @param {express.Request} req Request parameter.
 * @param {express.Response} res Response parameter.
 */
function getUsuarios(req, res) {
  executionContext((context) => {
    const { connection } = context;

    userModel
      .getUsuarios(connection)
      .then((val) => res.send(val))
      .catch((err) => {
        if (Object.prototype.hasOwnProperty.call(err, 'sqlMessage')) {
          res.status(400).send(err.sqlMessage);
        } else {
          res.status(500).send(err);
        }
      });
  });
}

/**
 * PATCH /api/usuario/edit/my-password/:id
 * @exports patchMyPassword
 * @param {express.Request} req Request parameter.
 * @param {express.Response} res Response parameter.
 */
async function patchMyPassword(req, res) {
  const userId = req.params.userID;
  const {
    oldPassword,
    newPassword,
  } = req.body;

  if (req.userName !== userId) {
    res.status(401).send('You can only edit your own password');
    return;
  }

  if (oldPassword === undefined || newPassword === undefined) {
    res.status(400)
      .send('Invalid body request');
    return;
  }

  let usuarioResult = {};
  try {
    await executionContext(async (context) => {
      const { connection } = context;
      usuarioResult = await userModel.getUsuarioAuth(connection, userId);
    });
  } catch (e) {
    res.status(500).send(e.message);
    return;
  }

  if (usuarioResult.length === 0) {
    res.status(401).send('The username or password you entered is incorrect');
    return;
  }

  const currPassword = usuarioResult[0].password;
  const hashCompare = await encrypt.comparePassword(oldPassword, currPassword);
  if (!hashCompare) {
    res.status(401).send('The username or password you entered is incorrect');
    return;
  }

  const passEncrypt = await encrypt.hashPassword(newPassword);
  executionContext((context) => {
    const { connection } = context;

    userModel
      .patchUserPassword(connection, userId, passEncrypt)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        if (Object.prototype.hasOwnProperty.call(err, 'sqlMessage')) {
          res.status(400).send(err.sqlMessage);
        } else {
          res.status(500).send(err);
        }
      });
  });
}

/**
 * PATCH /api/usuario/edit/name/:id
 * @exports patchName
 * @param {express.Request} req Request parameter.
 * @param {express.Response} res Response parameter.
 */
async function patchName(req, res) {
  const userId = req.params.userID;
  const data = req.body;

  if (req.userName !== userId) {
    res.status(401).send('You can only edit your own name');
    return;
  }

  executionContext((context) => {
    const { connection } = context;

    userModel
      .patchName(connection, userId, data.name)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        if (Object.prototype.hasOwnProperty.call(err, 'sqlMessage')) {
          res.status(400).send(err.sqlMessage);
        } else {
          res.status(500).send(err);
        }
      });
  });
}

module.exports = {
  addUsuario,
  getUsuario,
  patchUserPassword,
  patchType,
  deleteUsuario,
  getUsuarios,
  patchMyPassword,
  patchName,
};
