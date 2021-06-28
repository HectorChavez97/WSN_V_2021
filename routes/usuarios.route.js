/**
 * Módulo de ruteo del controlador de usuarios.
 * @author Hector Chavez Morales <hector.chavez.97@hotmail.com>
 */
const express = require('express');

const router = express.Router();

const userController = require('../controllers/usuario.controller');
const { auth } = require('../middleware/auth');
const { verify } = require('../middleware/verify');

router.post('/', auth, verify, userController.addUsuario);
router.get('/all', auth, userController.getUsuarios);
router.get('/:userID', auth, userController.getUsuario);
router.delete('/:userID', auth, userController.deleteUsuario);
router.patch('/edit/my-password/:userID', auth, userController.patchMyPassword);
router.patch('/edit/user-password/:userID', auth, verify, userController.patchUserPassword);
router.patch('/edit/name/:userID', auth, userController.patchName);
router.patch('/edit/type/:userID', auth, verify, userController.patchType);

module.exports = router;
