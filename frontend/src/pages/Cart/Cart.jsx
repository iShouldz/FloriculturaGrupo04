import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import CardContent from "../../components/CardContent/CardContent";
import { userActions } from "../../store/login/loginSlice";
import ButtonHome from "../../components/UI/Home/ButtonHome/ButtonHome";
import cactuLogout from "../../assets/LogoutModalImg/cactoTriste.png";
import cactuSucess from '../../assets/RegisterModalImg/cactuSucess.png'
import { deletePlant } from "../../store/plants/plantsAction";
import ModalTemplate from "../../components/ModalTemplate/ModalTemplate";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Cart = () => {
  const cart = useSelector((state) => state.login.cart);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const currentEmailStorage = localStorage.getItem("emailUser");

  const [showDialogCartPresent, setShowDialogCartPresent] = useState(false)

  console.log(cart);
  let totalCart = 0;

  cart.map((item) => {
    console.log(item);
    if (item.isInSale === "notPromo") {
      totalCart += item.price;
    } else {
      totalCart += +item.price - (+item.price * +item.discountPercentage) / 100;
    }
  });

  const closeDialogPresentCart = () => {
    setShowDialogCartPresent(false)
  }

  const handleHome = () => {
    navigate('/')
  }

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://json-server-private-shz.vercel.app/users"
      );
      const users = await response.json();

      const user = users.find((user) => user.email === currentEmailStorage);
      if (user) {
        console.log(user);
        console.log(user.cart);

        dispatch(userActions.handleReplaceCart(user.cart));
      } else {
        console.log("Failed to login, verify your credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      console.log("An error occurred during login");
    }
  };

  const handleFinish = () => {
    setShowDialogCartPresent(true)
    cart.map((item) => {
      console.log(item);
      dispatch(deletePlant(item.id));
    });

    const currentIDStorage = localStorage.getItem("currentUserID");

    if (currentIDStorage) {
      const url = `https://json-server-private-shz.vercel.app/users/${currentIDStorage}`;

      fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: [],
        }),
      })
        .then((response) => response.json())
        .then((updatedUser) => {
          console.log(
            "Conteúdo do carrinho removido com sucesso:",
            updatedUser
          );
        })
        .catch((error) => {
          console.error("Erro ao remover conteúdo do carrinho:", error);
        });
    } else {
      console.error("ID do usuário não encontrado.");
    }

    dispatch(userActions.handleClearCart());
  };

  return (
    <div className={styles.productContainer}>
      <h1 className={styles.productTitle}>Carrinho</h1>
      {cart.length === 0 ? (
        <div>
          <h1 id={styles.subtitle}>
            Carrinho vazio, vamos comprar algo?
          </h1>
          <div className={styles.imgContainer}>
            <img src={cactuLogout} id={styles.cactuSucess} />
          </div>
          <p id={styles.btnCenter}>
            <ButtonHome onClick={handleLogin}>Reload</ButtonHome>
          </p>
          <ModalTemplate
              isOpen={showDialogCartPresent}
              onClose={closeDialogPresentCart}
              titulo={"Compra realizada com sucesso!"}
              btnContent={"Close"}
              handleAction={handleHome}
              imgCenter={cactuSucess}
            />
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
                      onDelete={false}
                    />

                    <button>Remover</button>
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
                      onDelete={false}
                    />

                  </div>
                );
              }
            })}

            
          </div>

          <div id={styles.checkout}>
            <h2 id={styles.subtitle}>Check out</h2>
            <h3 id={styles.subtitle}>Total: ${totalCart.toFixed(2)}</h3>
            <ButtonHome onClick={handleFinish}>Finalizar compra</ButtonHome>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
