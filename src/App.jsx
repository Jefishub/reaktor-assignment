import React, { useState, useEffect } from 'react'

function App() {
  const [gloves, setGloves] = useState('')
  const [facemasks, setFacemasks] = useState('')
  const [beanies, setBeanies] = useState('')
  
  const [manufacturers, setManufacturers] = useState([])

  const [showValues, setShowValues] = useState('Loading data')
  
  const showItem = (item) => {
    if (item == "gloves") { setShowValues(gloves)}
    else if (item == "facemasks") { setShowValues(facemasks)}
    else if (item == "beanies") {setShowValues(beanies)}
  }

  useEffect(() => {
    setGloves("New Gloves");
    setFacemasks("Very New Facemasks")
    setBeanies("New Beanies")
  },[])

  return (
    <div>
      <button onClick={() => showItem("gloves")}>Gloves</button>
      <button onClick={() => showItem("facemasks")}>Facemasks</button>
      <button onClick={() => showItem("beanies")}>Beanies</button>
      <p>{ showValues }</p>
    </div>
  );
}

export default App;
