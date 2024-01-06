import { useSelector } from "react-redux";
import styles from "./styles.module.css";
import CardContent from "../../components/CardContent/CardContent";

const Cart = () => {
  const cart = useSelector((state) => state.login.cart);
  console.log(cart);

  return (
    <div className={styles.productContainer}>
      <h1 className={styles.productTitle}>Carrinho</h1>
      <div className={styles.productList}>
        {cart.map((item) => {
          if (Array.isArray(item)) {
            return item.map((nestedItem) => (
              <div key={nestedItem.id} className={styles.cardContainer}>
                <CardContent
                  id={nestedItem.id}
                  name={nestedItem.name}
                  price={nestedItem.price}
                  label={nestedItem.label[1]}
                  discont={nestedItem.discountPercentage}
                  isInSale={nestedItem.isInSale}
                  img={nestedItem.img}
                  onDelete={true}
                />
              </div>
            ));
          } else {
            return (
              <div key={item.id} className={styles.cardContainer}>
                <CardContent
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  label={item.label[1]}
                  discont={item.discountPercentage}
                  isInSale={item.isInSale}
                  img={item.img}
                  onDelete={true}
                />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Cart;
