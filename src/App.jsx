import React, { useState, useEffect } from 'react'

const CORS_URL = "https://cors-anywhere.herokuapp.com/" //TO fix CORS error
const CATEGORY_API_URL = CORS_URL + "https://bad-api-assignment.reaktor.com/v2/products/" //ADD category name
const MANUFACTURER_API_URL = "https://bad-api-assignment.reaktor.com/v2/availability/" //ADD manufacturer name


function App() {
  const [gloves, setGloves] = useState('Gloves not ready')
  const [facemasks, setFacemasks] = useState('Facemasks not ready')
  const [beanies, setBeanies] = useState('Beanies not ready')

  const [manufacturers, setManufacturers] = useState([])

  const [reload, setReload] = useState(false)
  const [showValues, setShowValues] = useState('Loading data')
  
  const showItem = (item) => {
    if (item == "gloves") { setShowValues(gloves)}
    else if (item == "facemasks") { setShowValues(facemasks)}
    else if (item == "beanies") {setShowValues(beanies)}
  }

  async function getProductData(product) {
    const response = await fetch(CATEGORY_API_URL+product);
    return await response.json()
  }

  useEffect(async () => {
    const [glovesData, facemasksData, beaniesData] = await Promise.all([
      fetch(CATEGORY_API_URL+"gloves"),
      fetch(CATEGORY_API_URL+"facemasks"),
      fetch(CATEGORY_API_URL+"beanies")
    ])
    const glovesjson = await glovesData.json()
    const facemasksjson = await facemasksData.json()
    const beaniesjson = await beaniesData.json()
    console.log(glovesjson)

    setGloves(JSON.stringify(glovesjson));
    setFacemasks(JSON.stringify(facemasksjson))
    setBeanies(JSON.stringify(beaniesjson))
    setShowValues("Data loaded")
  },[reload])

  const changeReload = () => {
    if (reload == false) {setReload(true)}
    else {setReload(false)}
    setShowValues("Loading data")
  }

  return (
    <div>
      <button onClick={() => changeReload()}>Reload data</button>
      <button onClick={() => showItem("gloves")}>Gloves</button>
      <button onClick={() => showItem("facemasks")}>Facemasks</button>
      <button onClick={() => showItem("beanies")}>Beanies</button>
      <p>{ showValues }</p>
    </div>
  );
}

export default App;
