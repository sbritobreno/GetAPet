const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

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
        
        user.name = name

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
            
            await createUserToken(newUser, req, res)

        } catch (error) {
            res.status(500).json({message: error})
        }
    }

    static async login(req, res){
        const { email, password } = req.body

        if(!email){
            res.status(422).json({message: 'O email eh obrigatorio'})
            return
        }

        if(!password){
            res.status(422).json({message: 'A senha eh obrigatoria'})
            return
        }

        // check if user exists
        const user = await User.findOne({email: email})

        if(!user){
            res.status(422).json({message: 'Nao existe usuario com este email!'})
            return
        }

        // check password
        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            res.status(422).json({message: 'Senha invalida!'})
            return
        }
        
        await createUserToken(user, req, res)
    }

    static async checkUser(req, res){
        let currentUser

        if(req.headers.authorization){

            const token = getToken(req)
            const decoded = jwt.verify(token, "nossosecret")

            currentUser = await User.findById(decoded.id)
            currentUser.password = undefined

        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res){
        const id = req.params.id

        const user = await User.findById(id).select('-password')  // select in this case is being used to unselect this field

        if(!user){
            res.status(422).json({message: 'Usuario nao encontrado'})
            return
        }

        res.status(200).json({ user })
    }

    static async editUser(req, res) {
        const id = req.params.id

        // check if user exists
        const token = getToken(req)
        const user = await getUserByToken(token)

        const { name, email, phone, password, confirmpassword } = req.body
        let image = ''

        // Validations
        if(!name){
            res.status(422).json({message: 'O nome eh obrigatorio'})
            return
        }

        user.name = name

        if(!email){
            res.status(422).json({message: 'O email eh obrigatorio'})
            return
        }

        //check if the email was already taken
        const userExists = await User.findOne({email: email})

        if(user.email !== email && userExists){
            res.status(422).json({message: 'Por favor, utilize outro email'})
            return
        }

        user.email = email

        if(!phone){
            res.status(422).json({message: 'O telefone eh obrigatorio'})
            return
        }

        user.phone = phone

        if(password != confirmpassword){
            res.status(422).json({message: 'As senhas nao conferem!'})
            return
        }else if(password === confirmpassword && password != null){
            //create a password
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }

        try {
            // update user data
            await User.findOneAndUpdate(
                { _id: user._id},
                {$set: user},
                { new: true},
            )

            res.status(200).json({message: 'Usuario atualizado com sucesso!'})
            
        } catch (error) {
            res.status(500).json({message: error})
            return
        }
    }
}