import React, { useState, useEffect } from 'react'

import ProductBox from './ProductBox.jsx'

const CORS_URL = "https://cors-anywhere.herokuapp.com/" //TO fix CORS error
const CATEGORY_API_URL = CORS_URL + "https://bad-api-assignment.reaktor.com/v2/products/" //ADD category name
const MANUFACTURER_API_URL = CORS_URL + "https://bad-api-assignment.reaktor.com/v2/availability/" //ADD manufacturer name

function App() {

  /* Product data */
  const [gloves, setGloves] = useState('Gloves not ready')
  const [facemasks, setFacemasks] = useState('Facemasks not ready')
  const [beanies, setBeanies] = useState('Beanies not ready')
 
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

  /* finds all distinct manufacturers from gloves, facemasks and beanies */
  const getManufacturers = (products) => {
    console.log("***products****");
    console.log(products);
    var manufacturers = [];
    products.map(
      (product) => product.map(item => manufacturers.push(item.manufacturer))
    )
    var manufacturers_list = new Set(manufacturers);
    return Array.from(manufacturers_list);
  }

  const getProductAvailabilityData = (manufacturers_list) => {
    console.log("***manufacturers_list****");
    console.log(manufacturers_list);
    var data_list = [];
    manufacturers_list.map( async (item) => {
      console.log(item)
      const data = await fetch(MANUFACTURER_API_URL + item);
      const datajson = await data.json();
      data_list.push({item:datajson});
    })
    console.log("*****data_list****")
    console.log(data_list);
    setProductAvailabilityData(data_list);
  }

  useEffect(() => {
    async function getData() {
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

    getProductAvailabilityData(
      getManufacturers([glovesjson, facemasksjson, beaniesjson])
      ); 
    }
    getData();
    setShowValues("Data loaded");
  },[reload])

  const changeReload = () => {
    if (reload === false) {setReload(true)}
    else {setReload(false)}
    setShowValues("***Loading data***")
  }

  return (
    <div>
      <button onClick={() => changeReload()}>Reload data</button>
      <button onClick={() => showItem(<ProductBox product_data={gloves} availability_data={productAvailabilityData} /> )}>Gloves</button>
      <button onClick={() => showItem(<ProductBox product_data={facemasks} availability_data={productAvailabilityData} /> )}>Facemasks</button>
      <button onClick={() => showItem(<ProductBox product_data={beanies} availability_data={productAvailabilityData} /> )}>Beanies</button>
      <p>{ showValues }</p>
    </div>
  );
}

export default App;
