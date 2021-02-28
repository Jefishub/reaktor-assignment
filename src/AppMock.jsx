import React, { useState, useEffect } from 'react'
import {Promise} from "bluebird";

import ProductBox from './ProductBox.jsx'

import {ABIPLOS} from './mock/manufacturers/abiplos.js'
import {HENNEX} from './mock/manufacturers/hennex.js'
import {JUURAN} from './mock/manufacturers/juuran.js'
import {LAION} from './mock/manufacturers/laion.js'
import {NIKSLEH} from './mock/manufacturers/niksleh.js'
import {OKKAU} from './mock/manufacturers/okkau.js'
import {UMPANTE} from './mock/manufacturers/umpante.js'
import {IPPAL} from './mock/manufacturers/ippal.js'
import {GLOVES} from './mock/products/gloves.js'
import {FACEMASKS} from './mock/products/facemasks.js'
import {BEANIES} from './mock/products/beanies.js'

import "./styles.css"

const CORS_URL = "https://cors-anywhere.herokuapp.com/" //TO fix CORS error
const CATEGORY_API_URL = CORS_URL + "https://bad-api-assignment.reaktor.com/v2/products/"
const MANUFACTURER_API_URL = CORS_URL + "https://bad-api-assignment.reaktor.com/v2/availability/" //ADD manufacturer name

const MANUDICT = {"abiplos":ABIPLOS.response,"ippal":IPPAL.response,"juuran":JUURAN.response,"umpante":UMPANTE.response,"niksleh":NIKSLEH.response,"okkau":OKKAU.response}

function AppMock() {

  /* Product data */
  const [gloves, setGloves] = useState('Not available yet') // 
  const [facemasks, setFacemasks] = useState('Not available yet') // 
  const [beanies, setBeanies] = useState('Not available yet') // 

  /* Functionality variables */
  const [pageState, setPageState] = useState(<div><h1>***LOADING DATA****</h1></div>)

  //Filtering out distinct manufacturers
  function getManufacturers(product_list){
    var distinctManufacturers = []
    product_list.map((products) => distinctManufacturers = [...new Set(products.map(x => x.manufacturer))])
    console.log(distinctManufacturers)
    return distinctManufacturers;
  }

  function addAvailabilityToProduct(productData, availabilityData) {
    productData.forEach((item) => {
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
    })
  }

  async function getManufacturerData(manufacturer_list) {
    const manus = [JUURAN, IPPAL, NIKSLEH, OKKAU, UMPANTE, ABIPLOS];
    return await Promise.map(manus, function(manu) { return manu.response})
    .then((results) => {
      var manudict = {};
      for (var i=0;i<results.length;i++) {manudict[manufacturer_list[i]] = results[i]};
      return manudict;
    })
  }

  function getData() {
    Promise.all([GLOVES,FACEMASKS,BEANIES])
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
      productJson.forEach(product => addAvailabilityToProduct(product,manuData));
      setGloves(<ProductBox product_data={productJson[0]}/>);
      setFacemasks(<ProductBox product_data={productJson[1]}/>);
      setBeanies(<ProductBox product_data={productJson[2]}/>);
      setPageState(<div><h3>***PRODUCT DATA LOADED***</h3></div>);
    })
  }

  function loadData() {
    setPageState("***Loading Data***");
      getData();
  }

  function mainPage() {
    setPageState(<div className="load-button"><button onClick={() => loadData()}>Reload data</button></div>)
  }


  return (
    <div>
      <div className="topnav">
        <a onClick={() => mainPage()}>Main page</a>
        <a onClick={() => setPageState(gloves)}>GLOVES</a>
        <a onClick={() => setPageState(facemasks)}>FACEMASKS</a>
        <a onClick={() => setPageState(beanies)}>BEANIES</a>
      </div>
      <div className="main-page">          
        { pageState }
      </div>
    </div>
  );
}


export default AppMock;
