import styles from './Checkout.module.css';
import { LoadingIcon } from './Icons';
import { getProducts } from './dataService';
import { useState, useEffect } from 'react';

// You are provided with an incomplete <Checkout /> component.
// You are not allowed to add any additional HTML elements.
// You are not allowed to use refs.

// Demo video - You can view how the completed functionality should look at: https://drive.google.com/file/d/1o2Rz5HBOPOEp9DlvE9FWnLJoW9KUp5-C/view?usp=sharing

// Once the <Checkout /> component is mounted, load the products using the getProducts function.
// Once all the data is successfully loaded, hide the loading icon.
// Render each product object as a <Product/> component, passing in the necessary props.
// Implement the following functionality:
//  - The add and remove buttons should adjust the ordered quantity of each product
//  - The add and remove buttons should be enabled/disabled to ensure that the ordered quantity can’t be negative and can’t exceed the available count for that product.
//  - The total shown for each product should be calculated based on the ordered quantity and the price
//  - The total in the order summary should be calculated
//  - For orders over $1000, apply a 10% discount to the order. Display the discount text only if a discount has been applied.
//  - The total should reflect any discount that has been applied
//  - All dollar amounts should be displayed to 2 decimal places

const Product = ({ id, name, availableCount, price, orderedQuantity, total, handleCart }) => {
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availableCount}</td>
      <td>${price}</td>
      <td>{orderedQuantity}</td>
      <td>${total}</td>
      <td>
        <button className={styles.actionButton} disabled={availableCount === orderedQuantity} onClick={() => handleCart('add', id)}>
          +
        </button>
        <button className={styles.actionButton} disabled={orderedQuantity <= 0 || orderedQuantity > availableCount} onClick={() => handleCart('minus', id)}>
          -
        </button>
      </td>
    </tr>
  );
};

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [discout, setDiscount] = useState(0);

  const handleCart = (op, id) => {
    const updateProduct = products.find((prod) => prod.id === id);
    if (op === 'add') {
      if (updateProduct.orderedQuantity < updateProduct.availableCount) {
        updateProduct.orderedQuantity = updateProduct.orderedQuantity + 1;
      }
    } else {
      if (updateProduct.orderedQuantity > 0) {
        updateProduct.orderedQuantity = updateProduct.orderedQuantity - 1;
      }
    }

    updateProduct.total = (updateProduct.orderedQuantity * updateProduct.price).toFixed(2);
    const filtered = products.filter((prod) => prod.id !== id);

    setProducts((old) => [...filtered, updateProduct].sort((a, b) => a.id - b.id));
  };

  useEffect(() => {
    const load = async () => {
      const response = await getProducts();
      const formatted = response.map((resp) => {
        return { ...resp, orderedQuantity: 0, total: 0 };
      });
      setProducts(formatted);
    };

    load();
  }, []);

  useEffect(() => {
    const totalPrice = products.reduce((total, num) => {
      return parseFloat(total) + parseFloat(num.total);
    }, 0);

    if (totalPrice > 1000) {
      const discounted = totalPrice * 0.1;
      setDiscount(discounted.toFixed(2));
    }
    setTotal(totalPrice.toFixed(2));
  }, [products]);

  const generatedProps = {
    handleCart,
  };

  return (
    <div>
      <header className={styles.header}>
        <h1>Electro World</h1>
      </header>
      <main>
        <LoadingIcon />
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th># Available</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              return <Product {...product} {...generatedProps} />;
            })}
          </tbody>
        </table>
        <h2>Order summary</h2>
        {total > 1000 && <p>Discount: $ {discout} </p>}
        <p>Total: $ {total}</p>
      </main>
    </div>
  );
};

export default Checkout;
