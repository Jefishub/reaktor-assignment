import React from 'react';

const Product = ({id, type, name, color, price, availability}) => {
    const productAvailability = () => {
        return availability;
    }

    return (
        <div>
            <p>ID: {id}</p>
            <p>TYPE: {type}</p>
            <p>NAME: {name}</p>
            <p>COLOR: {color}</p>
            <p>PRICE: {price}</p>
            <p>AVAILABILITY: {productAvailability}</p>
        </div>
    )


}

export default Product;