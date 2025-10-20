"use client";
import Image from "next/image";
import Inventory from "../../components/Inventory";
import ProductUsage from "../../components/productUsage";
import FoodItems from "../../components/foodItems";
import DrinkItems from "../../components/drinkItems";
import UtensilItems from "../../components/utensilItems";
import { defaultButton } from "../styles";
import DropDown from "../../components/DropDown";
import { useState, useEffect } from "react";
import MenuItemIcon from "../../components/menuItemIcon";
import MenuItemPic from "../../components/menuItemPic";
import AddInventPlayer from "../../components/audioPlayers/manager/addInventPlayer";
import EditMenuPlayer from "../../components/audioPlayers/manager/editMenuPlayer";
import ViewFoodItemPlayer from "../../components/audioPlayers/manager/viewFoodItemPlayer";
import AddDrinkItemPlayer from "../../components/audioPlayers/manager/addDrinkItem";
import ViewUtensilPlayer from "../../components/audioPlayers/manager/viewUtensilPlayer";
import AddUtensilPlayer from "../../components/audioPlayers/manager/addUtensilPlayer";
import ViewInventoryPlayer from "../../components/audioPlayers/manager/viewInventoryPlayer";
import MenuPlayer from "../../components/audioPlayers/manager/menuPlayer";
import ChartsPlayer from "../../components/audioPlayers/manager/ChartsPlayer";
import LogoutPlayer from "../../components/audioPlayers/manager/logoutPlayer";
import RefreshPlayer from "../../components/audioPlayers/manager/refreshPlayer";
import PairChart from "../../components/audioPlayers/manager/pairChart";
import CommonPairings from "../../components/commonPairings";
import ExcessReport from "../../components/excessReport";
import RestockReport from "../../components/restockReport";
import SalesReport from "../../components/salesReport";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * @typedef {Object} MenuItem
 * @param {number} id - id for the menu item.
 * @param {string} name - name of the menu item.
 * @param {string} pic - picture for the menu item.
 * @param {number} price - pricing of the menu item.
 * @param {string} description - description for the menu item.
 * @param {boolean} food - checker if it is food or not.
 *  @param {boolean} seasonal - seasonal tag for menu item.
 */
interface MenuItem {
  id: number;
  name: string;
  pic: string;
  price: number;
  description: string;
  food: boolean;
  seasonal: boolean;
}

/**
 * Represents an item in the inventory.
 * @typedef {Object} InventoryItem
 * @property {string} ingredient - The name of the ingredient.
 * @property {number} max_capacity - The maximum capacity of the ingredient.
 * @property {number} current_capacity - The current capacity of the ingredient.
 * @property {number} ingredient_id - The unique identifier of the ingredient.
 */
interface InventoryItem {
  ingredient: string;
  max_capacity: number;
  current_capacity: number;
  ingredient_id: number;
}

/**
 * Represents a new menu item.
 * @typedef {Object} NewMenuItem
 * @property {string} name - The name of the menu item.
 * @property {number} calories - The calorie count of the menu item.
 * @property {string[]} ingredients - The list of ingredients in the menu item.
 * @property {number} price - The price of the menu item.
 * @property {boolean} seasonal - Indicates if the menu item is seasonal.
 * @property {string} seasonalDate - The date when the menu item is seasonal.
 * @property {string} type - The type of the menu item.
 */
interface NewMenuItem {
  name: string;
  calories: number;
  ingredients: string[];
  price: number;
  seasonal: false;
  seasonalDate: string | "";
  type: string;
}

const initialMenuItemState: NewMenuItem = {
  name: "",
  ingredients: [],
  calories: 0,
  price: 0,
  seasonal: false,
  seasonalDate: "",
  type: "",
};

/**
 * Represents a new drink item.
 * @typedef {Object} NewDrinkItem
 * @property {string} name - The name of the drink item.
 * @property {number} calories - The calorie count of the drink item.
 * @property {number} price - The price of the drink item.
 * @property {boolean} seasonal - Indicates if the drink item is seasonal.
 * @property {string} seasonalDate - The date when the drink item is seasonal.
 */
interface NewDrinkItem {
  name: string;
  calories: number;
  price: number;
  seasonal: false;
  seasonalDate: string | "";
}

const initialDrinkItem: NewDrinkItem = {
  name: "",
  calories: 0,
  price: 0,
  seasonal: false,
  seasonalDate: "",
};

/**
 * Represents a new utensil item.
 * @typedef {Object} NewUtensilItem
 * @property {string} producttype - The type of the utensil item.
 * @property {string} nameid - The unique identifier of the utensil item.
 * @property {number} quantity - The quantity of the utensil item.
 */
