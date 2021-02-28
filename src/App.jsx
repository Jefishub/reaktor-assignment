import React, { useState, useEffect } from 'react'
import {Promise} from "bluebird";

import ProductBox from './ProductBox.jsx'

import "./styles.css"

const CORS_URL = "https://cors-anywhere.herokuapp.com/" //TO fix CORS error
const CATEGORY_API_URL = CORS_URL + "https://bad-api-assignment.reaktor.com/v2/products/"
const MANUFACTURER_API_URL = CORS_URL + "https://bad-api-assignment.reaktor.com/v2/availability/" //ADD manufacturer name

/* PROXY URLS */
/* const BASE_URL = "http://localhost:5000/api" 
const CATEGORY_API_URL = BASE_URL + "/products/" //ADD product name
const MANUFACTURER_API_URL = BASE_URL + "/availability/" //ADD manufacturer name */

function App() {

  /* Product data */
  const [gloves, setGloves] = useState(<div><h3>**Gloves data not loaded**</h3></div>) // 
  const [facemasks, setFacemasks] = useState(<div><h3>**Facemasks data not loaded**</h3></div>) // 
  const [beanies, setBeanies] = useState(<div><h3>**Beanies data not loaded**</h3></div>) // 

  /* Functionality variables */
  const [pageState, setPageState] = useState(
    <div>
      <div className="load-button">
        <button onClick={() => loadData()}>
          <h1>Load data</h1>
        </button>
        <p>Please request access to cors proxy when starting to try the application</p>
        <a href="http://cors-anywhere.herokuapp.com/corsdemo" target="_blank">Cors Proxy Request</a>
      </div>
    </div>)

  //Filtering out distinct manufacturers
  function getManufacturers(product_list){
    var distinctManufacturers = []
    product_list.map((products) => distinctManufacturers = [...new Set(products.map(x => x.manufacturer))])
    console.log(distinctManufacturers)
    return distinctManufacturers;
  }

  // Adding availability information into product data
  async function addAvailabilityToProduct(productData, availabilityData) {
    console.log("*****ADD AVAILABILITY*******")
    console.log(productData)
    console.log(availabilityData)
    productData.forEach((item) => {
      if (availabilityData[item.manufacturer] === "[]") {
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

  //Fetching manufacturer data and returning a dictionary {manufacturer1:availabilitydata,manufacturer2:availabilitydata...}
  async function getManufacturerData(manufacturer_list) {
    return await Promise.map(manufacturer_list, async (item) => {
      return await fetch(MANUFACTURER_API_URL + item, {headers:{"Access-Control-Allow-Origin": "http://localhost:3000/"}})
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
      fetch(CATEGORY_API_URL + "gloves", {headers:{"Access-Control-Allow-Origin": "http://localhost:3000/"}}),
      fetch(CATEGORY_API_URL + "facemasks", {headers:{"Access-Control-Allow-Origin": "http://localhost:3000/"}}),
      fetch(CATEGORY_API_URL + "beanies", {headers:{"Access-Control-Allow-Origin": "http://localhost:3000/"}})]
    )
    .then((responses) => Promise.all(responses.map(response => response.json())))
    .then((productsJson) => {
      console.log("1")
      console.log(productsJson);
      const manufacturers = getManufacturers(productsJson);
      return Promise.all([manufacturers,productsJson])
    })
    .then(async ([manufacturers,productJson]) => {
      console.log("2")
      console.log(manufacturers)
      const manuData = getManufacturerData(manufacturers);
      return Promise.all([manuData, productJson])
    })
    .then(([manuData, productJson]) => {
      console.log("3")
      console.log(manuData)
      console.log(productJson)
      productJson.forEach(product => addAvailabilityToProduct(product,manuData));
      setGloves(<ProductBox product_data={productJson[0]}/>);
      setFacemasks(<ProductBox product_data={productJson[1]}/>);
      setBeanies(<ProductBox product_data={productJson[2]}/>);
      setPageState(<div><h3>*** PRODUCT DATA LOADED ***</h3></div>);
    })
    .catch(error => {
      setPageState(<div><h3>*** There was an error when loading data ***</h3></div>);
      console.log(error);})
  }

  function loadData() {
    setPageState(<div><h1>***Loading Data***</h1></div>);
      getData();
  }

  function mainPage() {
    setPageState(<div className="load-button"><button onClick={() => loadData()}><h1>Reload data</h1></button></div>)
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
        <div className="page-state">         
          { pageState }
        </div>
      </div>
    </div>
  );
}


export default App;
