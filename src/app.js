const sql = require("./services/sql");
const mail = require("./services/mail");

// sql
//   .backupdb()
//   .then(() => {
//     //Si todo está bien se sube a wasabi
//   })
//   .catch(() => {});

const resultado = mail.sendmail(
  "arielopez229422@gmail.com",
  "prueba",
  "testing"
);
console.log(resultado);
