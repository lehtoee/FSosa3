require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
const { request, response } = require('express')


app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))


let persons = [
    {
        "name": "Arto Hellas",
        "number": "1",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "5",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendick",
        "number": "39-23-6423122",
        "id": 4
    },
    {
        "name": "jii",
        "number": "1",
        "id": 5
    }
]

const generateAlmostRandomId = (max) => {
    return Math.floor(Math.random() * max)
}

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})


app.get('/api/info', (req, res) => {
    Person.find({}).count()
    .then(result => {
        res.send(`<div>Phonebook has info for ${result} people</div><br><div>${new Date()}</div>`)
    })  
})

app.get('/api/persons/:id', (request, response, next) => {

    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

const checkPostDataIsValid = (body) => {
    let checkIfNameExists = persons.some(person =>
        person.name === body.name)
    if(!body.name || !body.number || checkIfNameExists){
        return false
    }
    else{
        return true
    }
}

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    console.log(request.body)

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    
    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}
  
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})