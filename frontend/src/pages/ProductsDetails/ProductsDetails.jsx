/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { plantsActions } from "../../store/plants/plantsSlice";
import styles from "./styles.module.css";
import ButtonHome from "../../components/UI/Home/ButtonHome/ButtonHome";
import { useEffect, useState } from "react";
import SplitFeature from "../../components/SplitFeature/SplitFeature";
import PriceFormated from "../../components/PriceFormated/PriceFormated";
import UpdateModal from "../../components/UpdateModal/UpdateModal";
import { userActions } from "../../store/login/loginSlice";
import CarrinhoAddModal from "../../components/CarrinhoAddModal/CarrinhoAddModal";

const ProductsDetails = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showDialogCart, setShowDialogCart] = useState(false);

  const plantSelected = useSelector((state) => state.plants.plantSelected);
  const dispatch = useDispatch();
  const { id } = useParams();
  const plantId = parseInt(id);

  const currentLoginStorage = localStorage.getItem("isLogado");
  const currentIDStorage = localStorage.getItem("currentUserID");

  const cart = useSelector((state) => state.login.cart);

  useEffect(() => {
    dispatch(plantsActions.handleGetPlantDetails(plantId));
    setIsFetching(false);
  }, [dispatch, plantId]);

  let { price, isInSale, discountPercentage } = plantSelected;

  const handleSearch = () => {
    fetch(`http://localhost:3000/users/${currentIDStorage}`)
    .then((response) => response.json())
    .then((user) => {
      console.log(plantSelected)
      console.log(user)
      const updatedCart = user.cart.map((item) => {
        // Se o item já existe, substitua-o no array
        if (item.id === plantSelected.id) {
          return plantSelected;
        }
        return item;
      });

      user.cart = updatedCart;
      dispatch(userActions.handleCartAdd(plantSelected));
      return fetch(`http://localhost:3000/users/${currentIDStorage}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
    })
    .then((response) => response.json())
    .then((updatedUser) => {
      console.log("Objeto adicionado ao carrinho com sucesso:", updatedUser);
    })
    .catch((error) => {
      console.error("Erro ao adicionar objeto ao carrinho:", error);
    });
    setShowDialogCart(true)
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  const closeDialogCart = () => {
    setShowDialogCart(false);
  };

  return (
    <>
      {!isFetching && (
        <div className={styles.plantsDetails}>
          <div className={styles.imgContainer}>
            <img src={plantSelected.img} alt="Uma planta" id={styles.img} />
          </div>

          <div className={styles.plantContent}>
            <p id={styles.name}>{plantSelected.name}</p>
            <p id={styles.subtitle}>{plantSelected.subtitle}</p>

            <div className={styles.labelContainer}>
              {plantSelected.label.map((label) => {
                return (
                  <p key={label} id={styles.label}>
                    {label}
                  </p>
                );
              })}
            </div>

            {currentLoginStorage === "true" && (
              <p style={{ display: "flex" }}>
                <p id={styles.subtitle}>
                  Created by {plantSelected.createdBy}{" "}
                </p>
                <ButtonHome
                  onClick={() => {
                    setShowDialog(true);
                  }}
                >
                  Update Plant
                </ButtonHome>
              </p>
            )}

            <PriceFormated
              price={price}
              isInSale={isInSale}
              discont={discountPercentage}
              styles={styles}
            />

            <ButtonHome onClick={handleSearch}>Check out</ButtonHome>

            <CarrinhoAddModal
              isOpen={showDialogCart}
              onClose={closeDialogCart}
            />

            <UpdateModal
              isOpen={showDialog}
              onClose={closeDialog}
              lastID={id}
              img={plantSelected.img}
              created={plantSelected.createdBy}
              defaultPlant={plantSelected}
            />

            <p id={styles.price}>Features</p>

            <SplitFeature plantSelected={plantSelected} styles={styles} />

            <p id={styles.price}>Description</p>
            <div className={styles.description}>
              <p id={styles.description}>{plantSelected.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsDetails;
