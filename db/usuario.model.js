async function addUsuario(connection, user) {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO User VALUES (?, ?, ?, ?)',
      [user.username, user.name, user.password, user.type.toLowerCase()], (err, results) => {
        if (err) return reject(err);

        return resolve(results);
      });
  });
}

async function getUsuario(connection, userId) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT username, name, type FROM User WHERE username = ?',
      userId, (err, results) => {
        if (err) return reject(err);

        return resolve(results);
      });
  });
}

async function patchUserPassword(connection, userId, password) {
  return new Promise((resolve, reject) => {
    connection.query(`UPDATE User SET password = ? 
    WHERE username = ?`,
    [password, userId], (err, results) => {
      if (err) return reject(err);

      return resolve(results);
    });
  });
}

async function patchType(connection, userId, type) {
  return new Promise((resolve, reject) => {
    connection.query(`UPDATE User SET type = ? 
    WHERE username = ?`,
    [type, userId], (err, results) => {
      if (err) return reject(err);

      return resolve(results);
    });
  });
}

async function patchName(connection, userId, name) {
  return new Promise((resolve, reject) => {
    connection.query(`UPDATE User SET name = ? 
    WHERE username = ?`,
    [name, userId], (err, results) => {
      if (err) return reject(err);

      return resolve(results);
    });
  });
}

async function deleteUsuario(connection, userId) {
  return new Promise((resolve, reject) => {
    connection.query('DELETE FROM User WHERE username = ?',
      userId, (err, results) => {
        if (err) return reject(err);

        return resolve(results);
      });
  });
}

async function getUsuarios(connection) {
  return new Promise((resolve, reject) => {
    connection.query('SELECT username, name, type FROM User', (err, results) => {
      if (err) return reject(err);

      return resolve(results);
    });
  });
}

/**
 * Crea un registro de lectura
 * @throws {mysql.MysqlError}
 * @param {mysql.PoolConnection} connection Conexi??n a usar
 * @param {string} username Usuario a buscar
 */
async function getUsuarioAuth(connection, username) {
  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT * from User WHERE username = ? LIMIT 1',
      [username],
      (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      },
    );
  });
}

module.exports = {
  addUsuario,
  getUsuario,
  patchUserPassword,
  patchType,
  deleteUsuario,
  getUsuarios,
  getUsuarioAuth,
  patchName,
};
