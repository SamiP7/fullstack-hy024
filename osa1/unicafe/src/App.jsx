import { useState } from 'react'

const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const increaseGoodByOne = () => {
    setGood(good + 1)
    setTotal(total + 1)
    const updatedGood = good + 1
    const updatedTotal = total + 1
    setAverage((updatedGood - bad )/ updatedTotal)
    setPositive(updatedGood/updatedTotal)
  }
  const increaseNeutralByOne = () => {
    setNeutral(neutral + 1)
    setTotal(total + 1)
    const updatedTotal = total + 1
    setAverage((good - bad )/ updatedTotal)
    setPositive(good/updatedTotal)
  }
  const increaseBadByOne = () => {
    setBad(bad + 1)
    setTotal(total + 1)
    const updatedBad = bad + 1
    const updatedTotal = total + 1
    setAverage((good - updatedBad )/ updatedTotal)
    setPositive(good/updatedTotal)
  }

  const changeToPercentage = (value) => {
    const newValue = value * 100
    return (
      newValue + ' %'
    )
  }
  return (
    <div>
      <Header 
        header='give feedback'
      />
      <Button 
        handleClick={increaseGoodByOne}
        text='good'
      />
      <Button 
        handleClick={increaseNeutralByOne}
        text='neutral'
      />
      <Button 
        handleClick={increaseBadByOne}
        text='bad'
      />
      <Header 
        header='statistics'
      />
      <Display
       text='good'
       stats={good}
      />
      <Display
       text='neutral'
       stats={neutral}
      />
      <Display
       text='bad'
       stats={bad}
      />
      <Display
       text='all'
       stats={total}
      />
      <Display
       text='average'
       stats={average}
      />
      <Display
       text='positive'
       stats= {changeToPercentage(positive)}
      />
    </div>
  )
}

const Header = ({ header }) => {return (<h1>{header}</h1>)}

const Display = ({text, stats}) => {
  return (
    <div>{text} {stats}</div>
  )
}

const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

export default App