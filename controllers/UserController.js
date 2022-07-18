const User = require('../models/User')
const bcrypt = require('bcrypt')

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

        //create a password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // create a user 
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash,
        })

        try {
            
            const newUser = await user.save()
            res.status(201).json({message: 'Usuario criado!', newUser})
            return

        } catch (error) {
            res.status(500).json({message: error})
        }
    }


}