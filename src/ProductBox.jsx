import React from 'react';
import Product from './Product';

const ProductBox = ({product_data}) => {
    if (product_data !== "") {
    return (
        <div>
            <h3>Showing data for {product_data[0].type}</h3>
            <div className="product-container">
                {product_data.map((product, i) => {
                    return (
                        <Product
                        key={i}
                        id={product.id}
                        type={product.type}
                        name={product.name}
                        color={product.color}
                        price={product.price}
                        manufacturer={product.manufacturer}
                        availability={product.availability}
                        />
                    )
                })}
            </div>
        </div>
    )
        }
    else {
        return <div><p>Something went wrong</p></div>
    }

}

export default ProductBox;