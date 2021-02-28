import React, { useState, useEffect } from 'react'

import ProductBox from './ProductBox.jsx'

import {ABIPLOS} from './mock/manufacturers/abiplos.js'
import {HENNEX} from './mock/manufacturers/hennex.js'
import {JUURAN} from './mock/manufacturers/juuran.js'
import {LAION} from './mock/manufacturers/laion.js'
import {NIKSLEH} from './mock/manufacturers/niksleh.js'
import {OKKAU} from './mock/manufacturers/okkau.js'
import {GLOVES} from './mock/products/gloves.js'

const CORS_URL = "https://cors-anywhere.herokuapp.com/" //TO fix CORS error
const CATEGORY_API_URL = CORS_URL + "https://bad-api-assignment.reaktor.com/v2/products/gloves"
const MANUFACTURER_API_URL = CORS_URL + "https://bad-api-assignment.reaktor.com/v2/availability/" //ADD manufacturer name

const MANUDICT = {"abiplos":ABIPLOS.response,"hennex":HENNEX.response,"juuran":JUURAN.response,"laion":LAION.response,"niksleh":NIKSLEH.response,"okkau":OKKAU.response}

function Gloves() {

    /* Functionality variables */
    const [productData, setProductData] = useState('')

    //Filtering out distinct manufacturers
    function getManufacturers(product_list){
        const distinctManufacturers = [...new Set(product_list.map(x => x.manufacturer))];
        return distinctManufacturers;
    }

    async function getManufacturerData(manufacturer_list){
        var manu_json_dict = {};
        await Promise.all(manufacturer_list.map(manufacturer_name => {
            fetch(MANUFACTURER_API_URL + manufacturer_name, {headers:{"Access-Control-Allow-Origin": "http://localhost:3000/"}})
            .then(response => response.json())
            .then(responseJson => manu_json_dict[manufacturer_name] = responseJson.response)
            .catch(error => console.log(error))
        }))

        console.log(manu_json_dict)
        return manu_json_dict;
    }

    function getData() {
        var productData = "";
        var manufacturerData = "";
        fetch(CATEGORY_API_URL, {headers:{"Access-Control-Allow-Origin": "http://localhost:3000/"}})
        .then(response => response.json())
        .then(responseJson => {
            productData = responseJson;
            return getManufacturers(responseJson)})
        .then(manufacturers => manufacturerData = getManufacturerData(manufacturers))
        .then(() => setProductData(<ProductBox product_data={productData} availability_data={manufacturerData} />))
    }

    function loadData() {
        setProductData("***Loading Data***");
        getData();
    }

    return (
        <div>
            <button onClick={() => loadData()}>Get data</button>
            { productData }
        </div>
    );
}


export default Gloves;
