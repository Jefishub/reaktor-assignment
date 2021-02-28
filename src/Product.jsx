import React from 'react';

const Product = ({id, type, name, color, price, manufacturer, availability}) => {
    var stock = "not-found"
    if (availability === "INSTOCK") {stock = "normal"}
    else if (availability === "OUTOFSTOCK") {stock = "warning"}
    else if (availability === "DATA NOT FOUND") {stock = "not-found"}
    else {stock = "low-stock"}

    return (
        <div className="product-box">
            <p><strong>ID:</strong> {id}</p>
            <p><strong>Type:</strong> {type}</p>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Colors:</strong> {color.toString()}</p>
            <p><strong>Price:</strong> {price}</p>
            <p><strong>Manufacturer:</strong> {manufacturer}</p>
            <p><strong>Availability:</strong> <span className={stock}>{availability}</span> </p>
        </div>
    )


}

export default Product;