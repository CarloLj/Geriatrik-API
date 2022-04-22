// server-index.js
const express = require("express");

const PORT = process.env.PORT || 3001;

const fs = require("fs");
const bp = require('body-parser');
const path = require("path");

const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');


var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "geriatrik"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Geriatrik database connection succesful!");
});

getPatients = function(){
    return new Promise(function(resolve, reject){
      con.query(
        "SELECT * FROM paciente", function (err, rows, fields) {                                                
            if (err) throw err
            results = Object.values(JSON.parse(JSON.stringify(rows)));
            resolve(results);  
          }
      )}
  )
}

const swaggerSpec = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "CARS API - CARLO LUJAN",
            version: "1.0.0"
        },
        servers: [
            {
                url: `http://localhost:${PORT}`
            }
        ]
    },
    apis:[`${path.join(__dirname, "./index.js")}`]
}

const app = express ();
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)));

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

/**
 * @swagger
 * components:
 *  schemas:
 *      Patient:
 *          type: object
 *          properties:
 *              pacienteID:
 *                  type: string
 *                  description: Identificador unico del paciente
 *              nombre:
 *                  type: string
 *                  description: Nombre del paciente
 *              apellidoP:
 *                  type: string
 *                  description: Apellido paterno del paciente
 *              apellidoM:
 *                  type: string
 *                  description: Apellido materno del paciente
 *              fechaNac:
 *                  type: date
 *                  description: Fecha de naciemiento del paciente
 *              sexo:
 *                  type: string
 *                  description: Apellido materno del paciente 
 *              escolaridad:
 *                  type: string
 *                  description: Apellido materno del paciente 
 *              discapacidades:
 *                  type: string
 *                  description: Apellido materno del paciente 
 *              quejaMemoria:
 *                  type: bool
 *                  description: Apellido materno del paciente
 *              hipoacusia_severa:
 *                  type: bool
 *                  description: Apellido materno del paciente  
 *              contactoEmergencia:
 *                  type: int
 *                  description: Apellido materno del paciente 
 *              imagenPerfil:
 *                  type: string
 *                  description: Apellido materno del paciente  
*/


/**
 * @swagger
 * /api:
 *  get:
 *      tags:
 *        - "Api"
 *      summary: Retorna un mensaje de informacion del api
 */
app.get("/api-info", (req,res) => {
    res.json({message: "API version 0.1"});
});

/**
 * @swagger
 * /cars:
 *  get:
 *      summary: Retorna la lista de la base de datos de pacientes en el servidor
 *      tags: [Patient]
 */
app.get("/patients", (req, res) => {
    getPatients().then(
        function(results){
        console.log(results)
        res.json({message: results});
    });
});
