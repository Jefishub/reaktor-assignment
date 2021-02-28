import React, { useState, useEffect } from 'react'
import {Promise} from "bluebird";

import ProductBox from './ProductBox.jsx'

import {ABIPLOS} from './mock/manufacturers/abiplos.js'
import {HENNEX} from './mock/manufacturers/hennex.js'
import {JUURAN} from './mock/manufacturers/juuran.js'
import {LAION} from './mock/manufacturers/laion.js'
import {NIKSLEH} from './mock/manufacturers/niksleh.js'
import {OKKAU} from './mock/manufacturers/okkau.js'
import {GLOVES} from './mock/products/gloves.js'
import {FACEMASKS} from './mock/products/facemasks.js'
import {BEANIES} from './mock/products/beanies.js'

import "./styles.css"

/* const CORS_URL = "https://cors-anywhere.herokuapp.com/" //TO fix CORS error
const CATEGORY_API_URL = CORS_URL + "https://bad-api-assignment.reaktor.com/v2/products/"
const MANUFACTURER_API_URL = CORS_URL + "https://bad-api-assignment.reaktor.com/v2/availability/" //ADD manufacturer name */

const BASE_URL = "http://localhost:5000/api" //TO fix CORS error
const CATEGORY_API_URL = BASE_URL + "/products/"
const MANUFACTURER_API_URL = BASE_URL + "/availability/" //ADD manufacturer name

const MANUDICT = {"abiplos":ABIPLOS.response,"hennex":HENNEX.response,"juuran":JUURAN.response,"laion":LAION.response,"niksleh":NIKSLEH.response,"okkau":OKKAU.response}

function App() {

  /* Product data */
  const [gloves, setGloves] = useState('') // 
  const [facemasks, setFacemasks] = useState('') // 
  const [beanies, setBeanies] = useState('') // 

  /* Functionality variables */
  const [productData, setProductData] = useState('')

  //Filtering out distinct manufacturers
  function getManufacturers(product_list){
    var distinctManufacturers = []
    product_list.map((products) => distinctManufacturers = [...new Set(products.map(x => x.manufacturer))])
    console.log(distinctManufacturers)
    return distinctManufacturers;
  }

  async function addAvailabilityToProduct(productData, availabilityData) {
    console.log("*****ADD AVAILABILITY*******")
    console.log(productData)
    console.log(availabilityData)
    productData.forEach((item) => {
      if (availabilityData[item.manufacturer] === []) {
        item["availability"] = "DATA NOT FOUND";
      }
      else {
        var availability = availabilityData[item.manufacturer];
        var productAvailability = "DATA NOT FOUND";
        for (var i = 0; i < availability.length; i++) {
          if ((availability[i].id).toLowerCase() === (item.id).toLowerCase()) {
            var regex = /(?<=<INSTOCKVALUE>)[A-Z 0-9]+/;
            var match = availability[i].DATAPAYLOAD.match(regex);
            if (match) {productAvailability = match[0]};
          }
        };
        item["availability"] = productAvailability;
      }
    })
  }

  async function getManufacturerData(manufacturer_list) {
    return await Promise.map(manufacturer_list, async (item) => {
      return await fetch(MANUFACTURER_API_URL + item)
      .then(response => response.json())
      .then(responseJson => responseJson.response)
    })
    .then((results) => {
      var manudict = {};
      for (var i=0;i<results.length;i++) {manudict[manufacturer_list[i]] = results[i]};
      return manudict;
    })
  }
  /* , {headers:{"Access-Control-Allow-Origin": "http://localhost:3000/"}} */
  function getData() {
    Promise.all([
      fetch(CATEGORY_API_URL + "gloves"),
      fetch(CATEGORY_API_URL + "facemasks"),
      fetch(CATEGORY_API_URL + "beanies")]
    )
    .then(async (responses) => await Promise.all(responses.map(response => response.json())))
    .then((productsJson) => {
      console.log("1")
      console.log(productsJson);
      const manufacturers = getManufacturers(productsJson);
      return Promise.all([manufacturers,productsJson])
    })
    .then(async ([manufacturers,productJson]) => {
      console.log("2")
      console.log(manufacturers)
      const manuData = await getManufacturerData(manufacturers);
      return await Promise.all([manuData, productJson])
    })
    .then(([manuData, productJson]) => {
      console.log("3")
      console.log(manuData)
      console.log(productJson)
      productJson.forEach(async product => await addAvailabilityToProduct(product,manuData));
      setGloves(productJson[0]);
      setFacemasks(productJson[1]);
      setBeanies(productJson[2]);
      setProductData("***PRODUCT DATA LOADED***");
    })
    .catch(error => console.log(error))
  }

  function loadData() {
      setProductData("***Loading Data***");
      getData();
  }

  function showProduct(product) {
      setProductData(<ProductBox product_data={product}/>)
  }

  useEffect(() => loadData()
  ,[])

  return (
      <div>
          <button onClick={() => loadData()}>Get data</button>
          <button onClick={() => showProduct(gloves)}>GLOVES</button>
          <button onClick={() => showProduct(facemasks)}>FACEMASKS</button>
          <button onClick={() => showProduct(beanies)}>BEANIES</button>
          { productData }
      </div>
  );
}


export default App;
