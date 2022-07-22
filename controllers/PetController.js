const Pet = require('../models/Pet')

// helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class PetController {

    static async create(req, res){
        
        const { name, age, weight, color } = req.body

        const images = req.files

        const available = true

        // images upload

        //validations
        if(!name){
            res.status(422).json({message: 'O nome eh obrigatorio!'})
            return
        }

        if(!age){
            res.status(422).json({message: 'A idade eh obrigatorio!'})
            return
        }

        if(!weight){
            res.status(422).json({message: 'O peso eh obrigatorio!'})
            return
        }

        if(!color){
            res.status(422).json({message: 'A cor eh obrigatoria!'})
            return
        }

        if(images.length === 0){
            res.status(422).json({message: 'A imagem eh obrigatoria!'})
            return
        }

        // get user owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        // create a pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            },
        })

        images.map((image) => {
            pet.images.push(image.filename)
        })

        try {
            const newPet = await pet.save()
            res.status(201).json({
                message: 'Pet cadastrado com sucesso!',
                newPet,
            })
        } catch (error) {
            res.status(500).json({message: error})
        }
    }

    static async getAll(req, res){
        const pets = await Pet.find().sort('-createdAt')

        res.status(200).json({pets: pets,})
    }

    static async getAllUserPets(req, res){
        //get user
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'user._id': user._id}).sort('-createdAt')

        res.status(200).json({pets,})
    }

    static async getAllUserAdoptions(req, res){
        //get user
        const token = getToken(req)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'adopter._id': user._id}).sort('-createdAt')

        res.status(200).json({pets,})
    }

    static async getPetById(req, res) {
        const id = req.params.id
    
        // check if id is valid
        if (!ObjectId.isValid(id)) {
          res.status(422).json({ message: 'ID inválido!' })
          return
        }

        // check if pet exists
        const pet = await Pet.findOne({ _id: id })
    
        if (!pet) {
          res.status(404).json({ message: 'Pet não encontrado!' })
          return
        }
    
        res.status(200).json({
          pet: pet,
        })
      }

    static async removePetById(req, res){
        const id = req.params.id

        // check if id is valid
        if(!ObjectId.isValid(id)){
            res.status(422).json({message: 'Id invalido!'})
            return
        }

        // check is pet exists
        const pet = await Pet.findOne({_id: id})

        if(!pet){
            res.status(404).json({message: 'Pet nao encontrado!'})
            return
        }

        // check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        console.log(user)
        if(pet.user._id.toString() !== user._id.toString()){
            res.status(422).json({message: 'Houve um problema em processar a sua solicitacao!'})
            return
        }

        await Pet.findByIdAndDelete(id)

        res.status(200).json({message: 'Pet removido com sucesso!'})
    }

    static async updatePet(req, res){
        const id = req.params.id 

        const { name, age, weight, color, available } = req.body

        const images = req.files

        const updatedData = {}

       // check is pet exists
       const pet = await Pet.findOne({_id: id})

       if(!pet){
           res.status(404).json({message: 'Pet nao encontrado!'})
           return
       }

       // check if logged in user registered the pet
       const token = getToken(req)
       const user = await getUserByToken(token)

       console.log(user)
       if(pet.user._id.toString() !== user._id.toString()){
           res.status(422).json({message: 'Houve um problema em processar a sua solicitacao!'})
           return
       }

       //validations
       if(!name){
        res.status(422).json({message: 'O nome eh obrigatorio!'})
        return
        }else{
            updatedData.name = name
        }

        if(!age){
            res.status(422).json({message: 'A idade eh obrigatorio!'})
            return
        }
        else{
            updatedData.age = age
        }

        if(!weight){
            res.status(422).json({message: 'O peso eh obrigatorio!'})
            return
        }else{
            updatedData.weight = weight
        }

        if(!color){
            res.status(422).json({message: 'A cor eh obrigatoria!'})
            return
        }else{
            updatedData.color = color
        }

        if(images.length === 0){
            res.status(422).json({message: 'A imagem eh obrigatoria!'})
            return
        }else{
            updatedData.images = []
            images.map((image) => {
                updatedData.images.push(image.filename)
            })
        }

        await Pet.findByIdAndUpdate(id, updatedData)

        res.status(200).json({message: 'Pet atualizado com sucesso!'})
    }
}