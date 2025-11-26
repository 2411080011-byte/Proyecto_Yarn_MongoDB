const bcrypt = require("bcryptjs");
const User = require("../models/user");

//Para el login
const jwt = require("../utils/jwt");
//Para el token
const {JWT_SECRET_KEY} = require("../constante");

//PARA EL REGISTER
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

//PARA EL LOGIN
async function login(req, res) {
    try {
        const {email, password} = req.body;

        //Validar campos requeridos
        if (!email || !password) {
            return res.status(400).json({msg: "El email y la contraseña son obligatorias"});
        }
        const emailLowerCase = email.toLowerCase();

        //Buscar usuario
        const userStore = await User.findOne({email: emailLowerCase});

        if (!userStore) {
            return res.status(404).json({msg: "El usuario no existe"});
        }

        //Comparar contraseña
        const passwordMatch = await bcrypt.compare(password, userStore.password);
        if (!passwordMatch) {
            return res.status(400).json({msg: "Contraseña incorrecta"});
        }

        //Verificar si el usuario está activo
        if (!userStore.active) {
            return res.status(401).json({msg: "Usuario no autorizado o inactivo"});
        }

        //Generar tokens
        const accessToken = jwt.createAccessToken(userStore);
        const refreshToken = jwt.createRefreshToken(userStore);

        return res.status(200).json({
            msg: "Inicio de sesión exitoso",
            access: accessToken,
            refresh: refreshToken,
        });
    } catch (error) {
        console.log("Error en login: ", error);
        return res.status(500).json({msg: "Error del servidor: ", error: error.message});
    }
}

//PARA EL TOKEN
async function refreshAccessToken(req, res) {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).send({msg: "Token requerido"});
        }

        //Decodificar el token
        let payload;
        try {
            payload = jwt.decoded(token);
        } catch (error) {
            return res.status(400).send({msg: "Token inválido o expirado"});
        }

        const { user_id } = payload;
        //Buscar usuario con await
        const userStorage = await User.findById(user_id);

        if (!userStorage) {
            return res.status(404).send({msg: "Usuario no encontrado"});
        }
        //Crear nuevo access token
        const accessToken = jwt.createAccessToken(userStorage);

        return res.status(200).send({ accessToken });

    } catch (error) {
        console.error("Error en refreshAccessToken: ", error);
        return res.status(500).send({msg: "Error del servidor"});
    }
}

module.exports = {
    register,
    login,
    refreshAccessToken,
};