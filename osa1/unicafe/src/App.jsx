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
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={total}
        average={average}
        positive={positive}
      />
    </div>
  )
}

const Header = ({ header }) => {return (<h1>{header}</h1>)}

const StatisticLine = ({text, value}) => {
  if (text === 'positive') {
    return (
      <div>{text} {value * 100} %</div>
    )
  }
  return (
    <div>{text} {value}</div>
  )
}

const Statistics = (props) => {
  if (props.all === 0) {
    return (
      <div>No feedback given</div>
    )
  }
  return (
    <>
      <StatisticLine text='good' value={props.good} />
      <StatisticLine text='neutral' value={props.neutral} />
      <StatisticLine text='bad' value={props.bad} />
      <StatisticLine text='all' value={props.all} />
      <StatisticLine text='average' value={props.average} />
      <StatisticLine text='positive' value={props.positive}/>
    </>
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