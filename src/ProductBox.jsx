import React from 'react';
import Product from './Product';

const ProductBox = ({product_data, availability_data}) => {

    return (
        <div>
            {product_data.map((product, i) => {
                const availability = availability_data[product];
                return (
                    <Product
                    key={i}
                    id={product.id}
                    type={product.type}
                    name={product.name}
                    color={product.color}
                    price={product.price}
                    manufacturer={product.manufacturer}
                    availability={availability}
                    />
                )
            })}
        </div>
    )

}

export default ProductBox;