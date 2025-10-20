"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { defaultButton } from "../styles";
import MenuItemPic from "../../components/menuItemPic";
import KitchenOrderPic from "../../components/kitchenOrderPic";
import OrderItemIcon from "../../components/orderItemIcon";
import MenuItemIcon from "../../components/menuItemIcon";
import DropDown from "../../components/DropDown";
import CompleteOrderPlayer from "../../components/audioPlayers/cashier/completeOrderPlayer";
import DeleteOrderPlayer from "../../components/audioPlayers/cashier/deleteOrderPlayer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * Represents a kitchen order.
 * @typedef {Object} Order
 * @property {number} id - The unique identifier of the order.
 * @property {OrderItem[]} products - The list of items in the order.
 * @property {boolean} complete - Indicates if the order is complete.
 * @property {Date} time - The time the order was placed.
 */
interface Order {
  id: number;
  products: OrderItem[];
  complete: boolean;
  time: Date;
}

/**
 * Represents an item in a kitchen order.
 * @typedef {Object} OrderItem
 * @property {string} name - The name of the item.
 * @property {number} quantity - The quantity of the item.
 */
interface OrderItem {
  name: string;
  quantity: number;
}

export default function Kitchen() {
  const { data: session, status } = useSession();
  const router = useRouter();

  /**
   * allows food to be viewed.
   */
  const [foodView, setFoodView] = useState("Featured");
  /**
   * Menu view.
   */
  const [selectedMenuItem, setSelectedOrder] = useState(null as Order | null);
  /**
   * setting number of items by default.
   */
  const [numItemsAdded, setNumItemsAdded] = useState(0);
  /**
   * setting default font size.
   */
  const [fontSize, setFontSize] = useState<string>("16px");
  /**
   * setting the orders list.
   */
  const [orders, setOrders] = useState<Order[]>([]);
  /**
   * speech checker use state.
   */
  const [textSpeech, setTextSpeech] = useState(false);
  /**
   * indicates if audio is set.
   */
  const [audio, setAudio] = useState<string>("null");
  /**
   * checker for whether or not to show kitchen orders.
   */
  const [showKitchenOrders, setShowKitchenOrders] = useState(false);
  /**
   * setter of login page.
   */
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  /**
   * authentication checker
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

  useEffect(() => {
    // Redirect to login page if redirectToLogin is true
    if (redirectToLogin && status === "unauthenticated") {
      router.push("/");
    }
  }, [redirectToLogin, status]);

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
          if (data.role === "customer") {
            // Redirect to home page if the user is a customer
            router.push("/");
          } else {
            // Set showKitchenOrders to true if the user is not a customer
            setShowKitchenOrders(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching user role:", error);
        });
    }
  }, [status, router]);

  useEffect(() => {
    // Make a GET request to the API endpoint
    fetch(`${process.env.URL}/api/orders`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json(); // Parse JSON response
      })
      .then((data: any) => {
        // Map the response data to the Order interface
        // console.log(data);
        const formattedOrders: Order[] = data.map((order: any) => ({
          id: order.id,
          complete: order.complete,
          time: new Date(order.time), // Assuming 'time' is a string representation of Date
          products: order.products.map((product: any) => ({
            name: product.name,
            quantity: product.quantity,
          })),
        }));
        // Update the state with the formatted orders
        setOrders(formattedOrders);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  }, []);
  // Render loading state while session status is loading
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  /**
   * setting the item number when changed.
   * @param {string} quantity - number of items it is set to.
   */
  function handleSetItemNumber(quantity: string) {
    setNumItemsAdded(Number(quantity));
  }

  /**
   * Sets the font size.
   * @param {string} newFontSize - new font size
   */
  const handleFontSizeChange = (newFontSize: string) => {
    setFontSize(newFontSize);
  };

  /**
   * completes the order for kitchen view.
   * @param {string} id - id of the item
   */
  function completeOrder(id?: Number) {
    if (id !== undefined) {
      // Make a PUT request to mark the order as complete
      fetch(`${process.env.URL}/api/orders/${id}/complete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to mark order as complete");
          }
          // Update the state variable with the filtered orders
          const updatedOrders = orders.filter((order) => order.id !== id);
          setOrders(updatedOrders);
        })
        .catch((error) => {
          console.error("Error completing order:", error);
          // Handle error here, if needed
        });
    }
  }

  /**
   * Function to handle quantity change.
   * @param {string} index - id of the item
   * @param {string} newValue - new value that it is set to
   */

  const handleQuantityChange = (index: number, newValue: string) => {
    if (selectedMenuItem) {
      const updatedProducts = [...selectedMenuItem.products];
      updatedProducts[index].quantity = parseInt(newValue);
      setSelectedOrder({ ...selectedMenuItem, products: updatedProducts });
    }
  };

  /**
   *  Function to handle delete.
   * @param {string} orderId - id of the item
   * @param {string} index - nindex that shows where to delete
   */
  const handleDelete = (orderId: number, index: number) => {
    // Find the index of the order with the specified orderId
    const orderIndex = orders.findIndex((order) => order.id === orderId);

    // Check if the order with the specified orderId exists
    if (orderIndex !== -1) {
      // Make a copy of the orders array to avoid mutating the original state
      const updatedOrders = [...orders];

      // Make a copy of the products array within the specified order
      const updatedProducts = [...updatedOrders[orderIndex].products];

      // Check if the index is within bounds
      if (index >= 0 && index < updatedProducts.length) {
        // Remove the product at the specified index from the products array
        updatedProducts.splice(index, 1);

        // Update the order with the modified products array
        updatedOrders[orderIndex].products = updatedProducts;

        // Update the state with the modified orders array
        setOrders(updatedOrders);
      }
    }
  };

  return (
    <main
      className="bg-[#1B0D0D] flex min-h-screen items-center justify-between"
      style={{ fontSize: `${fontSize}` }}
    >
      {/* sidebar */}
      <div className="bg-accent flex flex-col items-center gap-4 pb-8 min-h-screen">
        <div className="flex-grow flex flex-col items-center gap-4">
          <Image src="/revs_logo.png" width={200} height={200} alt=""></Image>
        </div>

        {session && (
          <div>
            {session.user && <p className="text-white">{session.user.email}</p>}
            <a
              href="/"
              className={
                "font-bold py-2 px-4 rounded bg-white hover:bg-gray-100 text-red-950"
              }
            >
              Log Out
            </a>
          </div>
        )}
      </div>

      {/* Order History Trends */}
      <div className="flex-grow grid grid-cols-4 gap-4">
        {showKitchenOrders &&
          orders.map((item, index) => {
            return (
              item.complete === false && (
                <div key={index} onClick={() => setSelectedOrder(item)}>
                  <OrderItemIcon id={item.id}></OrderItemIcon>
                </div>
              )
            );
          })}
      </div>

      {/* View Menu Item Specifics */}
      <div className="flex flex-col items-center gap-4 p-4 min-h-screen w-[30em]">
        <div className="bg-accent text-white flex items-center justify-center px-4 py-2 text-center w-full rounded-md">
          <DropDown
            onFontSizeChange={handleFontSizeChange}
            textToSpeech={setTextSpeech}
          ></DropDown>
        </div>

        <KitchenOrderPic id={selectedMenuItem?.id}></KitchenOrderPic>

        <div className="flex-grow bg-[#2B1313] text-white text-md flex items-start justify-center py-2 text-center w-full rounded-md">
          <table className="table-auto">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {selectedMenuItem?.products.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(selectedMenuItem.id, index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className=" flex items-center justify-end gap-2 p-2 w-full">
          <button
            className={defaultButton + " text-xs"}
            onClick={() => {
              completeOrder(selectedMenuItem?.id);
              setAudio("CompleteOrder");
            }}
          >
            Complete Order
          </button>
          {audio === "CompleteOrder" && textSpeech && (
            <CompleteOrderPlayer autoPlay={true} />
          )}

          <button
            className={defaultButton + " text-xs"}
            onClick={() => {
              completeOrder(selectedMenuItem?.id);
              setAudio("DeleteOrer");
            }}
          >
            Delete Order
          </button>
          {audio === "DeleteOrer" && textSpeech && (
            <DeleteOrderPlayer autoPlay={true} />
          )}
        </div>
      </div>
    </main>
  );
}
