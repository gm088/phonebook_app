
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
console.log(`connecting to MongoDB`)

mongoose.connect(url)
    .then(result => console.log("connected to MongoDB"))
    .catch(error => console.log("error connecting:", error.message))

//delare Schema
const numberSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,    //validation
        required: true
    },
    number: {
        type: String,
        minLength: 3,
        required: true
    }
})

const Number = mongoose.model('Number', numberSchema)

numberSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        //remove these mongoDB things
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = mongoose.model('Number', numberSchema)
