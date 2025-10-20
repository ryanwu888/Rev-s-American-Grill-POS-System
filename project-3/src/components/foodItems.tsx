import React, { useState, useEffect } from 'react';
import './Inventory.css';

/**
 * Represents the props for the FoodItems component.
 * @typedef {Object} FoodItemsProps
 * @property {boolean} trigger - A boolean value to trigger the display of the FoodItems component.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setButtonFoodItems - Function to update the state controlling the visibility of the FoodItems component.
 * @property {(newItem: any) => Promise<void>} onAddFoodItem - Function to add a new food item.
 * @property {boolean} showAddItemForm - A boolean value indicating whether to show the add item form.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setShowAddItemForm - Function to update the state controlling the visibility of the add item form.
 */
interface FoodItemsProps {
    trigger: boolean;
    setButtonFoodItems: React.Dispatch<React.SetStateAction<boolean>>;
    onAddFoodItem: (newItem: any) => Promise<void>;
    showAddItemForm: boolean;
    setShowAddItemForm: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Component that displays food items with editability.
 * @param {FoodItemsProps} props - The props for the FoodItems component.
 * @returns {React.ReactNode} A table connected to the database with editability.
 */
function FoodItems(props: FoodItemsProps) {
    const [data, setData] = useState([]);
    const [newItem, setNewItem] = useState({
        foodid: '',
        producttype: '',
        timeid: '',
        calories: '',
        ingredients: '',
        price: '',
        foodname: ''
    });
    const [refresh, setRefresh] = useState(false); // State to trigger re-fetch of inventory data

    /** 
     * Function to handle closing the FoodItems component and the add item form.
     */
    const handleClose = () => {
        props.setButtonFoodItems(false);
        props.setShowAddItemForm(false);
    };

    /**
     * Function to handle changes in the new item.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewItem(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    /**
     * Function to handle submitting a new food item.
     * @param {React.FormEvent} e - The form submission event.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await props.onAddFoodItem(newItem);
            setNewItem({
                foodid: '',
                producttype: '',
                timeid: '',
                calories: '',
                ingredients: '',
                price: '',
                foodname: ''
            });
            setRefresh(!refresh); // Toggle the refresh state to trigger re-fetch
        } catch (error) {
            console.error('Error adding food item:', error);
        }
    };

    /**
     * Connection to backend to get food items data.
     */
    useEffect(() => {
        fetch(`${process.env.URL}/api/foodItems`)
          .then((response) => response.json())
          .then((data) => {
              setData(data);
          })
          .catch((error) => console.error('Error fetching data:', error));
    }, [props.trigger, refresh]); // Added refresh to dependency array

    return (props.trigger) ? (
        <div className="inventory">
            <div className="inventory-inner">
                {/* closing button */}
                <button className="closer" onClick={handleClose}> close </button>
                {props.showAddItemForm && (
                    <div className="add-item-form">
                        <h3>Add Food Item</h3>
                        {/* submitting a change */}
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>
                                    foodid:
                                    <input
                                        type="number"
                                        name="foodid"
                                        value={newItem.foodid}
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
                                    timeid:
                                    <input
                                        type="number"
                                        name="timeid"
                                        value={newItem.timeid}
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
                                    ingredients:
                                    <input
                                        type="text"
                                        name="ingredients"
                                        value={newItem.ingredients}
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
                                    foodname:
                                    <input
                                        type="text"
                                        name="foodname"
                                        value={newItem.foodname}
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>
                            <button type="submit">Add Item</button>
                        </form>
                    </div>
                )}
                <div style={{ padding: "25px" }}>
    <table>
        <thead>
            <tr>
                <th>foodid</th>
                <th>producttype</th>
                <th>timeid</th>
                <th>calories</th>
                <th>ingredients</th>
                <th>price</th>
                <th>foodname</th>
            </tr>
        </thead>
        <tbody>
            {/* distributing data into a table */}
            {(data as Array<{ foodid: string; producttype: string; timeid: string; calories: number; ingredient: string; price: number; foodname: string }>).map((d, i) => (
                <tr key={i}>
                    <td>{d.foodid}</td>
                    <td>{d.producttype}</td>
                    <td>{d.timeid}</td>
                    <td>{d.calories}</td>
                    <td>{d.ingredient}</td>
                    <td>{d.price}</td>
                    <td>{d.foodname}</td>
                </tr>
            ))}
        </tbody>
    </table>
</div>

            </div>
        </div>
    ) : null;
}

export default FoodItems;