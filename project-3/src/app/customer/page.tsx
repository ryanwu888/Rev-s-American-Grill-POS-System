"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import { defaultButton } from "../styles";
import MenuItemPic from "../../components/menuItemPic";
import MenuItemIcon from "../../components/menuItemIcon";
import DropDown from "../../components/DropDown";

/*Audio Players*/
import AllPlayer from "../../components/audioPlayers/cashier/allPlayer";
import BurgerPLayer from "../../components/audioPlayers/cashier/burgerPlayer";
import SandwichPlayer from "../../components/audioPlayers/cashier/sandwichPlayer";
import EntreesPlayer from "../../components/audioPlayers/cashier/entreesPlayer";
import SidesPlayer from "../../components/audioPlayers/cashier/sidesPlayer";
import DrinksPlayer from "../../components/audioPlayers/cashier/drinksPlayer";
import SubimtOrderPlayer from "../../components/audioPlayers/cashier/subimtOderPlayer";

const rewardsData = [
  {
    tier: "Bronze",
    description: "After 50 points, get one free drink",
    eligible: true,
  },
  {
    tier: "Silver",
    description: "After 100 points and get one free meal on us!",
    eligible: true,
  },
  {
    tier: "Gold",
    description: "After 500 points get meal free and a large fry!",
    eligible: false,
  },
  {
    tier: "Platinum",
    description: "After 1000 points get a meal free and a free hat!",
    eligible: false,
  },
];

// random comment
type FoodCategoryMap = {
  [key: number]: string;
};

const food_category_map: FoodCategoryMap = {
  1: "Sides",
  2: "Sides",
  3: "Entrees",
  4: "Sandwiches",
  5: "Burgers",
  6: "Burgers",
  7: "Burgers",
  8: "Burgers",
  9: "Burgers",
  10: "Sandwiches",
  11: "Sandwiches",
  12: "Sandwiches",
  13: "Entrees",
};

/**
 * Represents a menu item.
 * @typedef {Object} MenuItem
 * @property {number} id - The unique identifier of the menu item.
 * @property {string} name - The name of the menu item.
 * @property {string} pic - The URL of the image for the menu item.
 * @property {number} price - The price of the menu item.
 * @property {string} description - The description of the menu item.
 * @property {boolean} seasonal - Indicates if the menu item is seasonal.
 */
interface MenuItem {
  id: number;
  name: string;
  pic: string;
  price: number;
  description: string;
  seasonal: boolean;
  food: boolean;
}

/**
 * Represents a map of food categories.
 * @typedef {Object.<number, string>} FoodCategoryMap
 */
interface CartItem {
  item: MenuItem;
  quantity: number;
}

/**
 * Represents the Customer component for managing orders and rewards.
 * @component
 */
