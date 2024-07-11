import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showFiltered, setShowFiltered] = useState('')

  useEffect(() => {
    personService.getAll()
    .then(response => {
      setPersons(response.data)
    })
  }, [])

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFiltering = (event) => {
    const updatedValue = event.target.value
    setShowFiltered(updatedValue)
  }

  const deletePerson = id => {
    const nameP = persons.find(p => p.id === id)
    if (confirm(`Delete ${nameP.name} ?`)) {
      personService.deleteIndividual(id)
      setPersons(persons.filter(p => p.id !== id))
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject ={
      name: newName,
      number: newNumber,
    }
    
    if (!persons.some(i => i.name === personObject.name)) {
      personService.create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
    } else {
      if (confirm(`${personObject.name} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === personObject.name)
        const changedPerson = {...person, number: personObject.number}

        personService.update(person.id, changedPerson)
        .then(response => {
          setPersons(persons.map(p => p.id !== person.id ? p : response.data))
        })
      }
        setNewName('')
        setNewNumber('')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        show={showFiltered}
        change={handleFiltering}
        />
      <h2>add a new</h2>
        <PersonForm
          addPerson={addPerson}
          name={newName} nameFunction={handlePersonChange}
          number={newNumber} numberFunction={handleNumberChange}
        />
      <h2>Numbers</h2>
      <Number
        persons={persons}
        filter={showFiltered}
        deletePersonFunction={deletePerson}
      />
    </div>
  )
}

const Number = ({persons, filter, deletePersonFunction}) => {
  const personsToShow = persons.filter(person => person.name.includes(filter))
  return (
    <ul>
      {personsToShow.map(person =>
          <Person key={person.name}
            person={person}
            deleteThisPerson={() => deletePersonFunction(person.id)}
          />
        )}
    </ul>
  )
}

const Person = ({person, deleteThisPerson}) => {
  return (
    <div>
    {person.name} {person.number}
    <button onClick={deleteThisPerson}>delete</button>
    </div>
  )
}

const Filter = ({show, change}) => {
  return (
    <div>
      filter shown with
      <input
      value={show}
      onChange={change}
      />
    </div>
  )
}

const PersonForm = ({addPerson, name, nameFunction, number, numberFunction}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
      name: 
      <input 
      value={name}
      onChange={nameFunction}
      />
      phonenumber:
      <input
      value={number}
      onChange={numberFunction}
      />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default App