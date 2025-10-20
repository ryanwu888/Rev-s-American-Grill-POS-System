"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

// comment
import { defaultButton } from "../styles";
import MenuItemPic from "../../components/menuItemPic";
import MenuItemIcon from "../../components/menuItemIcon";
import DropDown from "../../components/DropDown";
import "./custom.css";

/*Audio Players*/
import AllPlayer from "../../components/audioPlayers/cashier/allPlayer";
import BurgerPLayer from "../../components/audioPlayers/cashier/burgerPlayer";
import SandwichPlayer from "../../components/audioPlayers/cashier/sandwichPlayer";
import EntreesPlayer from "../../components/audioPlayers/cashier/entreesPlayer";
import SidesPlayer from "../../components/audioPlayers/cashier/sidesPlayer";
import DrinksPlayer from "../../components/audioPlayers/cashier/drinksPlayer";
import ViewOrderPlayer from "../../components/audioPlayers/cashier/viewOrderPlayer";
import SubimtOderPlayer from "../../components/audioPlayers/cashier/subimtOderPlayer";
import CancelOrderPlayer from "../../components/audioPlayers/cashier/cancelOrderPlayer";
import KitchenPlayer from "../../components/audioPlayers/cashier/kitchenPlayer";
import LogoutPlayer from "../../components/audioPlayers/manager/logoutPlayer";
import CombosPlayer from "../../components/audioPlayers/cashier/combosPlayer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
type FoodCategoryMap = {
  [key: number]: string;
};
//maps out each id to their respective food, all drinks just get mapped to 14
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
  14: "Drinks",
};

/**
 * Represents a cart item.
 * @typedef {Object} CartItem
 * @property {MenuItem} item - The menu item added to the cart.
 * @property {number} quantity - The quantity of the menu item in the cart.
 */
interface CartItem {
  item: MenuItem;
  quantity: number;
}

/**
 * Cashier component for handling orders and menu items.
 * @returns {JSX.Element} Cashier component.
 */