export default function Customer() {
  const [selectedMenuItem, setSelectedMenuItem] = useState(
    null as MenuItem | null
  );
  const [numItemsAdded, setNumItemsAdded] = useState(0);
  const [fontSize, setFontSize] = useState<string>("16px"); // Default font size
  const [category, setCategory] = useState("All");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("Menu");
  const [textSpeech, setTextSpeech] = useState(false);
  const [audio, setAudio] = useState<string>("null");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(`${process.env.URL}/api/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        // console.log("data", data);
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        // Handle error gracefully
      }
    };

    fetchInventory();
  }, []);

  /**
   * Sets the category for filtering menu items.
   * @param {string} newCategory - The new category to set.
   */
  function handleSetCategory(newCategory: string) {
    setCategory(newCategory);
  }

  /**
   * Sets the number of items to add.
   * @param {string} quantity - The quantity to set.
   */
  function handleSetItemNumber(quantity: string) {
    setNumItemsAdded(Number(quantity));
  }

  /**
   * Handles the change in font size.
   * @param {string} newFontSize - The new font size to set.
   */
  const handleFontSizeChange = (newFontSize: string) => {
    setFontSize(newFontSize);
  };

  /**
   * Removes an item from the cart.
   * @param {CartItem | null} itemToRemove - The item to remove from the cart.
   */
  const handleRemoveFromCart = (itemToRemove: CartItem | null) => {
    if (itemToRemove === null) return;
    setCart((prevCart) => prevCart.filter((item) => item !== itemToRemove));
  };

  /**
   * Adds the selected menu item to the cart.
   */
  const handleAddToOrder = () => {
    if (selectedMenuItem) {
      // Check if the selected menu item is already in the cart
      const existingItemIndex = cart.findIndex(
        (item: CartItem) => item.item.id === selectedMenuItem.id
      );
      console.log("existing", existingItemIndex);
      if (existingItemIndex !== -1) {
        // If the item is already in the cart, update its quantity
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += 1;
        setCart(updatedCart);
      } else {
        // If the item is not in the cart, add it as a new item
        const newItem = {
          item: selectedMenuItem,
          quantity: 1,
        };
        setCart((prevCart: CartItem[]) => [...prevCart, newItem]);
      }

      // Reset number of items added and input value to 1
      setNumItemsAdded(1);
    }
  };

  /**
   * Submits the order.
   */
  const submitOrder = async () => {
    if (cart.length === 0) {
      return;
    }
    try {
      const response = await fetch(`${process.env.URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify JSON content type
        },
        body: JSON.stringify({ cart }), // Convert cart object to JSON string
      });
      if (!response.ok) {
        throw new Error("Failed to submit order");
      }
      const data = await response.json();
      setCart([]);
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  return (
    <main
      className="bg-[#1B0D0D] flex justify-between overflow-hidden"
      style={{ fontSize: `${fontSize}`, height: "calc(100vh)" }}
    >
      {/* sidebar */}
      <div className="bg-accent flex flex-col items-center gap-4 pb-8 mr-8 basis-1/6">
        <div className="flex-grow flex flex-col items-center gap-4">
          <Image src="/revs_logo.png" width={200} height={200} alt=""></Image>
          <div className="flex flex-col items-center gap-4 pb-8 min-h-screen">
            <button
              className={defaultButton}
              onClick={() => {
                setActiveTab("Menu");
                handleSetCategory("All");
                setAudio("All");
              }}
            >
              All
            </button>
            {audio === "All" && textSpeech && <AllPlayer autoPlay={true} />}
            <button
              className={defaultButton}
              onClick={() => {
                setActiveTab("Menu");
                handleSetCategory("Burgers");
                setAudio("Burgers");
              }}
            >
              Burgers
            </button>
            {audio === "Burgers" && textSpeech && (
              <BurgerPLayer autoPlay={true} />
            )}
            <button
              className={defaultButton}
              onClick={() => {
                setActiveTab("Menu");
                handleSetCategory("Sandwiches");
                setAudio("Sandwiches");
              }}
            >
              Sandwiches
            </button>
            {audio === "Sandwiches" && textSpeech && (
              <SandwichPlayer autoPlay={true} />
            )}
            <button
              className={defaultButton}
              onClick={() => {
                setActiveTab("Menu");
                handleSetCategory("Entrees");
                setAudio("Entrees");
              }}
            >
              Entrees
            </button>
            {audio === "Entrees" && textSpeech && (
              <EntreesPlayer autoPlay={true} />
            )}
            <button
              className={defaultButton}
              onClick={() => {
                setActiveTab("Menu");
                handleSetCategory("Sides");
                setAudio("Sides");
              }}
            >
              Sides
            </button>
            {audio === "Sides" && textSpeech && <SidesPlayer autoPlay={true} />}
            <button
              className={defaultButton}
              onClick={() => {
                setActiveTab("Menu");
                handleSetCategory("Drinks");
                setAudio("Drinks");
              }}
            >
              Drinks
            </button>
            {audio === "Drinks" && textSpeech && (
              <DrinksPlayer autoPlay={true} />
            )}
            <button
              className={defaultButton}
              onClick={() => {
                setActiveTab("Menu");
                handleSetCategory("Seasonal");
              }}
            >
              Seasonal
            </button>
            <button
              className={defaultButton}
              onClick={() => {
                setActiveTab("Rewards");
              }}
            >
              Rewards
            </button>
          </div>
        </div>
        {/* <div className="flex flex-col items-center gap-2">
                <button className={defaultButton}>
                    View Order
                </button>
                <a href="/cashier" className={"font-bold py-2 px-4 rounded bg-primary hover:bg-rose-300 text-red-950"}>
                    Cancel Order
                </a>
                <a href="/" className={"font-bold py-2 px-4 rounded bg-white hover:bg-gray-100 text-red-950"}>
                    Log Out
                </a>
            </div> */}
      </div>

      {/* Order History Trends */}
      <div
        className="flex-grow flex items-start justify-start overflow-y-auto"
        style={{ height: "calc(100vh)" }}
      >
        {activeTab === "Menu" && (
          <div
            className="flex-grow grid grid-cols-2 gap-4 p-4 overflow-y-auto"
            style={{ height: "calc(100vh)" }}
          >
            {menuItems
              .filter((item: MenuItem) => {
                if (category === "All") {
                  return true; // Show all items if no category is selected
                }

                if (category === "Seasonal") {
                  return item.seasonal;
                }

                if (!item.food) {
                  return category === "Drinks";
                }
                // Convert numeric food IDs to category names using food_category_map
                const categoryName = food_category_map[item.id];
                return categoryName === category;
              })
              .map((item: MenuItem, index: number) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedMenuItem(item);
                    setNumItemsAdded(1);
                  }}
                >
                  <MenuItemIcon
                    description={item.description}
                    pic={"/menuItems" + item.pic}
                    name={item.name}
                    seasonal={item.seasonal}
                  ></MenuItemIcon>
                </div>
              ))}
          </div>
        )}
        {/* Rewards Tab */}
        {activeTab === "Rewards" && (
          <div
            className="flex-grow grid grid-cols-2 gap-4 p-4 overflow-y-auto"
            style={{ height: "calc(100vh)" }}
          >
            {rewardsData.map((reward, index) => (
              <div key={index} className="flex">
                <div
                  className={`flex flex-col items-center justify-center rounded-lg p-6 shadow-md w-full ${
                    !reward.eligible && "opacity-50"
                  } ${
                    reward.tier === "Bronze"
                      ? "bg-[#cd7f32]"
                      : reward.tier === "Silver"
                      ? "bg-[#c0c0c0]"
                      : reward.tier === "Gold"
                      ? "bg-[#ffd700]"
                      : "bg-[#7e7e7e]"
                  }`}
                >
                  <h2 className="text-xl font-bold">{reward.tier}</h2>
                  <p className="text-gray-600">{reward.description}</p>
                  {!reward.eligible && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-md">
                      Not Eligible
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Menu Item Specifics */}
      <div className="flex flex-col items-center gap-4 p-4 w-[30em]">
        <div className="bg-accent text-white flex items-center justify-center px-4 py-2 text-center w-full rounded-md">
          <DropDown
            onFontSizeChange={handleFontSizeChange}
            textToSpeech={setTextSpeech}
          ></DropDown>
        </div>

        <div className="bg-[#2B1313] text-white flex items-center justify-center px-4 py-2 text-center w-full rounded-md">
          {selectedMenuItem ? selectedMenuItem.name : "Product Title"}
        </div>
        <div className="bg-[#2B1313] text-white flex items-center justify-center px-4 py-2 text-center w-full rounded-md">
          {selectedMenuItem ? "$" + selectedMenuItem.price : "$ Price"}
        </div>
        <div className="flex bg-[#2B1313] text-white text-md flex items-center justify-center py-2 text-center w-full rounded-md">
          {selectedMenuItem ? selectedMenuItem.description : "Description"}
        </div>
        <div className="flex items-center justify-center p-2 w-full">
          <button
            className={`${defaultButton} text-sm flex-grow`}
            onClick={handleAddToOrder}
          >
            Add to Order
          </button>
        </div>

        <div className="text-sm table-container flex items-start justify-center text-center w-full rounded-md">
          <table className="table-auto flex-grow bg-[#2B1313] text-center rounded-md">
            <thead style={{ backgroundColor: "#7D2020" }}>
              <tr style={{ backgroundColor: "#7D2020" }}>
                <th className="text-white bg-[#7D2020]">Name</th>
                <th className="text-white bg-[#7D2020]">Quantity</th>
                <th className="text-white bg-[#7D2020]">Action</th>
                {/* New column for delete button */}
              </tr>
            </thead>
            <tbody>
              {cart?.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center">
                    No items in the cart
                  </td>
                </tr>
              )}
              {cart?.map((item, index) => {
                return (
                  <tr key={index} style={{ backgroundColor: "#2B1313" }}>
                    <td>{item.item.name}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <button
                        className={defaultButton}
                        onClick={() => handleRemoveFromCart(item)}
                      >
                        Delete
                      </button>
                    </td>{" "}
                    {/* Delete button with handleDelete method */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center p-2 w-full">
          <button
            className={`bg-[#DA9999] text-sm flex-grow  text-white font-bold py-2 px-4 rounded`}
            onClick={() => {
              submitOrder();
              setAudio("SubmitOrder");
            }}
          >
            Submit Order
          </button>
        </div>

        {audio === "SubmitOrder" && textSpeech && (
          <SubimtOrderPlayer autoPlay={true} />
        )}
      </div>
    </main>
  );
}
