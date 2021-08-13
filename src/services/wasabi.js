const AWS = require("aws-sdk");
const path = require("path");
const fs = require("fs");
const mail = require("./mail");
const fsextra = require("fs-extra");
module.exports = {
  upload: async (name_file, folder, folder_mes, dia_name, year) => {
    const accessKeyId = process.env.WS_ACCESS_KEYID;
    const secretAccessKey = process.env.WS_SECRET_ACCESS_KEY;

    const wasabiEndpoint = new AWS.Endpoint(process.env.WS_ENDPOINT);
    const s3 = new AWS.S3({
      endpoint: wasabiEndpoint,
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      httpOptions: {
        connectTimeout: 2400000,
        timeout: 2400000,
      },
    });
    console.log("iniciando envio de sql");

    const bucketName = process.env.WS_BUCKET_NAME;
    const dir = path.join(__dirname, `../../tmp`);
    const filePath = `${dir}/${name_file}.sql`;
    const params = {
      Bucket: bucketName,
      Key: `${folder_mes}-${year}/Backup-${dia_name}-${folder}/${path.basename(
        filePath
      )}`,
      Body: fs.createReadStream(filePath),
    };

    var options = {
      partSize: 10 * 1024 * 1024, // 10 MB
      queueSize: 10,
    };

    s3.upload(params, options, async (err, data) => {
      if (!err) {
        //console.log(data); // successful response
        await mail.sendmail(
          process.env.MAIL_DESTINATION,
          `RESPALDO AUTOMATICO EXISTOSO EN-${data.Bucket}-DB-${process.env.DB_NAME}`,
          `
        
        Backup automatico realizado con éxito. \n\n

        Base de datos: ${process.env.DB_NAME}. \n
        Servicio: ${process.env.DB_HOST}. \n
        Location: ${data.Location} \n
        Key: ${data.Key}
        
        
        `
        );
        if (fsextra.existsSync(filePath)) {
          fsextra.remove(filePath);
        }
        console.log("finalizando envio de sql");
      } else {
        console.log(err); // an error occurred

        await mail.sendmail(
          process.env.MAIL_DESTINATION,
          `ERROR RESPALDO AUTOMATICO EN-${bucketName}-DB-${process.env.DB_NAME}`,
          `
        
        ${err}
        
        
        `
        );
      }
    });
  },
};
