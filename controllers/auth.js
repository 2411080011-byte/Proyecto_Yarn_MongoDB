const bcrypt = require("bcryptjs");
const User = require("../models/user");
const user = require("../models/user");

 async function register (req, res) {
    try{

    const { firstname, lastname, email, password } = req.body;

    if (!email) res.status(400).send({message: "El email es obligatorio"});
    if (!password) res.status(400).send({message: "La contraseña es obligatoria"});
    
    // crear nuevo usuario

    const user = new User({
    firstname,
    lastname,
    password,
    email: email.toLowerCase(),
    role: "user",
    active: false,

 });


    //encriptar contraseña
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    user.password = hashPassword;

    //guardar usuario en base de datos

    const userStorage = await user.save();
    console.log(userStorage);
    res.status(200).send(userStorage);    

}catch (error) {

    console.error(error);
    res.status(200).send({
        msg: "Usuario creado correctamente",
        error: error.message,

});
    }   
}

module.exports = {
    register,
};