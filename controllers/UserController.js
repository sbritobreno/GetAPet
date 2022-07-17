const User = require('../models/User')

module.exports = class UserController {

    static async register(req, res) {
        // const name = req.body.name
        // const email = req.body.email
        // const phone = req.body.phone 
        // const password = req.body.password
        // const confirmpassword = req.body.confirmpassword

        const { name, email, phone, password, confirmpassword } = req.body

        // Validations
        if(!name){
            res.status(422).json({message: 'O nome eh obrigatorio'})
            return
        }
        if(!email){
            res.status(422).json({message: 'O email eh obrigatorio'})
            return
        }
        if(!phone){
            res.status(422).json({message: 'O telefone eh obrigatorio'})
            return
        }
        if(!password){
            res.status(422).json({message: 'A senha eh obrigatorio'})
            return
        }
        if(!confirmpassword){
            res.status(422).json({message: 'A confirmacao de senha eh obrigatorio'})
            return
        }
        if(password !== confirmpassword){
            res.status(422).json({message: 'A confirmacao de senha nao confere!'})
            return
        }

        // check if user exists
        const userExists = await User.findOne({email: email})

        if(userExists){
            res.status(422).json({message: 'Este email ja esta cadastrado'})
            return
        }
    }

}