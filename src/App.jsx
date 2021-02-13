import React, { useState, useEffect } from 'react'

import ProductBox from './ProductBox.jsx'

const CORS_URL = "https://cors-anywhere.herokuapp.com/" //TO fix CORS error
const CATEGORY_API_URL = CORS_URL + "https://bad-api-assignment.reaktor.com/v2/products/" //ADD category name
const MANUFACTURER_API_URL = "https://bad-api-assignment.reaktor.com/v2/availability/" //ADD manufacturer name

function App() {

  /* Product data */
  const [gloves, setGloves] = useState('Gloves not ready')
  const [facemasks, setFacemasks] = useState('Facemasks not ready')
  const [beanies, setBeanies] = useState('Beanies not ready')

  /* Manufacturers per product */
  const [manufacturersList, setManufacturersList] = useState([]);
 
  /* Manufacturer data object dict */
  const [productAvailabilityData, setProductAvailabilityData] = useState([])

  /* Functionality variables */
  const [reload, setReload] = useState(false)
  const [showValues, setShowValues] = useState('***Loading data***')
  
  const showItem = (item) => {
    if (item === "gloves") { setShowValues(JSON.stringify(gloves))}
    else if (item === "facemasks") { setShowValues(JSON.stringify(facemasks))}
    else if (item === "beanies") {setShowValues(JSON.stringify(beanies))}
  }

  const getManufacturers = () => {
    var manufacturers = [];
    gloves.map(item => manufacturers.push(item.manufacturer));
    facemasks.map(item => manufacturers.push(item.manufacturer));
    beanies.map(item => manufacturers.push(item.manufacturer));
    var manufacturers_list = new Set(manufacturers);
    setManufacturersList(manufacturers_list);
  }

  const getProductAvailabilityData = () => {
    var data_list = [];
    manufacturersList.map( async (item) => {
      const data = await fetch(MANUFACTURER_API_URL + item);
      data_list.push({item:data});
    })
    setProductAvailabilityData(data_list);
  }

  useEffect(async () => {
    const [glovesData, facemasksData, beaniesData] = await Promise.all([
      fetch(CATEGORY_API_URL + "gloves"),
      fetch(CATEGORY_API_URL + "facemasks"),
      fetch(CATEGORY_API_URL + "beanies")
    ])

    const glovesjson = await glovesData.json();
    const facemasksjson = await facemasksData.json();
    const beaniesjson = await beaniesData.json();

    setGloves(glovesjson);
    setFacemasks(facemasksjson);
    setBeanies(beaniesjson);
    setShowValues("Data loaded");
    await getManufacturers();
    await getProductAvailabilityData();
  },[reload])

  const changeReload = () => {
    if (reload === false) {setReload(true)}
    else {setReload(false)}
    setShowValues("***Loading data***")
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
