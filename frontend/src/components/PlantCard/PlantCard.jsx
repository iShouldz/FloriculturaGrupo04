/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { deletePlant } from "../../store/plants/plantsAction";
import { NavLink } from "react-router-dom";

const PlantCard = ({ listagemTotal = false, filter }) => {
  const plants = useSelector((state) => state.plants.plants);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deletePlant(id));
  };

  return (
    <>
      {!listagemTotal
        ? plants
            .filter((plant) => plant.isInSale === filter)
            .map((plant) => {
              return (
                <div key={plant.id} className="card">
                  <div className="card-content">
                    {plant.name}
                    {plant.description}
                    {plant.isInSale}
                    <button
                      type="button"
                      onClick={() => handleDelete(plant.id)}
                    >
                      Deletar
                    </button>

                    <NavLink to={"/products"}>Products</NavLink>
                  </div>
                </div>
              );
            })
        : plants.map((plant) => {
            return (
              <div key={plant.id} className="card">
                <div className="card-content">
                  <li>{plant.name}</li>
                  <button type="button" onClick={() => handleDelete(plant.id)}>
                    Deletar
                  </button>

                  <NavLink to={"/products"}>Products</NavLink>
                </div>
              </div>
            );
          })}
    </>
  );
};

export default PlantCard;