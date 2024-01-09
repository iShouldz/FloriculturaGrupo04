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

const ModalTemplate = ({ isOpen, onClose, titulo, btnContent,subtitulo= '', handleAction, imgCenter }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const login = useSelector((state) => state.login.isLogado);
  const currentLoginStorage = localStorage.getItem("isLogado");
  const currentEmailStorage = localStorage.getItem("emailUser");
  const cart = useSelector((state) => state.login.cart);

  const handleLogInOut = () => {
    dispatch(userActions.handleUpdateLogin());
    localStorage.setItem("isLogado", false);
    dispatch(userActions.handleClearCart());
    onClose();
    navigate(`/`);
  };

  return (
    <dialog className={isOpen ? styles.modalContainer : styles.modalOff}>
      <section className={styles.modal}>
        <div>
          <div id={styles.btnClose}>
            <button onClick={onClose}>
              <img src={close} id={styles.img} />
            </button>
          </div>

          <p className={styles.title}>{titulo}</p>
          <p className={styles.subtitle}>{subtitulo}</p>

          <div className={styles.imgContainer}>
            <img src={imgCenter} id={styles.cactuSucess} />
          </div>

          <ButtonHome onClick={handleAction}>{btnContent}</ButtonHome>
          <hr></hr>
        </div>
      </section>
    </dialog>
  );
};
export default ModalTemplate;
