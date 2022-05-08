# Geriatrik-API
API used as back-end for the Geriatrik web app. This APi runs using express to mount the server and connecting to a MySQL database. Developed using Node.js.

This project was developed by:

- [Ruy Guzmán Camacho](https://github.com/Ruy-GC)
- [Carlo Ángel Luján García](https://github.com/CarloLj)
- [Ángel Padilla Esqueda](https://github.com/Int-Angel)
- [Santiago González de Cosío Romero](https://github.com/sant-gdc)
- [Ricardo González Leal](https://github.com/RicardoGLeal)
- [Adrián Becerra Meza](https://github.com/AdrianBecerra411)
- [Fernando López Gómez](https://github.com/fernandolpz-A01639715)


## Endpoints
The API was documented using Swagger on the route [/api-doc](https://geriatrik-api.herokuapp.com/api-doc/).

![image](https://user-images.githubusercontent.com/78626154/167276772-437c649a-e894-400f-bb1a-3e1541e6a70d.png)

## Database
![Diagrama Entidad-Relación - Modelo relacional](https://user-images.githubusercontent.com/78626154/167276855-3b3f8530-c333-4713-a545-10e2ed64701a.png)

## Middleware
As we are generating a Json Web Token when a user logs in or registers it was necesary to have some validation of this token to access our endpoints. We implemented an auth middleware that decodes our token and if it is valid or hasn't expired we can send requests to the api and database.

```javascript
const jwt = require('jsonwebtoken');

module.exports = function(req,res,next){
    //Get token from header
    const token = req.header('x-auth-token');

    //Check if not token
    if(!token) {
        //check if teken exist in the header
        return res.status(401).json({msg: 'No token, authorization denied'});
    }

    try {
        //gets payload with user id from token
        const decoded = jwt.verify(token,"secret");
        //gets user from the payload to have access to it from the route
        req.user = decoded.user;
        next();
        
    } catch (error) {
        res.status(401).json({msg:'Token is not valid'});
    }
}
```
### Example
```javascript
app.get("/patients",auth ,(req, res) => {
  getPatients().then(function (results) {
    console.log(results);
    res.json({ message: results });
  });
});
```
## Deploy
### [API deploy](https://geriatrik-api.herokuapp.com/api-doc/)

The api was deployed using Heroku and creating the connection to MySQL using ClearDB MySQL.