interface NewUtensilItem {
  producttype: string;
  nameid: string;
  quantity: number;
}

const initialUtensilItem: NewUtensilItem = {
  producttype: "",
  nameid: "",
  quantity: 0,
};

export default function Manager() {
  /**
   * States that check if the item is to be used or not, if they ar eclicked, or if they need to be used.
   */
  const { data: session, status } = useSession();
  const router = useRouter();
  const [buttonReportPop, setButtonReport] = useState(false);
  const [buttonInventoryPop, setButtonInventory] = useState(false);
  const [buttonProductUsagePop, setButtonProductUsage] = useState(false);
  const [buttonCommonPairingsPop, setButtonCommonPairings] = useState(false);
  const [buttonRestockReportPop, setButtonRestockReport] = useState(false);
  const [buttonExcessReportPop, setButtonExcessReport] = useState(false);
  const [buttonSalesReportPop, setButtonSalesReport] = useState(false);
  const [buttonFoodItemsPop, setButtonFoodItems] = useState(false);
  const [buttonDrinkItemsPop, setButtonDrinkItems] = useState(false);
  const [buttonUtensilItemsPop, setButtonUtensilItems] = useState(false);
  const [utensilTellerA, setUtensilTellerA] = useState(false);
  const [utensilTellerB, setUtensilTellerB] = useState(false);
  const [showAddItemForm, setShowAddItemForm] = useState(false); // State for showing/hiding the add item form
  const [fontSize, setFontSize] = useState<string>("16px"); // Default font size
  const [textSpeech, setTextSpeech] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("OrderHistory");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem>();
  const [productName, setProductName] = useState<string>("ProductTitle");
  const [inventory1, setInventory1] = useState([]);
  const [originalIngredient, setOriginalIngredient] = useState({});
  const [updatePrice, setProductPrice] = useState<number>(0);
  const [updateIngredients, setUpdateIngredients] = useState<string[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>();
  const [audio, setAudio] = useState<string>("null");
  //const [utensil, setUtensil] = useState<UtensilItems[]>();
  const [formData, setFormData] = useState({
    ingredient: "",
    maxCapacity: 0,
    currentCapacity: 0,
  });
  const [newMenuItem, setNewMenuItem] =
    useState<NewMenuItem>(initialMenuItemState);
  const [newDrinkItem, setNewDrinkItem] =
    useState<NewDrinkItem>(initialDrinkItem);
  const [newUtensilItem, setNewUtensilItem] =
    useState<NewUtensilItem>(initialUtensilItem);
  const [ingredientsInputValue, setIngredientsInputValue] = useState("");
  const [seasonalDate, setSeasonalDate] = useState("");
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
          console.log("DATA", data);
          if (data.role !== "manager" && data.role !== "admin") {
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

  /**
   * Checks if it can show the selected items.
   */
  useEffect(() => {
    setProductPrice(selectedMenuItem ? selectedMenuItem.price : 0);
    setProductName(selectedMenuItem ? selectedMenuItem.name : "Product Title");
  }, [selectedMenuItem]);

  /**
   * Hanles the submit form.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const itemToSend: NewMenuItem = {
      ...newMenuItem,
      seasonalDate: newMenuItem.seasonal ? seasonalDate : "2999-12-31",
    };

    if (itemToSend === null) return;
    // console.log("date", itemToSend.seasonalDate);
    try {
      const response = await fetch(`${process.env.URL}/api/food`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemToSend),
      });

      if (response.ok) {
        console.log("Menu item created successfully.");
        // Clear form fields after successful submission
        setNewMenuItem(initialMenuItemState);
        setIngredientsInputValue("");
        setSeasonalDate("");
      } else {
        console.error("Failed to create menu item.");
      }
    } catch (error) {
      console.error("An error occurred while creating the menu item:", error);
    }
  };

  /**
   * Handles the drink submissions.
   */
  const handleDrinkSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const itemToSend: NewDrinkItem = {
      ...newDrinkItem,
      seasonalDate: newDrinkItem.seasonal ? seasonalDate : "2999-12-31",
    };

    if (itemToSend === null) return;
    // console.log("date", itemToSend.seasonalDate);
    try {
      const response = await fetch(`${process.env.URL}/api/drink`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemToSend),
      });

      if (response.ok) {
        console.log("Menu item created successfully.");
        // Clear form fields after successful submission
        setNewMenuItem(initialMenuItemState);
        setIngredientsInputValue("");
        setSeasonalDate("");
      } else {
        console.error("Failed to create menu item.");
      }
    } catch (error) {
      console.error("An error occurred while creating the menu item:", error);
    }
  };

  /**
   * Handles Utensil Submission.
   */
  const handleUtensilSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const itemToSend: NewUtensilItem = {
      ...newUtensilItem,
    };

    if (itemToSend === null) return;
    // console.log("date", itemToSend.seasonalDate);
    try {
      const response = await fetch(`${process.env.URL}/api/utensil`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemToSend),
      });

      if (response.ok) {
        console.log("Menu item created successfully.");
        // Clear form fields after successful submission
        setNewMenuItem(initialMenuItemState);
        setIngredientsInputValue("");
        setSeasonalDate("");
      } else {
        console.error("Failed to create menu item.");
      }
    } catch (error) {
      console.error("An error occurred while creating the menu item:", error);
    }
  };

  /**
   * Updating the product.
   */
  const updateProduct = async () => {
    // Check if selectedMenuItem is null
    if (!selectedMenuItem) return;

    try {
      // Update selectedMenuItem properties
      selectedMenuItem.name = String(productName);
      selectedMenuItem.price = updatePrice;

      // If updateIngredients is not empty, update the ingredients of selectedMenuItem
      if (updateIngredients.length > 0) {
        const updatedData = {
          id: selectedMenuItem.id, // Assuming selectedMenuItem has an 'id' property
          ingredients: updateIngredients,
        };

        try {
          // console.log("HELLOOO");
          const response = await fetch(
            `${process.env.URL}/api/food/ingredients`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedData),
            }
          );

          if (response.ok) {
            // Clear updateIngredients
            setUpdateIngredients([]);
          } else {
            console.error("Failed to update ingredients:", response.statusText);
          }
        } catch (error) {
          console.error("Error updating ingredients:", error);
        }
      }
      // Make API call to update the product in the database
      const response = await fetch(`${process.env.URL}/api/products`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedMenuItem),
      });

      // Check if the API call was successful
      if (response.ok) {
        // Update selectedMenuItem within the menuItems list
        const updatedMenuItems = menuItems.map((item) => {
          if (item.id === selectedMenuItem.id) {
            return selectedMenuItem;
          } else {
            return item;
          }
        });

        // Update the menuItems state with the updated list
        setMenuItems(updatedMenuItems);
      } else {
        // Handle API error if needed
        console.error("Failed to update product:", response.statusText);
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error("Error updating product:", error);
    }
  };

  /**
   * Update inventory.
   */
  const updateInventory = async (
    newIngredient: string,
    newMaxCapacity: number,
    newCurrentCapacity: number,
    ingredient_id: number
  ) => {
    try {
      // console.log("selected", selectedMenuItem);
      // console.log("productName", productName);

      console.log([
        newIngredient,
        newMaxCapacity,
        newCurrentCapacity,
        ingredient_id,
      ]);
      // Make API call to update the product in the database
      const response = await fetch(`${process.env.URL}/api/inventory`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newIngredient,
          newMaxCapacity,
          newCurrentCapacity,
          ingredient_id,
        }),
      });

      // Check if the API call was successful
      if (response.ok) {
        // Update selectedMenuItem within the menuItems list
        // const updatedMenuItems = menuItems.map((item) => {
        //   if (item.id === selectedMenuItem.id) {
        //     return selectedMenuItem;
        //   } else {
        //     return item;
        //   }
        // });

        // // Update the menuItems state with the updated list
        // setMenuItems(updatedMenuItems);
        console.log("Inventory passes frontend, check backend");
      } else {
        // Handle API error if needed
        console.error("Failed to update product:", response.statusText);
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error("Error updating product:", error);
    }
  };

  /**
   * Handle the new add features to inventory.
   */
  const handleAddInventory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.URL}/api/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Clear form data upon successful submission
        setFormData({
          ingredient: "",
          maxCapacity: 0,
          currentCapacity: 0,
        });
      } else {
        // Handle error response
        console.error("Failed to submit form:", response.status);
        alert("Failed to submit form. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  /**
   * Handle the changes made to inventory.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: id === "maxCapacity" ? parseInt(value) : value,
    }));
  };

  // const handleAddFoodItem = async (newItem: any) => {
  //   try {
  //     const response = await fetch("${process.env.URL}/api/foodItems", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(newItem),
  //     });

  //     if (response.ok) {
  //       console.log("Successfully added inventory item");
  //       setShowAddItemForm(false); // Hide the add item form after successful addition
  //     } else {
  //       console.error("Failed to add inventory item");
  //     }
  //   } catch (error) {
  //     console.error("Error adding inventory item:", error);
  //   }
  // };

  // const handleAddDrinkItem = async (newItem: any) => {
  //   try {
  //     const response = await fetch("${process.env.URL}/api/drinkItems", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(newItem),
  //     });

  //     if (response.ok) {
  //       console.log("Successfully added inventory item");
  //       setShowAddItemForm(false); // Hide the add item form after successful addition
  //     } else {
  //       console.error("Failed to add inventory item");
  //     }
  //   } catch (error) {
  //     console.error("Error adding inventory item:", error);
  //   }
  // };

  // const handleAddUtensilItem = async (newItem: any) => {
  //   try {
  //     const response = await fetch("${process.env.URL}/api/utensilItems", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(newItem),
  //     });

  //     if (response.ok) {
  //       console.log("Successfully added inventory item");
  //       setShowAddItemForm(false); // Hide the add item form after successful addition
  //     } else {
  //       console.error("Failed to add inventory item");
  //     }
  //   } catch (error) {
  //     console.error("Error adding inventory item:", error);
  //   }
  // };
  /**
   * Handle the delete inventory inputs based on the id.
   */
  const handleDeleteInventory = (itemName: string) => {
    fetch(`${process.env.URL}/api/inventory`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Include any necessary headers such as authorization token
      },
      body: JSON.stringify({ itemName: itemName }),
    })
      .then((response) => {
        if (response.ok) {
          setInventory((prevInventory: InventoryItem[] | undefined) => {
            if (prevInventory) {
              return prevInventory.filter(
                (item) => item.ingredient !== itemName
              );
            }
            return prevInventory;
          });
        } else {
          console.error("Failed to delete item:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  };

  /**
   * effect of the menu
   */
  useEffect(() => {
    const fetchMenu = async () => {
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
      }
    };

    /**
     *
     */
    const fetchInventory = async () => {
      try {
        const response = await fetch(`${process.env.URL}/api/inventory`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        // console.log("data", data);
        setInventory(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    // const fetchUtensils = async () => {
    //   try {
    //     const response = await fetch("${process.env.URL}/api/utensilItems");
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch products");
    //     }
    //     const data = await response.json();
    //     // console.log("data", data);
    //     setUtensil(data);
    //   } catch (error) {
    //     console.error("Error fetching products:", error);
    //   }
    // };
    fetchInventory();
    fetchMenu();
    //fetchUtensils();
  }, []);

  return (
    showContent && (
      <main
        className="bg-[#1B0D0D] flex min-h-screen items-center justify-between gap-8"
        style={{ fontSize: `${fontSize}` }}
      >
        {/* sidebar */}
        <div className="bg-accent flex flex-col items-center gap-4 pb-8 min-h-screen mr-8 basis-1/6">
          <div className="flex-grow flex flex-col items-center gap-4">
            <Image src="/revs_logo.png" width={200} height={200} alt=""></Image>

            <button
              onClick={() => {
                setButtonProductUsage(true);
                setActiveTab("ProductUsage");
                setAudio("usageChart");
              }}
              className={defaultButton}
            >
              View Product Usage Chart
            </button>
            <button
              onClick={() => {
                setButtonCommonPairings(true);
                setActiveTab("CommonPairings");
                setAudio("pairChart");
              }}
              className={defaultButton}
            >
              View Common Pairings Chart
            </button>
            <button
              onClick={() => {
                setButtonRestockReport(true);
                setActiveTab("RestockReport");
              }}
              className={defaultButton}
            >
              View Restock Report Chart
            </button>
            <button
              onClick={() => {
                setButtonExcessReport(true);
                setActiveTab("ExcessReport");
              }}
              className={defaultButton}
            >
              View Excess Report Chart
            </button>
            <button
              onClick={() => {
                setButtonSalesReport(true);
                setActiveTab("SalesReport");
              }}
              className={defaultButton}
            >
              View Sales Report Chart
            </button>
            <button
              onClick={() => {
                setButtonInventory(true);
                setActiveTab("Inventory");
                setAudio("Inventory");
              }}
              className={defaultButton}
            >
              View/Edit Inventory
            </button>

            <button
              onClick={() => {
                setButtonInventory(true);
                setShowAddItemForm(true);
                setActiveTab("AddInventory");
              }}
              className={defaultButton}
            >
              Add Inventory Item
            </button>

            <button
              onClick={() => {
                setButtonFoodItems(true);
                setActiveTab("Menu");
              }}
              className={defaultButton}
            >
              View/Edit Menu{" "}
            </button>

            {/**Audio Players
          @return audio files
          @param activeTab true && button Pops */}
            {audio === "Inventory" && textSpeech && (
              <ViewInventoryPlayer autoPlay={true} />
            )}
            {buttonInventoryPop &&
              textSpeech &&
              activeTab === "AddInventory" && (
                <AddInventPlayer autoPlay={true} />
              )}
            {buttonFoodItemsPop && textSpeech && activeTab === "Menu" && (
              <EditMenuPlayer autoPlay={true} />
            )}
            {activeTab === "AddFoodItem" && textSpeech && (
              <ViewFoodItemPlayer autoPlay={true} />
            )}
            {activeTab === "AddDrinkItem" && textSpeech && (
              <AddDrinkItemPlayer autoPlay={true} />
            )}
            {activeTab === "AddDrinkItem" && textSpeech && (
              <AddDrinkItemPlayer autoPlay={true} />
            )}
            {audio === "UtensilItems" && textSpeech && (
              <ViewUtensilPlayer autoPlay={true} />
            )}
            {audio === "addUtensil" && textSpeech && (
              <AddUtensilPlayer autoPlay={true} />
            )}

            {audio === "usageChart" && textSpeech && (
              <ChartsPlayer autoPlay={true} />
            )}
            {audio === "pairChart" && textSpeech && (
              <PairChart autoPlay={true} />
            )}

            <button
              onClick={() => {
                setButtonUtensilItems(true);
                setActiveTab("AddFoodItem");
              }}
              className={defaultButton}
            >
              Add Food Item{" "}
            </button>
            <button
              onClick={() => {
                setActiveTab("AddDrinkItem");
              }}
              className={defaultButton}
            >
              Add Drink Item{" "}
            </button>
            <button
              onClick={() => {
                setActiveTab("AddUtensilItem");
                setAudio("addUtensil");
              }}
              className={defaultButton}
            >
              Add Utensil Item{" "}
            </button>
            <button
              onClick={() => {
                setButtonUtensilItems(true);
                setActiveTab("UtensilItems");
                setAudio("UtensilItems");
              }}
              className={defaultButton}
            >
              View Utensil Items
            </button>
            <div className="flex flex-col items-center gap-2">
              <a
                href="/menu"
                className={
                  "font-bold py-2 px-4 rounded bg-primary hover:bg-rose-300 text-red-950"
                }
                onMouseOver={() => setAudio("Menu")}
              >
                Menu
              </a>
              {audio === "Menu" && textSpeech && <MenuPlayer autoPlay={true} />}

              <a
                href="/manager"
                className={
                  "font-bold py-2 px-4 rounded bg-primary hover:bg-rose-300 text-red-950"
                }
                onMouseOver={() => setAudio("Refresh")}
              >
                Refresh
              </a>
              {audio === "Refresh" && textSpeech && (
                <RefreshPlayer autoPlay={true} />
              )}

              <a
                href="/"
                className={
                  "font-bold py-2 px-4 rounded bg-white hover:bg-gray-100 text-red-950"
                }
                onMouseOver={() => setAudio("LogOut")}
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
        <div className="flex-grow flex items-center justify-center h-screen py-16">
          {activeTab === "Inventory" && (
            <div className="text-sm overflow-auto flex items-start justify-center py-2 text-center w-full rounded-md">
              <div
                className="table-container overflow-y-auto"
                style={{ height: "calc(100vh - 100px)" }}
              >
                <table className="table-auto bg-[#2B1313] text-center">
                  <thead style={{ backgroundColor: "#7D2020" }}>
                    <tr style={{ backgroundColor: "#7D2020" }}>
                      <th className="text-white bg-[#7D2020]">Name</th>
                      <th className="text-white bg-[#7D2020]">Max Capacity</th>
                      <th className="text-white bg-[#7D2020]">
                        Current Capacity
                      </th>
                      <th className="text-white bg-[#7D2020]">Update</th>{" "}
                      <th className="text-white bg-[#7D2020]">Actions</th>{" "}
                      {/* New column for delete button */}
                    </tr>
                  </thead>
                  <tbody>
                    {inventory?.map((item, index) => {
                      const oldIngredient = item.ingredient;
                      return (
                        <tr key={index} style={{ backgroundColor: "#2B1313" }}>
                          <td>
                            <input
                              className="bg-[#2B1313] text-white flex items-center justify-center mb-2 px-4 py-2 text-center w-full rounded-md"
                              type="text"
                              value={item.ingredient}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                setInventory((prevInventory) => {
                                  // Create a copy of the previous inventory array or an empty array if prevInventory is undefined
                                  const newInventory = [
                                    ...(prevInventory ?? []),
                                  ];
                                  // Update the ingredient of the current item in the new inventory array
                                  newInventory[index].ingredient = newValue;
                                  // Return the updated inventory array
                                  return newInventory;
                                });
                              }}
                            />
                          </td>
                          <td>
                            <input
                              className="bg-[#2B1313] text-white flex items-center justify-center mb-2 px-4 py-2 text-center w-full rounded-md"
                              type="number"
                              value={item.max_capacity}
                              onChange={(e) => {
                                const newValue = parseInt(e.target.value);
                                setInventory((prevInventory) => {
                                  // Create a copy of the previous inventory array
                                  const newInventory = [
                                    ...(prevInventory ?? []),
                                  ];
                                  // Update the max_capacity of the current item in the new inventory array
                                  newInventory[index].max_capacity = newValue;
                                  // Return the updated inventory array
                                  return newInventory;
                                });
                              }}
                            />
                          </td>
                          <td>
                            <input
                              className="bg-[#2B1313] text-white flex items-center justify-center mb-2 px-4 py-2 text-center w-full rounded-md"
                              type="number"
                              value={item.current_capacity}
                              onChange={(e) => {
                                const newValue = parseInt(e.target.value);
                                setInventory((prevInventory) => {
                                  // Create a copy of the previous inventory array
                                  const newInventory = [
                                    ...(prevInventory ?? []),
                                  ];
                                  // Update the max_capacity of the current item in the new inventory array
                                  newInventory[index].current_capacity =
                                    newValue;
                                  // Return the updated inventory array
                                  return newInventory;
                                });
                              }}
                            />
                          </td>
                          <td>
                            <button
                              className={defaultButton}
                              onClick={() =>
                                updateInventory(
                                  item.ingredient,
                                  item.max_capacity,
                                  item.current_capacity,
                                  item.ingredient_id
                                )
                              }
                            >
                              Submit
                            </button>
                          </td>{" "}
                          <td>
                            <button
                              className={defaultButton}
                              onClick={() =>
                                handleDeleteInventory(item.ingredient)
                              }
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
            </div>
          )}
          {activeTab === "Menu" && (
            <div
              className="flex-grow grid grid-cols-2 gap-4 p-4 overflow-y-auto"
              style={{ height: "calc(100vh)" }}
            >
              {menuItems.map((item: MenuItem, index: number) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedMenuItem(item);
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
          {activeTab === "AddInventory" && (
            <div className="flex-grow gap-4">
              <form
                onSubmit={handleAddInventory}
                className="flex-grow text-white bg-[#2B1313] shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full"
              >
                <div className="mb-4">
                  <label
                    className="block text-700 text-sm font-bold mb-2"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="ingredient"
                    type="text"
                    placeholder="Ingredient"
                    value={formData.ingredient}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-700 text-sm font-bold mb-2"
                    htmlFor="maxCapacity"
                  >
                    Max Capacity
                  </label>
                  <input
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="maxCapacity"
                    type="number"
                    placeholder="Max Capacity"
                    value={formData.maxCapacity}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    className="block text-700 text-sm font-bold mb-2"
                    htmlFor="currentCapacity"
                  >
                    Current Capacity
                  </label>
                  <input
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="currentCapacity"
                    type="number"
                    placeholder="Current Capacity"
                    value={formData.currentCapacity}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button className={defaultButton} type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}
          {activeTab === "AddFoodItem" && (
            <form
              onSubmit={handleSubmit}
              className="flex-grow text-white bg-[#2B1313] shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full"
            >
              <div className="mb-4">
                <label
                  className="block text-700 text-sm font-bold mb-2"
                  htmlFor="productName"
                >
                  Product Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="productName"
                  type="text"
                  value={newMenuItem?.name}
                  onChange={(e) =>
                    setNewMenuItem((prevMenuItem) => ({
                      ...(prevMenuItem as NewMenuItem), // Type assertion here
                      name: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-700 text-sm font-bold mb-2"
                  htmlFor="productType"
                >
                  Product Type
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="productType"
                  type="text"
                  value={newMenuItem?.type}
                  onChange={(e) =>
                    setNewMenuItem((prevMenuItem) => ({
                      ...(prevMenuItem as NewMenuItem), // Type assertion here
                      type: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-700 text-sm font-bold mb-2"
                  htmlFor="ingredients"
                >
                  Ingredients (comma-separated)
                </label>
                <input
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="ingredients"
                  type="text"
                  value={ingredientsInputValue}
                  onChange={(e) => {
                    setIngredientsInputValue(e.target.value);
                    setNewMenuItem((prevMenuItem) => ({
                      ...(prevMenuItem as NewMenuItem), // Type assertion here
                      ingredients: e.target.value
                        .split(",")
                        .map((ingredient) => ingredient.trim()),
                    }));
                  }}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-700 text-sm font-bold mb-2"
                  htmlFor="calories"
                >
                  Calories
                </label>
                <input
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="calories"
                  type="number"
                  value={newDrinkItem?.calories}
                  onChange={(e) =>
                    setNewMenuItem((prevMenuItem) => ({
                      ...(prevMenuItem as NewMenuItem), // Type assertion here
                      calories: parseInt(e.target.value),
                    }))
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-700 text-sm font-bold mb-2"
                  htmlFor="price"
                >
                  Price
                </label>
                <input
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="price"
                  type="number"
                  value={newMenuItem?.price}
                  onChange={(e) =>
                    setNewMenuItem((prevMenuItem) => ({
                      ...(prevMenuItem as NewMenuItem), // Type assertion here
                      price: parseFloat(e.target.value),
                    }))
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-700 text-sm font-bold mb-2"
                  htmlFor="seasonal"
                >
                  Seasonal
                </label>
                <input
                  className="mr-2 leading-tight"
                  id="seasonal"
                  type="checkbox"
                  checked={newMenuItem.seasonal}
                  onChange={(e) =>
                    setNewMenuItem(
                      (prevMenuItem: NewMenuItem) =>
                        ({
                          ...prevMenuItem,
                          seasonal: e.target.checked,
                        } as NewMenuItem)
                    )
                  }
                />
              </div>

              {newMenuItem.seasonal && (
                <div className="mb-4">
                  <label
                    className="block text-700 text-sm font-bold mb-2"
                    htmlFor="seasonalDate"
                  >
                    Seasonal Date
                  </label>
                  <input
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="seasonalDate"
                    type="date"
                    value={seasonalDate}
                    onChange={(e) => setSeasonalDate(e.target.value)}
                    required={newMenuItem.seasonal}
                    disabled={!newMenuItem.seasonal}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <button className={defaultButton} type="submit">
                  Add Menu Item
                </button>
              </div>
            </form>
          )}
          {activeTab === "AddDrinkItem" && (
            <form
              onSubmit={handleDrinkSubmit}
              className="flex-grow text-white bg-[#2B1313] shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full"
            >
              <div className="mb-4">
                <label
                  className="block text-700 text-sm font-bold mb-2"
                  htmlFor="productName"
                >
                  Product Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="productName"
                  type="text"
                  value={newDrinkItem?.name}
                  onChange={(e) =>
                    setNewDrinkItem((prevMenuItem) => ({
                      ...(prevMenuItem as NewDrinkItem), // Type assertion here
                      name: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-700 text-sm font-bold mb-2"
                  htmlFor="calories"
                >
                  Calories
                </label>
                <input
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="calories"
                  type="number"
                  value={newDrinkItem?.calories}
                  onChange={(e) =>
                    setNewDrinkItem((prevMenuItem) => ({
                      ...(prevMenuItem as NewDrinkItem), // Type assertion here
                      calories: parseInt(e.target.value),
                    }))
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-700 text-sm font-bold mb-2"
                  htmlFor="price"
                >
                  Price
                </label>
                <input
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="price"
                  type="number"
                  value={newDrinkItem?.price}
                  onChange={(e) =>
                    setNewDrinkItem((prevMenuItem) => ({
                      ...(prevMenuItem as NewDrinkItem), // Type assertion here
                      price: parseFloat(e.target.value),
                    }))
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-700 text-sm font-bold mb-2"
                  htmlFor="seasonal"
                >
                  Seasonal
                </label>
                <input
                  className="mr-2 leading-tight"
                  id="seasonal"
                  type="checkbox"
                  checked={newDrinkItem.seasonal}
                  onChange={(e) =>
                    setNewDrinkItem(
                      (prevMenuItem: NewDrinkItem) =>
                        ({
                          ...prevMenuItem,
                          seasonal: e.target.checked,
                        } as NewDrinkItem)
                    )
                  }
                />
              </div>

              {newDrinkItem.seasonal && (
                <div className="mb-4">
                  <label
                    className="block text-700 text-sm font-bold mb-2"
                    htmlFor="seasonalDate"
                  >
                    Seasonal Date
                  </label>
                  <input
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="seasonalDate"
                    type="date"
                    value={seasonalDate}
                    onChange={(e) => setSeasonalDate(e.target.value)}
                    required={newDrinkItem.seasonal}
                    disabled={!newDrinkItem.seasonal}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <button className={defaultButton} type="submit">
                  Add Menu Item
                </button>
              </div>
            </form>
          )}
          {activeTab === "AddUtensilItem" && (
            <form
              onSubmit={handleUtensilSubmit}
              className="flex-grow text-white bg-[#2B1313] shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full"
            >
              <div className="mb-4">
                <label
                  className="block text-700 text-sm font-bold mb-2"
                  htmlFor="productName"
                >
                  Product Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="productName"
                  type="text"
                  value={newUtensilItem?.producttype}
                  onChange={(e) =>
                    setNewUtensilItem((prevMenuItem) => ({
                      ...(prevMenuItem as NewUtensilItem), // Type assertion here
                      producttype: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-700 text-sm font-bold mb-2"
                  htmlFor="nameid"
                >
                  Product ID
                </label>
                <input
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="nameid"
                  type="text"
                  value={newUtensilItem?.nameid}
                  onChange={(e) =>
                    setNewUtensilItem((prevMenuItem) => ({
                      ...(prevMenuItem as NewUtensilItem), // Type assertion here
                      nameid: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-700 text-sm font-bold mb-2"
                  htmlFor="quantity"
                >
                  quantity
                </label>
                <input
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="quantity"
                  type="number"
                  value={newUtensilItem?.quantity}
                  onChange={(e) =>
                    setNewUtensilItem((prevMenuItem) => ({
                      ...(prevMenuItem as NewUtensilItem), // Type assertion here
                      quantity: parseFloat(e.target.value),
                    }))
                  }
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <button className={defaultButton} type="submit">
                  Add Menu Item
                </button>
              </div>
            </form>
          )}
          {activeTab === "UtensilItems" && (
            <UtensilItems
              trigger={buttonUtensilItemsPop}
              setButtonUtensilItems={setButtonUtensilItems}
            />
          )}
          {activeTab === "ProductUsage" && (
            <ProductUsage
              trigger={buttonProductUsagePop}
              setButtonProductUsage={setButtonProductUsage}
            >
              <h3> My Product Usage </h3>
            </ProductUsage>
          )}
          {activeTab === "CommonPairings" && (
            <CommonPairings
              trigger={buttonCommonPairingsPop}
              setButtonCommonPairings={setButtonCommonPairings}
            >
              <h3> CommonPairings </h3>
            </CommonPairings>
          )}
          {activeTab === "RestockReport" && (
            <RestockReport
              trigger={buttonRestockReportPop}
              setButtonRestockReport={setButtonRestockReport}
            >
              <h3> RestockReport </h3>
            </RestockReport>
          )}
          {activeTab === "ExcessReport" && (
            <ExcessReport
              trigger={buttonExcessReportPop}
              setButtonExcessReport={setButtonExcessReport}
            >
              <h3> ExcessReport </h3>
            </ExcessReport>
          )}
          {activeTab === "SalesReport" && (
            <SalesReport
              trigger={buttonSalesReportPop}
              setButtonSalesReport={setButtonSalesReport}
            >
              <h3> SalesReport </h3>
            </SalesReport>
          )}
        </div>

        {/* Report Stuff */}
        <div className="flex flex-col items-center gap-4 p-4 min-h-screen h-full w-[30em]">
          <div className="bg-accent text-white flex items-center justify-center px-4 py-2 text-center w-full rounded-md">
            <DropDown
              onFontSizeChange={setFontSize}
              textToSpeech={setTextSpeech}
            ></DropDown>
          </div>
          {activeTab === "Menu" && (
            <div>
              <input
                className="bg-[#2B1313] text-white flex items-center justify-center mb-2 px-4 py-2 text-center w-full rounded-md"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <MenuItemPic
                name={selectedMenuItem?.name}
                pic={"/menuItems" + selectedMenuItem?.pic}
                price={selectedMenuItem?.price}
                description={selectedMenuItem?.description}
                seasonal={selectedMenuItem?.seasonal}
              ></MenuItemPic>
              <input
                className="bg-[#2B1313] text-white flex items-center justify-center mb-2 px-4 py-2 text-center w-full rounded-md"
                type="number"
                value={updatePrice}
                onChange={(e) => setProductPrice(parseFloat(e.target.value))}
              />
              <div className="flex-grow bg-[#2B1313] text-white text-md flex items-center mt-2 justify-center py-2 text-center w-full rounded-md">
                {selectedMenuItem
                  ? selectedMenuItem.description
                  : "Description"}
              </div>
              <div className="mb-4">
                <label
                  className="block text-700 text-sm font-bold mb-2"
                  htmlFor="ingredients"
                >
                  Ingredients (comma-separated)
                </label>
                <input
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="ingredients"
                  type="text"
                  value={updateIngredients.join(",")}
                  onChange={(e) => {
                    const ingredients = e.target.value
                      .split(",")
                      .map((ingredient) => ingredient.trim());
                    setUpdateIngredients(ingredients);
                    setNewMenuItem((prevMenuItem) => ({
                      ...(prevMenuItem as NewMenuItem),
                      ingredients: ingredients,
                    }));
                  }}
                  required
                />
              </div>

              <button className={defaultButton} onClick={() => updateProduct()}>
                Update Product
              </button>
            </div>
          )}
        </div>
        {/* <div className="bg-red-700 text-white flex items-center justify-center px-4 py-2 text-center w-full rounded-md">
                    Alert: Item Stock Low!
                </div> */}
      </main>
    )
  );
}
