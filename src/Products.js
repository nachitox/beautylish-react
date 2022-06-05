import { useState, useEffect } from 'react';
import Product from './Product';

function Products() {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [products, setProducts] = useState(null)

  const getAvgPrice = (products) => {
    return products.length ? (products.map(product => getNumericPrice(product.price)).reduce((acc, price) => acc + price, 0) / products.length).toFixed(2) : 0;
  }

  const getBrands = (products) => {
    return [...new Set(products.map(product => product.brand_name))];
  }

  const getNumericPrice = (price) => {
    return parseFloat(price.replace(/[^0-9.-]+/g,""));
  }

  const Filter = (products) => {
    return products.filter((product, index, self) => {
      return !product.hidden && !product.deleted && index === self.findIndex((t) => t.id === product.id)
    })
  };

  const Sort = (a, b) => {
    const aprice = getNumericPrice(a.price);
    const bprice = getNumericPrice(b.price);
    
    if (aprice === bprice) {
      return a.product_name > b.product_name ? 1 : -1;
    }

    return aprice > bprice ? 1 : -1;
  };

  useEffect(() => {
    fetch("https://www.beautylish.com/rest/interview-product/list")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true)
          setProducts(result.products)
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true)
          setError(error)
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  else if (!isLoaded) {
    return <div>Loading...</div>;
  }
  else {
    const filtered = Filter(products);
    const sorted = [...filtered].sort(Sort);

    return (
      <div>
        <ul>
          {sorted.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </ul>

        <ul>
          <li>
            Unique products: {sorted.length}
          </li>
          <li>
            Unique brands: {getBrands(sorted).length}
          </li>
          <li>
            Average price: ${getAvgPrice(sorted)}
          </li>
        </ul>
      </div>
    );
  }
}

export default Products; // Don’t forget to use export default!