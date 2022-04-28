
// server-index.js
const express = require("express");

const PORT = process.env.PORT || 3001;

const fs = require("fs");
const bp = require("body-parser");
const path = require("path");
const bcrypt = require('bcryptjs/dist/bcrypt');
const jwt = require('jsonwebtoken');
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "geriatrik",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Geriatrik database connection succesful!");
});

getPatients = function () {
  return new Promise(function (resolve, reject) {
    con.query("SELECT * FROM paciente", function (err, rows, fields) {
      if (err) throw err;
      results = Object.values(JSON.parse(JSON.stringify(rows)));
      resolve(results);
    });
  });
};

addPatient = function (
  nombre,
  apellidoP,
  apellidoM,
  fechaNac,
  sexo,
  escolaridad,
  discapacidades,
  queja_memoria,
  hipoacusia_severa,
  contactoEmergencia,
  imagenPerfil
) {
  return new Promise(function (resolve, reject) {
    con.query(
      "INSERT INTO * Paciente VALUES (" +
        nombre +
        ", " +
        apellidoP +
        ", " +
        apellidoM +
        ", " +
        fechaNac +
        ", " +
        sexo +
        ", " +
        escolaridad +
        ", " +
        discapacidades +
        ", " +
        ", " +
        queja_memoria +
        ", " +
        hipoacusia_severa +
        ", " +
        contactoEmergencia +
        ", " +
        imagenPerfil +
        "",
      function (err, rows, fields) {
        if (err) throw err;
        results = Object.values(JSON.parse(JSON.stringify(rows)));
        resolve(results);
      }
    );
  });
};

addEmployee = function (nombre, apellidoP,apellidoM,fechaNac,tipo,sexo,cedula,email,cont){
  return new Promise(function (resolve, reject) {
    con.query("INSERT INTO empleado (nombre,apellidoP,apellidoM,fechaNac,tipoEmpleado,sexo,cedula,email,password,imagenPerfil)"+
      "SELECT * FROM (SELECT '"+
      nombre+"', '"+
      apellidoP+"', '"+
      apellidoM+"', '"+
      fechaNac+"', "+
      tipo+", '"+
      sexo+"', '"+
      cedula+"', '"+
      email+"', '"+
      cont+"','none')"+
      "as tmp WHERE NOT EXISTS ( SELECT email FROM empleado WHERE email = '" +email+ "') LIMIT 1",
      function (err, results) {
        if (err) throw err;
        resolve(results);
      }
    )
  });
};

const swaggerSpec = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GERIATRIK API",
      version: "0.1.0",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: [`${path.join(__dirname, "./index.js")}`],
};

const app = express();
app.use(express.json());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(
  "/api-doc",
  swaggerUI.serve,
  swaggerUI.setup(swaggerJsDoc(swaggerSpec))
);

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
app.get("/api-info", (req, res) => {
  res.json({ message: "API version 0.1" });
});

/**
 * @swagger
 * /patients:
 *  get:
 *      summary: Retorna la lista de la base de datos de pacientes en el servidor
 *      tags: [Patient]
 */
app.get("/patients", (req, res) => {
  getPatients().then(function (results) {
    console.log(results);
    res.json({ message: results });
  });
});

//CREATE
app.post("/addPatient", (req, res) => {
  addPatient().then(function (results) {
    console.log(results);
    res.json({ message: results });
  });
});

app.post("/register", (req,res) => {
  const {nombre, apellidoP,apellidoM,fechaNac,tipo,sexo,cedula,email,cont} = req.body;

  //encriptado de la contraseña
  const salt = await bcrypt.genSalt(10); 
  cont = await bcrypt.hash(password,salt);
  
  try {
    addEmployee(nombre, apellidoP,apellidoM,fechaNac,tipo,sexo,cedula,email,cont).then(function (results){
      console.log(results);
      res.json({ message: results });

      if(results[affectetRows] != 0){
        //payload to send in jwt
        const payload = {
          user: {
              cedula: cedula
          }
        }

        //sign the jwt to ensure it hasn't been altered, sign uses payload and secret
        jwt.sign(payload,config.get('jwtSecret'),{
          expiresIn: 3600
        },(err,token) => {
            //return generated jwt
            if(err) throw err;
            res.json({token});
        });
      }else{
        res.json({message: "User already exists"});
      } 
    });
  } catch (error) {
    res.status(500).send('Server error');
  }
  
});
