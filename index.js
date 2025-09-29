const express = require('express')
var morgan = require('morgan')
//const cors = require('cors')

const app = express()
app.use(express.json())
//app.use(cors())
morgan.token('reqBody', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :reqBody :response-time ms'))
app.use(express.static('dist'))

const Number = require('./models/number')

const infoResponse = () => {
    
    const dat = new Date().toString()
    const s1 = `Phonebook has info for ${persons.length} people`
    const resString = `<p>${s1}</p><p>${dat}</p>`
    return(resString)
}

//a middleware for requests to non-existent routes
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateID = () => {
    
    randd = Math.round((Math.random()*1000000000))
    return(String(randd))
}

//define response to get request to root
app.get('/', (req, res) => {
    res.send("Phonebook App")
})

//define response to get request to info
app.get('/info', (req, res) => {
    res.send(infoResponse())
})

//define response to get request to persons
app.get('/api/persons', (req, res) => {
    res.json(persons) // express stringifies it
})

app.get('/api/persons/:id', (req, res) => {
    
    const identifier = req.params.id
    personOI = persons.find(p => p.id === identifier)
    personOI ? res.json(personOI) : res.status(400).json({ error : "person not found" })

})

//post
app.post('/api/persons', (req, res) => {

    //parse body
    const body = req.body
    if(!body.name || !body.number){
        return res.status(400).json({error: "missing info"})
    }

    if(persons.find(p => p.name === body.name)){
        return res.status(400).json({error: "person exists"})
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateID()
    }

    persons = persons.concat(newPerson)
    res.json(newPerson)

})

app.delete('/api/persons/:id', (req, res) => {

    const identifier = req.params.id
    persons = persons.filter(p => p.id !== identifier)

    res.status(204).end()

})

app.use(unknownEndpoint)

PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

