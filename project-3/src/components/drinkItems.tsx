import React, { useState, useEffect } from "react";
import "./Inventory.css";

/**
 * Props interface for the DrinkItems component.
 */
interface DrinkItemsProps {
  trigger: boolean; // Flag to trigger rendering
  setButtonDrinkItems: React.Dispatch<React.SetStateAction<boolean>>; // Function to update trigger state
  onAddDrinkItem: (newItem: any) => Promise<void>; // Function to add new drink item
  showAddItemForm: boolean; // Flag to show/hide add item form
  setShowAddItemForm: React.Dispatch<React.SetStateAction<boolean>>; // Function to update showAddItemForm state
}

/**
 * Interface for drink item.
 */
interface DrinkItem {
  drinkid: string;
  producttype: string;
  calories: string; // Change to number if this should be a number
  price: string; // Change to number if this should be a number
  carbonation: string;
  temperature: string; // Change to number if this should be a number
}

/**
 * DrinkItems component.
 */
function DrinkItems(props: DrinkItemsProps) {
  const [data, setData] = useState<DrinkItem[]>([]); // State for drink item data
  const [newItem, setNewItem] = useState<DrinkItem>({
    // State for new item being added
    drinkid: "",
    producttype: "",
    calories: "",
    price: "",
    carbonation: "",
    temperature: "",
  });
  const [refresh, setRefresh] = useState(false); // State to trigger re-fetch of drink item data

  /**
   * Function to handle closing of drink items component.
   */
  const handleClose = () => {
    props.setButtonDrinkItems(false); // Hide drink items button
    props.setShowAddItemForm(false); // Hide add item form
  };

  /**
   * Function to handle input change.
   * @param e The event object
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  /**
   * Function to handle form submission.
   * @param e The form event object
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await props.onAddDrinkItem(newItem); // Add new item to drink items
      setNewItem({
        // Reset form fields
        drinkid: "",
        producttype: "",
        calories: "",
        price: "",
        carbonation: "",
        temperature: "",
      });
      setRefresh(!refresh); // Toggle the refresh state to trigger re-fetch
    } catch (error) {
      console.error("Error adding Drink item:", error);
    }
  };

  // Fetch drink item data from backend
  useEffect(() => {
    fetch(`${process.env.URL}/api/DrinkItems`)
      .then((response) => response.json())
      .then((data) => {
        setData(data); // Update drink item data state
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [props.trigger, refresh]); // Trigger fetch when trigger or refresh state changes

  return props.trigger ? (
    <div className="inventory">
      <div className="inventory-inner">
        {/* Close button */}
        <button className="closer" onClick={handleClose}>
          {" "}
          close{" "}
        </button>
        {props.showAddItemForm && (
          <div className="add-item-form">
            <h3>Add Drink Item</h3>
            {/* Form for adding new drink item */}
            <form onSubmit={handleSubmit}>
              <div>
                <label>
                  drinkid:
                  <input
                    type="number"
                    name="drinkid"
                    value={newItem.drinkid}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  producttype:
                  <input
                    type="text"
                    name="producttype"
                    value={newItem.producttype}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  calories:
                  <input
                    type="number"
                    name="calories"
                    value={newItem.calories}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  price:
                  <input
                    type="text"
                    name="price"
                    value={newItem.price}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  carbonation:
                  <input
                    type="text"
                    name="carbonation"
                    value={newItem.carbonation}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  temperature:
                  <input
                    type="text"
                    name="temperature"
                    value={newItem.temperature}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <button type="submit">Add Item</button>
            </form>
          </div>
        )}
        <div style={{ padding: "25px" }}>
          {/* Table to display drink item data */}
          <table>
            <thead>
              <tr>
                <th>drinkid</th>
                <th>producttype</th>
                <th>calories</th>
                <th>price</th>
                <th>carbonation</th>
                <th>temperature</th>
              </tr>
            </thead>
            <tbody>
              {/* Map through drink item data and render table rows */}
              {data.map((d, i) => (
                <tr key={i}>
                  <td>{d.drinkid}</td>
                  <td>{d.producttype}</td>
                  <td>{d.calories}</td>
                  <td>{d.price}</td>
                  <td>{d.carbonation}</td>
                  <td>{d.temperature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : null;
}

export default DrinkItems;
