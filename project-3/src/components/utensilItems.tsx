import React, { useState, useEffect } from "react";
import "./Inventory.css";
import { defaultButton } from "../app/styles";

/**
 * Represents the props for the UtensilItems component.
 * @typedef {Object} UtensilItemsProps
 * @property {boolean} trigger - A boolean value to trigger the display of the UtensilItems component.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setButtonUtensilItems - Function to update the state controlling the visibility of the UtensilItems component.
 * @property {React.ReactNode} [children] - Optional children elements to be rendered inside the UtensilItems component.
 */
interface UtensilItemsProps {
  trigger: boolean;
  setButtonUtensilItems: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}

/**
 * Component that displays utensil items with editability.
 * @param {UtensilItemsProps} props - The props for the UtensilItems component.
 * @returns {React.ReactNode} A table connected to the database with editability.
 * @author Ethan Wenthe & Ryan
 */
function UtensilItems(props: UtensilItemsProps) {
  /**
   * State variables for utensil items data, editing index, new item, and refresh state.
   */
  const [data, setData] = useState<
    {
      utensilid: number;
      producttype: string;
      name_id: string;
      quantity: number;
    }[]
  >([]);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [newItem, setNewItem] = useState({
    utensilid: "",
    producttype: "",
    name_id: "",
    quantity: 0,
  });
  const [refresh, setRefresh] = useState(false);

  /**
   * Function to handle closing the UtensilItems component.
   */
  const handleClose = () => {
    props.setButtonUtensilItems(false);
  };

  /**
   * Function to handle changes in the new item.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  /**
   * State variable for the edited utensil.
   */
  const [editedUtensil, setEditedUtensil] = useState<{
    utensilid: number;
    producttype: string;
    name_id: string;
    quantity: number;
  }>({
    utensilid: 0,
    producttype: "",
    name_id: "",
    quantity: 0,
  });
  /**
   * Function to handle editing a utensil item.
   * @param {number} index - The index of the item being edited.
   * @param {{ utensilid: number; producttype: string; name_id: string; quantity: number }} utensil - The utensil item data.
   */
  const handleEditUtensil = (
    index: number,
    utensil: {
      utensilid: number;
      producttype: string;
      name_id: string;
      quantity: number;
    }
  ) => {
    setEditingIndex(index);
    setEditedUtensil(utensil);
  };

  /**
   * Function to handle saving edited utensil item.
   */
  const handleSaveEdit = async () => {
    try {
      const editedUtensilWithId = {
        ...editedUtensil,
        name_id: editedUtensil.producttype + "_01",
      };

      const response = await fetch(
        `${process.env.URL}/api/utensil/${editedUtensil.utensilid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedUtensilWithId),
        }
      );

      if (response.ok) {
        setRefresh((prevRefresh) => !prevRefresh);
        alert("Utensil updated successfully!");
        setEditingIndex(-1);
        setEditedUtensil({
          utensilid: 0,
          producttype: "",
          name_id: "",
          quantity: 0,
        });
      } else {
        console.error("Failed to update utensil:", response.status);
        alert("Failed to update utensil. Please try again later.");
      }
    } catch (error) {
      console.error("Error updating utensil:", error);
      alert("Error updating utensil. Please try again later.");
    }
  };
  /**
   * Function to handle deleting a utensil item.
   * @param {number} id - The ID of the utensil item to delete.
   */
  const handleDelete = (id: number) => {
    fetch(`${process.env.URL}/api/utensil/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(id);
        if (response.ok) {
          setRefresh((prevRefresh) => !prevRefresh);
        } else {
          console.error("Failed to delete utentsil:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error deleting utensil:", error);
      });
  };

  // connection to backend to get data
  useEffect(() => {
    fetch(`${process.env.URL}/api/utensilItems`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [props.trigger, refresh]); // Added refresh to dependency array

  return props.trigger ? (
    <div className="inventory">
      <div className="inventory-inner">
        {/* close button */}
        <button className="closer" onClick={handleClose}>
          {" "}
          close{" "}
        </button>
        <div style={{ padding: "25px" }}>
          <table style={{ backgroundColor: "#2B1313" }}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {/* distribute data into a table */}
              {data.map((d, i) => (
                <tr style={{ backgroundColor: "#2B1313" }} key={i}>
                  <td className={editingIndex === i ? "editing" : ""}>
                    {editingIndex === i ? (
                      <input
                        type="text"
                        value={editedUtensil.producttype}
                        onChange={(e) =>
                          setEditedUtensil({
                            ...editedUtensil,
                            producttype: e.target.value,
                          })
                        }
                      />
                    ) : (
                      d.producttype
                    )}
                  </td>
                  <td className={editingIndex === i ? "editing" : ""}>
                    {editingIndex === i ? (
                      <input
                        type="number"
                        value={editedUtensil.quantity}
                        onChange={(e) =>
                          setEditedUtensil({
                            ...editedUtensil,
                            quantity: parseInt(e.target.value),
                          })
                        }
                      />
                    ) : (
                      d.quantity
                    )}
                  </td>
                  <td
                    style={{
                      border: "1px solid white",
                      display: "flex",
                      justifyContent: "space-evenly",
                      width: "100%",
                    }}
                  >
                    {editingIndex === i ? (
                      <React.Fragment>
                        <button
                          className={defaultButton}
                          onClick={handleSaveEdit}
                        >
                          Save
                        </button>
                        <button onClick={() => setEditingIndex(-1)}>
                          Cancel
                        </button>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <button
                          className={defaultButton}
                          onClick={() => handleEditUtensil(i, d)}
                        >
                          Edit
                        </button>
                        <button
                          className={defaultButton}
                          onClick={() => handleDelete(d.utensilid)}
                        >
                          Delete
                        </button>
                      </React.Fragment>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : null;
}

export default UtensilItems;
