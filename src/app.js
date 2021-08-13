const sql = require("./services/sql");
const ws = require("./services/wasabi");

const cron = require("node-cron");

const task = cron.schedule("* * * * *", () => {
  console.log("running a task every minute");
  sql
    .backupdb()
    .then((result) => {
      ws.upload(result.name_backup, result.date);
    })
    .catch((err) => {});
});

task.start();
