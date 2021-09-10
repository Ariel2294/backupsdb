require("dotenv").config();
const mysqldump = require("mysqldump");
const path = require("path");
const momenttz = require("moment-timezone");
var fs = require("fs");
module.exports = {
  backupdb: async () => {
    const now = momenttz().tz("America/El_Salvador").locale("es");
    const date = now.format("DD-MM-YYYY-h-mmA");
    const mes_name = now.format("MMMM")?.toUpperCase();
    const dia_name = now.format("dddd")?.toUpperCase();
    const year = now.format("Y");
    const dir = path.join(__dirname, `../../tmp`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    console.log("iniciando creacion de sql");
    const name_backup = `Backup-automatico-${dia_name}-${now.format(
      "DD-MM-YYYY-h-mmA"
    )}`;

    const result = await mysqldump({
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      },
      dumpToFile: `${dir}/${name_backup}.sql`,
    });
    console.log("finalizando creacion de sql");

    return { result, name_backup, date, mes_name, dia_name, year };
  },
};
