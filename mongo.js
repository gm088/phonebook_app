
const mongoose = require('mongoose')

//if(process.argv.length < 5){
//    console.log('usage: password name number')
//    process.exit(1)
//}

const password = process.argv[2]
const url = `mongodb+srv://gm088:${password}@cluster0.ohbxqp1.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url).catch(error => console.log("error connecting to MongoDB"))

//delare Schema
const numberSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Number = mongoose.model('Number', numberSchema)

//if only PW provided
if(process.argv.length === 3){
    console.log('fetching all numbers...')
    Number.find({}).then(res => {
        res.forEach(n => console.log(n))
        mongoose.connection.close()
    })
    process.exit(0)
}

// else, create new document
const personName = process.argv[3]
const personNumber = process.argv[4]

//use the command line args to create new person obj model
const number = new Number({
    name: personName,
    number: personNumber,
})

//save new number to DB
number.save().then(res => {
    console.log(`success - added ${personName} with no. ${personNumber} to phonebook`)
    mongoose.connection.close()
}).catch(error => console.log(error))

//const noteSchema = new mongoose.Schema({
//    content: String,
//    important: Boolean,
//})
//
//const Note = mongoose.model('Note', noteSchema)
//
//const note = new Note({
//    content: 'HTML is easy',
//    important: true,
//})
//
//note.save().then( res => {
//    console.log('note saved')
//    mongoose.connection.close()
//} )

Note.find( {} ).then(result => {
    result.forEach(note => console.log(note))
    mongoose.connection.close()
})


