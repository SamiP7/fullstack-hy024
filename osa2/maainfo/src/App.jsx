import { useState, useEffect } from 'react'
import axios from 'axios'


const App = () => {
  const [countries, setCountries] = useState([])
  const [showFiltered, setShowFiltered] = useState('')

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(response => {
      setCountries(response.data)
    })
  }, [])
  

  const handleFiltering = (event) => {
    const updatedValue = event.target.value
    setShowFiltered(updatedValue)
  }

  return (
    <div>
      <h1>Countries</h1>
      <Filter
        show={showFiltered}
        change={handleFiltering}
      />
      
      <Country
        countries={countries}
        filter={showFiltered}
        show={setShowFiltered}
      />
    </div>
  )
}

const CountryInfo = ({name, capital, area, languages, flag}) => {
  const flagStyle = {
    fontSize: 300
  }

  return (
    <>
    <h1>{name} <br/></h1>
    <li>capital {capital}</li>
    <li>area {area}</li>
    <br></br>
    <strong>languages:</strong>
    <ul>
      {languages.map(language => 
        <li key={language}>
          {language}          
        </li>)}
    </ul>
    <li style={flagStyle}>
      {flag}
    </li>
    </>
    
  )
}

const showCountryInfo = (country) => {
  return (
    <CountryInfo
      name={country.name.common}
      capital={country.capital}
      area={country.area}
      languages={Object.values(country.languages)}
      flag={country.flag}
    />
  )
}

const Country = ({countries, filter, show}) => {
  const countriesToShow = countries.filter(c => c.name.common.toLowerCase().includes(filter.toLocaleLowerCase()))

  if (countriesToShow.length === 1) {
    const country = countriesToShow[0]
    return (
      showCountryInfo(country)
    )
  }
  if (countriesToShow.length <= 10) {
    return (
      <ul>
        {countriesToShow.map(c =>
          <li key={c.name.common}>
            {c.name.common}
          <button onClick={() => show(c.name.common)}>show</button>
          </li>
        )}
      </ul>
    )
  }
  return (
    <li>
      Too many matches, specify another filter
    </li>
  )
  
  
}

const Filter = ({show, change}) => {
  return (
    <div>
      find countries
      <input
      value={show}
      onChange={change}
      />
    </div>
  )
}

export default App
