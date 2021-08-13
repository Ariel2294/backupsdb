const sql = require("./services/sql");
const ws = require("./services/wasabi");

const cron = require("node-cron");
//M H DM M DS
const task = cron.schedule("8 15 * * *", () => {
  console.log("running a task every minute");
  sql
    .backupdb()
    .then((result) => {
      ws.upload(result.name_backup, result.date);
    })
    .catch((err) => {
      console.log("Erro generar backup", err);
    });
});

task.start();
