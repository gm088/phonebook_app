require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
//const cors = require('cors')
//app.use(cors())
const app = express()

app.use(express.static('dist'))
app.use(express.json())

morgan.token('reqBody', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :reqBody :response-time ms'))

const Number = require('./models/number')

const infoResponse = () => {
    
    const dat = new Date().toString()
    const s1 = `Phonebook has info for ${persons.length} people`
    const resString = `<p>${s1}</p><p>${dat}</p>`
    return(resString)
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
//app.get('/api/persons', (req, res) => {
//    res.json(persons) // express stringifies it
//})

app.get('/api/persons', (req, res) => {
    
    //use MongoDB model + query
    Number.find({}).then(nums => {
        res.json(nums)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    
    //Mongo
    Number.findById(req.params.id)
    .then(num => {
        if(num){   //if it doesn't exist returns null
            res.json(num)
        }else{
            res.status(404).end()
        }
    })
    .catch(error => {
        next(error)
    })
    //if next called without arg, execution moves to next route/middleware
    //if next called with arg, then goes to express error handler
    // error-handling functions have four arguments instead of three: (err, req, res, next)

    //if this code were synchronous, we would not need to explicity pass to express
})

//post
app.post('/api/persons', (req, res, next) => {

    //parse body
    const body = req.body
    if(!body.name || !body.number){
        return res.status(400).json({error: "missing info"})
    }

    if(persons.find(p => p.name === body.name)){
        return res.status(400).json({error: "person exists"})
    }

    const number = new Number({
        name: body.name,
        number: body.number,
    })

    number.save()
    .then(savednum => {
        res.json(savednum)
    })
    .catch(err => {
        next(err)
    })

})

//put request - updating a number
app.put('/api/persons/:id', (req, res, next) => {

    //const { name, num } = req.body

    Number.findById(req.params.id)
    .then(number => {
        if(!number){
            res.status(404).end
        }
    
        number.name = req.body.name
        number.number = req.body.number

        number.save()
        .then(updatedNum => res.json(updatedNum))
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {

    Number.findByIdAndDelete(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(err => next(err))
})

//a middleware for requests to non-existent routes
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// here, putting four arguments err, req, res and next, defines this as an error handler
const errorHandler = (err, req, res, next) => {

    console.error(err.message)

    if(err.name === 'CastError'){
        return res.status(400).send({error: 'malformatted ID'})
    }else if(err.name === 'ValidationError'){
        return res.status(400).json({error: err.message})
    }

    //unhandled case: pass to express error handler
    next(err)
}

app.use(errorHandler)

PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

