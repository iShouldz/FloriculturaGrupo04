import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import CardContent from "../../components/CardContent/CardContent";
import { userActions } from "../../store/login/loginSlice";
import ButtonHome from "../../components/UI/Home/ButtonHome/ButtonHome";
import cactuLogout from '../../assets/LogoutModalImg/cactoTriste.png'
const Cart = () => {
  const cart = useSelector((state) => state.login.cart);
  const dispatch = useDispatch();
  const currentEmailStorage = localStorage.getItem("emailUser");

  console.log(cart);
  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/users");
      const users = await response.json();

      const user = users.find((user) => user.email === currentEmailStorage);
      if (user) {
        console.log(user);
        console.log(user.cart);

        dispatch(userActions.handleCartAdd(user.cart));
      } else {
        console.log("Failed to login, verify your credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      console.log("An error occurred during login");
    }
  };

  return (
    <div className={styles.productContainer}>
      <h1 className={styles.productTitle}>Carrinho</h1>
      {cart.length === 0 ? (
        <div>
          <h1 id={styles.subtitle}>Ocorreu um erro, clique abaixo para corrigir</h1>
          <div className={styles.imgContainer}>
              <img src={cactuLogout} id={styles.cactuSucess} />
            </div>
          <p id={styles.btnCenter}>
            <ButtonHome onClick={handleLogin}>Reload</ButtonHome>
          </p>
        </div>
      ) : (
        <div>
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
      )}
    </div>
  );
};

export default Cart;
