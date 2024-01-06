/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import close from "../../assets/LogoutModalImg/close.svg";
import cactuLogout from "../../assets/LogoutModalImg/cactoTriste.png";
import ButtonHome from "../UI/Home/ButtonHome/ButtonHome";
import CardContent from "../CardContent/CardContent";
import styles from "./styles.module.css";

import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../store/login/loginSlice";
import { useNavigate } from "react-router-dom";
import Login from "../../pages/Login/Login";

const CarrinhoAddModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const login = useSelector((state) => state.login.isLogado);
  const currentLoginStorage = localStorage.getItem("isLogado");
  const currentEmailStorage = localStorage.getItem("emailUser");
  const cart = useSelector((state) => state.login.cart);

  const handleLogInOut = () => {
    onClose();
    navigate(`/cart`);
  };

  return (
    <dialog className={isOpen ? styles.modalContainer : styles.modalOff}>
      <section className={styles.modal}>
        <p className={styles.title}>Plant add to cart</p>
        {currentLoginStorage === "true" ? (
          <div>
            <div id={styles.btnClose}>
              <button onClick={onClose}>
                <img src={close} id={styles.img} />
              </button>
            </div>

            {/* <div>
              {cart.map((item) => (
                <li key={item.id}>{item.id} - {item.price}</li>
              ))}
            </div> */}

            <ButtonHome onClick={handleLogInOut}>
              Visualizar carrinho
            </ButtonHome>
            <hr></hr>
          </div>
        ) : (
          <div>
            <div id={styles.btnClose}>
              <button onClick={onClose}>
                <img src={close} id={styles.img} />
              </button>
            </div>

            <Login onClose={onClose} />
          </div>
        )}
      </section>
    </dialog>
  );
};
export default CarrinhoAddModal;
