require("dotenv").config();
const mysqldump = require("mysqldump");
const path = require("path");
const momenttz = require("moment-timezone");
const now = momenttz().tz("America/El_Salvador");
var fs = require("fs");
module.exports = {
  backupdb: async () => {
    const dir = path.join(__dirname, `../../tmp`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const name_backup = `Backup-automatico-${now.format("DD-MM-YYYY-hmmsA")}`;
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
    return result;
  },
};
