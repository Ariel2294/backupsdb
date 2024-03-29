const sql = require("./services/sql");
const ws = require("./services/wasabi");

const cron = require("node-cron");

const uploading = async () => {

  sql
    .backupdb()
    .then((result) => {
      ws.upload(
        result.name_backup,
        result.date,
        result.mes_name,
        result.dia_name,
        result.year
      );
    })
    .catch((err) => {
      console.log("Erro generar backup", err);
    });
}


//M H DM M DS
const task = cron.schedule(process.env.CRON, () => {
  console.log("running a task every minute");
  uploading()

});


uploading()
task.start();
