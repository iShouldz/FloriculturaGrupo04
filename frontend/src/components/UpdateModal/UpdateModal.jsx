/* eslint-disable react/prop-types */
import styles from "./styles.module.css";

import close from "../../assets/RegisterModalImg/close.svg";
import ButtonHome from "../UI/Home/ButtonHome/ButtonHome";
import * as yup from "yup";
import ErrosForm from "../../components/ErrosForm/ErrosForm";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup
  .object({
    name: yup
      .string()
      .required("Name it is a mandatory field")
      .min(5, "Name must have at least 5 characters")
      .matches(/^[^\d]+$/, "Name must not contain numbers"),
    subtitle: yup
      .string()
      .required("Subtitle it is a mandatory field")
      .min(5, "Subtitle must have at least 5 characters"),
    price: yup
      .number()
      .positive()
      .required("Price it is a mandatory field")
      .typeError("Enter a valid number")
      .min(1),
    description: yup
      .string()
      .required("Description it is a mandatory field")
      .min(5)
      .max(500),
    discountPercentage: yup
      .number()
      .positive("Discount value must be a positive number")
      .transform((originalValue, originalObject) => {
        if (
          originalValue === "" ||
          originalValue === undefined ||
          isNaN(originalValue)
        ) {
          return 0.1;
        }
        console.log(
          `originalValue ${originalValue} originalObject ${originalObject}`
        );
        console.log(isNaN(originalValue));
        const parsedValue = parseFloat(originalValue);
        return !isNaN(parsedValue) && parsedValue >= 0
          ? parsedValue
          : parseFloat(originalObject);
      }, "Invalid value")
      .max(99, "Discount value must be less than or equal to 99")
      .default(0.1),
    labelDoor: yup.string().required(),
    features: yup
      .string()
      .required("Features it is a mandatory field")
      .min(5, "Features must have at least 5 characters")
      .max(200),
    plantType: yup
      .string()
      .required("Plant Type it is a mandatory field")
      .min(5, "Plant Type must have at least 5 characters")
      .matches(/^[^\d]+$/, "Plant Type must not contain numbers"),
  })
  .required();

const UpdateModal = ({ isOpen, onClose, lastID, img, created }) => {
  const [label, setLabel] = useState("indoor");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const updatePlant = async (plantId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:3000/plants/${plantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
  
      if (response.ok) {
        console.log("Planta atualizada com sucesso!");
        window.location.reload();
      } else {
        console.error("Erro ao atualizar planta:", response.statusText);
      }
    } catch (error) {
      console.error("Erro durante a atualização:", error);
    }
  };

  const handleSubmitForm = (data) => {
    let isInSale;

    console.log(data);
    const {
      description,
      discountPercentage,
      features,
      labelDoor,
      name,
      plantType,
      price,
      subtitle,
    } = data;

    if (discountPercentage > 0.1) {
      isInSale = "promo";
    } else {
      isInSale = "notPromo";
    }

    const plantsObject = {
        name: name,
        subtitle: subtitle,
        label: [plantType, labelDoor],
        isInSale,
        price: price,
        discountPercentage: discountPercentage,
        features: features,
        description: description,
        img: img,
        createdBy: created
      };
  
    updatePlant(lastID, plantsObject)
  };

  return (
    <dialog className={isOpen ? styles.modalContainer : styles.modalOff}>
      <section className={styles.modal}>
        <div id={styles.btnClose}>
          <button onClick={onClose}>
            <img src={close} id={styles.img} />
          </button>
        </div>

        <section className={styles.registerContainer}>
          <form
            onSubmit={handleSubmit(handleSubmitForm)}
            className={styles.formContainer}
          >
            <h2 className={styles.registerTitle}>Plant Update</h2>

            <div className={styles.plantsNamesControl}>
              <p className={styles.inputContainer}>
                <label className={styles.inputLabel}>Plant Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Echinocereus Cactus"
                  className={styles.inputForm}
                  {...register("name")}
                />

                <ErrosForm errors={errors?.name?.message} />
              </p>

              <p className={styles.inputContainer}>
                <label className={styles.inputLabel}>Plant Subtitle</label>
                <input
                  id="subtitle"
                  type="text"
                  placeholder="A majestic addition to your plant collection"
                  className={styles.inputForm}
                  {...register("subtitle")}
                />

                <ErrosForm errors={errors?.subtitle?.message} />
              </p>
            </div>

            <p className={styles.inputContainer}>
              <label className={styles.inputLabel}>Plant Type</label>
              <input
                id="type"
                type="text"
                placeholder="Cactus"
                className={styles.inputForm}
                {...register("plantType")}
              />

              <ErrosForm errors={errors?.plantType?.message} />
            </p>

            {/* <label className={styles.inputLabel}>Discount percentage</label> */}

            <div className={styles.halfInputsContainer}>
              <p>
                <label className={styles.inputLabel}>Price</label>
                <input
                  id="price"
                  type="number"
                  placeholder="$139.99"
                  className={`${styles.inputForm} ${styles.halfInput}`}
                  step="0.01"
                  {...register("price")}
                />
                <p id={styles.heightError}>
                  <ErrosForm errors={errors?.price?.message} />
                </p>
              </p>

              <p className={styles.halfInputsWrapper}>
                <label className={styles.inputLabel}>Discont Percentage</label>

                <input
                  id="discountPercentage"
                  type="number"
                  placeholder="20%"
                  step="0.01"
                  className={`${styles.inputForm} ${styles.halfInput}`}
                  {...register("discountPercentage")}
                />
                <p id={styles.heightError}>
                  <ErrosForm errors={errors?.discountPercentage?.message} />
                </p>
              </p>
            </div>

            <div>
              <h3 className={styles.labelRadios}>Label:</h3>
              <div className={styles.inputRadioControl}>
                <p className={styles.inputRadioContainer}>
                  <input
                    id="indoor"
                    type="radio"
                    value="indoor"
                    {...register("labelDoor", { required: true })}
                    className={styles.inputRadio}
                    checked={label === "indoor"}
                    onChange={() => setLabel("indoor")}
                  />
                  <label
                    className={`${styles.inputRadioLabel} ${
                      label ? styles.checkedLabel : ""
                    }`}
                  >
                    indoor
                  </label>
                </p>
                <p className={styles.inputRadioContainer}>
                  <input
                    id="outdoor"
                    type="radio"
                    {...register("labelDoor", { required: true })}
                    checked={label === "outdoor"}
                    value="outdoor"
                    className={styles.inputRadio}
                    onChange={() => setLabel("outdoor")}
                  />
                  <label
                    className={`${styles.inputRadioLabel} ${
                      label ? styles.checkedLabel : ""
                    }`}
                  >
                    outdoor
                  </label>

                  <ErrosForm errors={errors?.labelDoor?.message} />
                </p>
              </div>
            </div>

            <div className={styles.textareaControl}>
              <p className={styles.inputContainer}>
                <label className={styles.inputLabel}>Features</label>
                <textarea
                  id="feature"
                  {...register("features")}
                  placeholder="Species: Echinocereus..."
                  className={styles.inputTextarea}
                />
                <ErrosForm errors={errors?.features?.message} />
              </p>

              <p className={styles.inputContainer}>
                <label className={styles.inputLabel}>Description</label>
                <textarea
                  id="description"
                  {...register("description")}
                  placeholder="Ladyfinger cactus..."
                  className={styles.inputTextarea}
                />
                <ErrosForm errors={errors?.description?.message} />
              </p>
            </div>
            <ButtonHome type="submit">Update</ButtonHome>
          </form>
        </section>
      </section>
    </dialog>
  );
};

export default UpdateModal;
