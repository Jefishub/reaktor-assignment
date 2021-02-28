import React, { useState, useEffect } from 'react'

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

const CORS_URL = "https://cors-anywhere.herokuapp.com/" //TO fix CORS error
const CATEGORY_API_URL = CORS_URL + "https://bad-api-assignment.reaktor.com/v2/products/gloves"
const MANUFACTURER_API_URL = CORS_URL + "https://bad-api-assignment.reaktor.com/v2/availability/" //ADD manufacturer name

const MANUDICT = {"abiplos":ABIPLOS.response,"hennex":HENNEX.response,"juuran":JUURAN.response,"laion":LAION.response,"niksleh":NIKSLEH.response,"okkau":OKKAU.response}

function AppTest() {

    /* Product data */
    const [gloves, setGloves] = useState('') // 
    const [facemasks, setFacemasks] = useState('') // 
    const [beanies, setBeanies] = useState('') // 

    /* Manufacturer data object dict */
    const [productAvailabilityData, setProductAvailabilityData] = useState([])

    /* Functionality variables */
    const [productData, setProductData] = useState("***Loading Data***")

    //Filtering out distinct manufacturers
    function getManufacturers(product_list){
        var distinctManufacturers = []
        product_list.map((products) => distinctManufacturers = [...new Set(products.map(x => x.manufacturer))])
        console.log(distinctManufacturers)
        return distinctManufacturers;
      }

    function addAvailabilityToProduct(productData, availabilityData) {
        productData.map((item) => {
            var availability = availabilityData[item.manufacturer];
            var productAvailability = "DATA NOT FOUND";
            for (var i = 0; i < availability.length; i++) {
                if ((availability[i].id).toLowerCase() === (item.id).toLowerCase()) {
                    var regex = /(?<=<INSTOCKVALUE>)[A-Z 0-9]+/;
                    var match = availability[i].DATAPAYLOAD.match(regex);
                    if (match) {productAvailability = match[0]}
                    break
                }
            };
            item["availability"] = productAvailability;
    })}

    function getData() {
        const newGloves = GLOVES
        const newFacemasks = FACEMASKS
        const newBeanies = BEANIES
        var manus = getManufacturers([newGloves, newFacemasks, newBeanies])
        setProductAvailabilityData(MANUDICT)
        addAvailabilityToProduct(newGloves,MANUDICT)
        addAvailabilityToProduct(newFacemasks,MANUDICT)
        addAvailabilityToProduct(newBeanies,MANUDICT)
        setGloves(newGloves)
        setFacemasks(newFacemasks)
        setBeanies(newBeanies)
        setProductData("***PRODUCT DATA LOADED***");
    }

    function loadData() {
        setProductData("***Loading Data***");
        getData();
    }

    function showProduct(product) {
        setProductData(<ProductBox product_data={product} availability_data={productAvailabilityData} />)
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


export default AppTest;
