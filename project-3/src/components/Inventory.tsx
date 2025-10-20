import React, { useState, useEffect } from "react";
import "./Inventory.css";

/**
 * Props interface for the Inventory component.
 */
interface InventoryProps {
  trigger: boolean; // Flag to trigger rendering
  setButtonInventory: React.Dispatch<React.SetStateAction<boolean>>; // Function to update trigger state
  onAddInventoryItem: (newItem: any) => Promise<void>; // Function to add new inventory item
  showAddItemForm: boolean; // Flag to show/hide add item form
  setShowAddItemForm: React.Dispatch<React.SetStateAction<boolean>>; // Function to update showAddItemForm state
}

/**
 * Interface for inventory item.
 */
interface InventoryItem {
  ingredient: string;
  max_capacity: string; // Change to number if this should be a number
  current_capacity: string; // Change to number if this should be a number
}

/**
 * Inventory component.
 */
function Inventory(props: InventoryProps) {
  // Use the interface to type your state
  const [data, setData] = useState<InventoryItem[]>([]); // State for inventory data
  const [newItem, setNewItem] = useState<InventoryItem>({
    // State for new item being added
    ingredient: "",
    max_capacity: "",
    current_capacity: "",
  });
  const [refresh, setRefresh] = useState(false); // State to trigger re-fetch of inventory data

  /**
   * Function to handle closing of inventory component.
   */
  const handleClose = () => {
    props.setButtonInventory(false); // Hide inventory button
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
      await props.onAddInventoryItem(newItem); // Add new item to inventory
      setNewItem({
        // Reset form fields
        ingredient: "",
        max_capacity: "",
        current_capacity: "",
      });
      setRefresh(!refresh); // Toggle the refresh state to trigger re-fetch
    } catch (error) {
      console.error("Error adding inventory item:", error);
    }
  };

  // Fetch inventory data from backend
  useEffect(() => {
    fetch(`${process.env.URL}/api/inventory`)
      .then((response) => response.json())
      .then((data) => {
        setData(data); // Update inventory data state
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
            <h3>Add Inventory Item</h3>
            {/* Form for adding new inventory item */}
            <form onSubmit={handleSubmit}>
              <div>
                <label>
                  Ingredient:
                  <input
                    type="text"
                    name="ingredient"
                    value={newItem.ingredient}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  Max Capacity:
                  <input
                    type="number"
                    name="max_capacity"
                    value={newItem.max_capacity}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  Current Capacity:
                  <input
                    type="number"
                    name="current_capacity"
                    value={newItem.current_capacity}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <button type="submit">Add Item</button>
            </form>
          </div>
        )}
        <div style={{ padding: "25px" }}>
          {/* Table to display inventory data */}
          <table>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Max Capacity</th>
                <th>Current Capacity</th>
              </tr>
            </thead>
            <tbody>
              {/* Map through inventory data and render table rows */}
              {data.map((d, i) => (
                <tr key={i}>
                  <td>{d.ingredient}</td>
                  <td>{d.max_capacity}</td>
                  <td>{d.current_capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : null;
}

export default Inventory;
