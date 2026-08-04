const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "0123456789",
    database: "tupa_unsaac"
});

connection.connect((err) => {
    if (err) {
        console.error("Error al conectar con MySQL:", err.message);
        return;
    }

    console.log("Conectado a MySQL - Base de datos tupa_unsaac");
});

module.exports = connection;