export default function Cashier() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedMenuItem, setSelectedMenuItem] = useState(
    null as MenuItem | null
  );
  const comboItems: MenuItem[] = [
    {
      id: 1,
      name: "Gig Em Patty Melt Combo",
      pic: "pic-url-1",
      price: 13.08,
      description: "Gig Em Patty Melt With Fries and a Fountain Drink.",
      seasonal: false,
      food: true,
    },
    {
      id: 2,
      name: "Yell BBQ Sandwich Combo",
      pic: "pic-url-2",
      price: 12.08,
      description: "Yell BBQ Sandwich With Fries and a Fountain Drink.",
      seasonal: false,
      food: true,
    },
    {
      id: 3,
      name: "Bacon Cheeseburger Combo",
      pic: "pic-url-3",
      price: 13.08,
      description: "Bacon Cheeseburger With Fries and a Fountain Drink.",
      seasonal: false,
      food: true,
    },
    {
      id: 4,
      name: "Aggie Chicken Club Sandwich Combo",
      pic: "pic-url-4",
      price: 13.08,
      description:
        "Aggie Chicken Club Sandwich With Fries and a Fountain Drink.",
      seasonal: false,
      food: true,
    },
    {
      id: 5,
      name: "Black Bean Burger Combo",
      pic: "pic-url-5",
      price: 12.08,
      description: "Black Bean Burger With Fries and a Fountain Drink.",
      seasonal: false,
      food: true,
    },
    {
      id: 6,
      name: "Classic Hamburger Combo",
      pic: "pic-url-6",
      price: 12.08,
      description: "Hamburger With Fries and a Fountain Drink.",
      seasonal: false,
      food: true,
    },
    {
      id: 7,
      name: "Spicy Chicken Sandwich Combo",
      pic: "pic-url-7",
      price: 12.49,
      description: "Spicy Chicken Sandwich With Fries and a Fountain Drink.",
      seasonal: false,
      food: true,
    },
    {
      id: 8,
      name: "Cheeseburger Combo",
      pic: "pic-url-8",
      price: 12.49,
      description: "Cheeseburger With Fries and a Fountain Drink.",
      seasonal: false,
      food: true,
    },
    {
      id: 9,
      name: "Rev's Grilled Chicken Sandwich Combo",
      pic: "pic-url-9",
      price: 13.49,
      description: "Grilled Chicken Sandwich With Fries and a Fountain Drink.",
      seasonal: false,
      food: true,
    },
  ];
  const [numItemsAdded, setNumItemsAdded] = useState(1);
  const [fontSize, setFontSize] = useState<string>("16px"); // Default font size
  const [category, setCategory] = useState("All");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("Menu");
  const [textSpeech, setTextSpeech] = useState(false);
  const [audio, setAudio] = useState<string>("null");
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Burgers":
        return "#FFA07A"; //Pastel Orange
      case "Sandwiches":
        return "#FFEC8B"; //Pastel Yellow
      case "Entrees":
        return "#7FFF7F"; //Pastel Green
      case "Sides":
        return "#6EB5FF"; // Pastel Blue
      case "Drinks":
        return "#B18CE9"; // Pastel Purple
      case "Combos":
        return "#FF99B3"; // Pastel Pink
      default:
        return "#ea5456"; // Default color
    }
  };
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [showContent, setShowContent] = useState(false);

  /**
   * The authentication status of the user.
   */
  useEffect(() => {
    if (status === "unauthenticated") {
      // Set a timeout to redirect after a few seconds
      const timeoutId = setTimeout(() => {
        setRedirectToLogin(true);
      }, 3000); // Redirect after 3 seconds

      // Clear the timeout if the component is unmounted or the session becomes authenticated
      return () => clearTimeout(timeoutId);
    }
  }, [status]);

  /**
   *  Flag indicating whether to redirect to the login page.
   */
  useEffect(() => {
    // Redirect to login page if redirectToLogin is true
    if (redirectToLogin && status === "unauthenticated") {
      router.push("/");
    }
  }, [redirectToLogin, status]);

  /**
   * If the user is authenticated, fetch the user's role.
   */
  useEffect(() => {
    // If the user is authenticated, fetch the user's role
    if (status === "authenticated") {
      fetch(`${process.env.URL}/api/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch user role");
          }
          return response.json(); // Parse JSON response
        })
        .then((data) => {
          // Check the user's role
          // console.log("DATA", data);
          if (!data || data.role === "customer") {
            // Redirect to home page if the user is a customer
            router.push("/");
          } else {
            // Set showKitchenOrders to true if the user is not a customer
            setShowContent(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching user role:", error);
        });
    }
  }, [status, router]);

  // Function to group items by category
  const groupItemsByCategory = () => {
    const groupedItems: { [key: string]: MenuItem[] } = {};
    menuItems.forEach((item) => {
      const categoryName = item.food ? food_category_map[item.id] : "Drinks";
      if (!groupedItems[categoryName]) {
        groupedItems[categoryName] = [];
      }
      groupedItems[categoryName].push(item);
    });
    return groupedItems;
  };

  /**
   * Renders buttons based on the category.
   * @returns {JSX.Element[]} Array of JSX elements representing buttons.
   */
  const renderButtonsByCategory = () => {
    const groupedItems = groupItemsByCategory();
    const categories = Object.keys(groupedItems);
    return categories.map((category) => {
      const items = groupedItems[category];
      return (
        <div key={category} className="flex flex-wrap gap-4">
          {items.map((item) => (
            <div key={item.id}>
              <button
                className={defaultButton}
                style={{
                  backgroundColor: item.food
                    ? food_category_map[item.id]
                      ? getCategoryColor(food_category_map[item.id])
                      : "#ea5456"
                    : category === "All"
                    ? getCategoryColor(food_category_map[item.id])
                    : "#B18CE9",
                  width: "150px",
                  height: "150px",
                  color: "black",
                }}
                onClick={() => setSelectedMenuItem(item)}
              >
                {item.name} - ${item.price}
              </button>
            </div>
          ))}
        </div>
      );
    });
  };

  /**
   * Function to fetch inventory data.
   */
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(`${process.env.URL}/api/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchInventory();
  }, []);

  /**
   * Handles changing the category.
   * @param {string} newCategory - The new category value.
   */
  function handleSetCategory(newCategory: string) {
    setCategory(newCategory);
  }

  function handleSetItemNumber(quantity: string) {
    setNumItemsAdded(Number(quantity));
  }

  const handleFontSizeChange = (newFontSize: string) => {
    setFontSize(newFontSize);
  };

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

  const handleRemoveFromCart = (itemToRemove: CartItem | null) => {
    if (itemToRemove === null) return;
    setCart((prevCart) => prevCart.filter((item) => item !== itemToRemove));
  };

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

  return (showContent && 
    <main
      className="bg-[#1B0D0D] flex min-h-screen justify-between"
      style={{ fontSize: `${fontSize}` }}
    >
      {/* sidebar */}
      <div className="bg-accent flex flex-col items-center gap-4 pb-8 min-h-screen mr-8 basis-1/6">
        {/* <div className="bg-accent flex flex-col items-center gap-4 pb-8 min-h-screen"> */}
        <div className="flex-grow flex flex-col items-center gap-4">
          <Image src="/revs_logo.png" width={200} height={200} alt=""></Image>
          <div className="flex flex-col items-center gap-4 pb-8 min-h-screen">
            <button
              className={defaultButton}
              style={{
                backgroundColor: category === "All" ? "#ea5456" : "#ea5456",
                color: "black",
              }}
              onClick={() => {
                setActiveTab("Menu");
                handleSetCategory("All"); //All Button
                setAudio("All");
              }}
            >
              All
            </button>
            {audio === "All" && textSpeech && <AllPlayer autoPlay={true} />}

            <button
              className={defaultButton}
              style={{
                backgroundColor: category === "Burgers" ? "#FFA07A" : "#FFA07A",
                color: "black",
              }}
              onClick={() => {
                setActiveTab("Menu");
                handleSetCategory("Burgers"); //Burger Button
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
              style={{
                backgroundColor:
                  category === "Sandwiches" ? "#FFEC8B" : "#FFEC8B",
                color: "black",
              }}
              onClick={() => {
                setActiveTab("Menu");
                handleSetCategory("Sandwiches"); //Sandwich Button
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
              style={{
                backgroundColor: category === "Entrees" ? "#7FFF7F" : "#7FFF7F",
                color: "black",
              }}
              onClick={() => {
                setActiveTab("Menu");
                handleSetCategory("Entrees"); //Entrees Button
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
              style={{
                backgroundColor: category === "Sides" ? "#6EB5FF" : "#6EB5FF",
                color: "black",
              }}
              onClick={() => {
                setActiveTab("Menu");
                handleSetCategory("Sides"); //Sides Button
                setAudio("Sides");
              }}
            >
              Sides
            </button>
            {audio === "Sides" && textSpeech && <SidesPlayer autoPlay={true} />}

            <button
              className={defaultButton}
              style={{
                backgroundColor: category === "Drinks" ? "#B18CE9" : "#B18CE9",
                color: "black",
              }}
              onClick={() => {
                setActiveTab("Menu");
                handleSetCategory("Drinks"); //Drinks Button
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
              style={{
                backgroundColor: category === "Combos" ? "#FF99B3" : "#FF99B3",
                color: "black",
              }}
              onClick={() => {
                setActiveTab("Menu");
                handleSetCategory("Combos"); //Combos Button
                setAudio("Combos");
              }}
            >
              Combos
            </button>
            {audio === "Combos" && textSpeech && (
              <CombosPlayer autoPlay={true} />
            )}

            <a
              href="/kitchen"
              className={defaultButton}
              onMouseOver={() => setAudio("Kitchen")} //Kitchen Nav Button
            >
              Kitchen
            </a>
            {audio === "Kitchen" && textSpeech && (
              <KitchenPlayer autoPlay={true} />
            )}

            <a
              href="/"
              className={
                "font-bold py-2 px-4 rounded bg-white hover:bg-gray-100 text-red-950"
              }
              onMouseOver={() => setAudio("LogOut")} //Log out Button
            >
              Log Out
            </a>
            {audio === "LogOut" && textSpeech && (
              <LogoutPlayer autoPlay={true} />
            )}
          </div>
        </div>
      </div>

      {/* Order History Trends */}
      <div className="flex-grow flex items-center justify-center py-16 overflow-auto">
        {activeTab === "Menu" && (
          <div className="flex flex-col gap-4">
            {/* Render buttons by category */}
            {category === "All" && renderButtonsByCategory()}

            {/* Display regular menu items */}
            <div className="flex flex-wrap gap-4">
              {menuItems
                .filter((item: MenuItem) => {
                  if (category === "All" || category === "Combos") {
                    return false; // Exclude items when "All" or "Combos" category is selected, causes issues when true
                  }
                  if (!item.food) {
                    return category === "Drinks";
                  }
                  // Convert numeric food IDs to category names using food_category_map
                  const categoryName = food_category_map[item.id];
                  return categoryName === category;
                })
                .map((item: MenuItem, index: number) => (
                  <div key={index} onClick={() => setSelectedMenuItem(item)}>
                    <button
                      className={defaultButton}
                      style={{
                        backgroundColor: item.food
                          ? food_category_map[item.id]
                            ? getCategoryColor(food_category_map[item.id])
                            : "#ea5456"
                          : "#B18CE9", // Default color for items without food category
                        width: "150px",
                        height: "150px",
                        color: "black",
                      }}
                    >
                      {item.name} - ${item.price}
                    </button>
                  </div>
                ))}
            </div>
            {/* Display combo items */}
            {category === "All" && (
              <div className="flex flex-wrap gap-4">
                {comboItems.map((item, index) => (
                  <div key={index} onClick={() => setSelectedMenuItem(item)}>
                    <button
                      className={defaultButton}
                      style={{
                        backgroundColor: getCategoryColor("Combos"), // Use the color for Combos category
                        width: "150px",
                        height: "150px",
                        color: "black",
                      }}
                    >
                      {item.name} - ${item.price}
                    </button>
                  </div>
                ))}
              </div>
            )}
            {category === "Combos" && (
              <div className="flex flex-wrap gap-4">
                {comboItems.map((item, index) => (
                  <div key={index} onClick={() => setSelectedMenuItem(item)}>
                    <button
                      className={defaultButton}
                      style={{
                        backgroundColor: getCategoryColor("Combos"), // Use the color for Combos category
                        width: "150px",
                        height: "150px",
                        color: "black",
                      }}
                    >
                      {item.name} - ${item.price}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {/* View Menu Item Specifics */}
      <div className="flex flex-col items-center gap-4 p-4 min-h-screen w-[30em]">
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

        <div
          className="table-container overflow-y-auto rounded-md"
          style={{ height: "calc(100vh - 100px)" }}
        >
          <table className="table-auto flex-grow bg-[#2B1313] text-center rounded-md">
            <thead style={{ backgroundColor: "#7D2020" }}>
              <tr style={{ backgroundColor: "#7D2020" }}>
                <th className="text-white  bg-[#7D2020] p-5">Name</th>
                <th className="text-white bg-[#7D2020] p-5">Quantity</th>
                <th className="text-white bg-[#7D2020] p-4">Action</th>
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className={"flex items-center justify-center p-2 w-full"}>
            <div>
              <button
                className={`bg-[#DA9999] text-sm flex-grow  text-white font-bold py-2 px-4 rounded m-2`}
                onClick={() => {
                  submitOrder();
                  setAudio("SubmitOrder");
                }}
              >
                Submit Order
              </button>
              {audio === "SubmitOrder" && textSpeech && (
                <SubimtOderPlayer autoPlay={true} />
              )}
              <a
                href="/cashier"
                className={`bg-[#DA9999] text-sm flex-grow  text-white font-bold py-2 px-4 rounded m-2`}
                onMouseOver={() => setAudio("CancelOrder")}
              >
                Cancel Order
              </a>
              {audio === "CancelOrder" && textSpeech && (
                <CancelOrderPlayer autoPlay={true} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
