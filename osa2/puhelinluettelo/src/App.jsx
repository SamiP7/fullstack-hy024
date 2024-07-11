import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showFiltered, setShowFiltered] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [errorBoolean, setErrorBoolean] = useState(false)

  useEffect(() => {
    personService.getAll()
    .then(response => {
      setPersons(response.data)
    })
    .catch(error => {
      setErrorBoolean(true)
      setNotificationMessage(`Failed to retrieve numbers from server`)
      console.log(error)
      setTimeout(() => {
        setNotificationMessage('')
      }, 5000)
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
      .catch(error => {
        setErrorBoolean(true)
        setNotificationMessage(`${nameP.name} has already been deleted`)
        console.log(error)
        setTimeout(() => {
          setNotificationMessage('')
        }, 5000)
      })
      setPersons(persons.filter(p => p.id !== id))
      setErrorBoolean(false)
      setNotificationMessage(`Deleted ${nameP.name}`)
      setTimeout(() => {
        setNotificationMessage('')
      }, 5000)
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
      .catch(error => {
        setErrorBoolean(true)
        setNotificationMessage(`Failed to add ${personObject.name}`)
        setTimeout(() => {
          setNotificationMessage('')
        }, 5000)
      })

      setErrorBoolean(false)
      setNotificationMessage(`Added ${personObject.name}`)
      setTimeout(() => {
        setNotificationMessage('')
      }, 5000)
    } else {
      if (confirm(`${personObject.name} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === personObject.name)
        const changedPerson = {...person, number: personObject.number}

        personService.update(person.id, changedPerson)
        .then(response => {
          setPersons(persons.map(p => p.id !== person.id ? p : response.data))
        })
        .catch(error => {
          setErrorBoolean(true)
          setNotificationMessage(`Information of ${personObject.name} has already been deleted`)
          setTimeout(() => {
            setNotificationMessage('')
          }, 5000)
        })

          setErrorBoolean(false)
          setNotificationMessage(`Changed ${personObject.name}'s number`)
          setTimeout(() => {
            setNotificationMessage('')
          }, 5000)
      }
        setNewName('')
        setNewNumber('')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} error={errorBoolean}/>
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

const Notification = ({ message, error }) => {
  const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === '') {
    return null
  }
  if (error) {
    return (
      <div style={errorStyle}>
        {message}
    </div>
    )
  }

  return (
    <div style={successStyle}>
      {message}
    </div>
  )

  
}

export default App