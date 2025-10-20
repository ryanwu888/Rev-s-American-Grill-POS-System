"use client";
import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import ReactDOM, { useFormState } from "react-dom";
import Snowfall from "react-snowfall";
import { fetchWeatherApi } from "openmeteo";

import { defaultButton } from "../styles";
import MenuItemPic from "../../components/menuItemPic";
import MenuItemIcon from "../../components/menuItemIcon";
import DropDown from "../../components/DropDown";

/**
 * @typedef {Object} MenuItem
 * @property {string} name - The name of the menu item.
 * @property {string} pic - The path to the image of the item.
 * @property {number} price - The price of the menu item.
 * @property {string} description - A short description of the menu item.
 */

/**
 * Represents the menu interface for Revs American Grill. It displays different food categories
 * and their respective menu items, handles state changes for selected items, and interacts with
 * external APIs for weather conditions.
 *
 * @returns {JSX.Element} The Menu component.
 */

interface MenuItem {
  name: string;
  pic: string;
  price: number;
  description: string;
}

// EXAMPLE MENU ITEMS, IN REALITY THESE WOULD BE RETRIEVED FROM THE DATABASE
const menuItems: MenuItem[] = [
  {
    name: "Bacon Cheeseburger",
    pic: "/burger.jpg",
    price: 9.99,
    description: "A delicious bacon cheeseburger with all the fixings",
  },
  {
    name: "Crunchy Chicken Sandwich",
    pic: "/chickenBurger.jpg",
    price: 8.99,
    description: "A grilled chicken sandwich with lettuce, tomato, and mayo",
  },
  {
    name: "Caesar Salad",
    pic: "/unknown.jpg",
    price: 7.99,
    description: "A classic Caesar salad with croutons and Caesar dressing",
  },
];

/**
 * Main component representing the menu interface.
 * @returns {JSX.Element} The rendered component.
 */

export default function Menu() {
  const [foodView, setFoodView] = useState("Featured");
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );
  const [numItemsAdded, setNumItemsAdded] = useState(0);
  const [fontSize, setFontSize] = useState<string>("16px"); // Default font size
  const [showSnowfall, setShowSnowfall] = useState(false); // State variable to control Snowfall visibility
  const [temp, setTemp] = useState<number>(0);
  const [textSpeech, setTextSpeech] = useState(false);
  const [audio, setAudio] = useState<string>("null");

    /**
   * Updates the number of items added to the cart.
   * @param {string} quantity - The new quantity of items to set.
   */

  function handleSetItemNumber(quantity: string) {
    setNumItemsAdded(Number(quantity));
  }

    /**
   * Updates the font size state.
   * @param {string} newFontSize - The new font size.
   */
  const handleFontSizeChange = (newFontSize: string) => {
    setFontSize(newFontSize);
  };

  // 30.6280° N, 96.3344° W


    /**
   * Activates a visual effect for cold weather and displays a relevant alert.
   */
  const coldEffect = async () => {
    setShowSnowfall(true);

    setTimeout(() => {
      alert(
        `Brrrrr... it's freezing! Make sure to check out our seasonal hot chocolate!`
      );
      setShowSnowfall(false);
    }, 5000);
  };

    /**
   * Calls the weather API to get the current temperature and triggers coldEffect if necessary.
   */

  useEffect(() => {
    /**
     * Function to fetch weather data from the API.
     */
    const weatherAPI = async () => {
      const params = {
        latitude: 30.628,
        longitude: -96.3344,
        current: ["temperature_2m", "is_day"],
      };
      const url = "https://api.open-meteo.com/v1/forecast";
      const responses = await fetchWeatherApi(url, params);
      const res = responses[0];
      const current = res.current()!;
      const temperature = current.variables(0)!.value();
      setTemp(temperature);
      const threshold = 30;
      if (temperature < threshold) {
        coldEffect();
      }
    };

    weatherAPI();
  }, []); // Empty dependency array ensures the effect runs only once after initial render

  // Render method for the Menu component
  return (
    <main className="bg-[#1B0D0D] flex min-h-screen items-center justify-between flex-col px-6 py-4 text-sm">
      {showSnowfall && <Snowfall snowflakeCount={200} />}

      <div className="flex-grow flex items-stretch justify-between w-full h-full ">
        <div className="flex flex-col justify-between gap-2">
          <div className="bg-accent text-white flex items-center justify-center px-4 py-2 text-center rounded-md">
            <DropDown
              onFontSizeChange={handleFontSizeChange}
              textToSpeech={setTextSpeech}
            ></DropDown>
          </div>
          <h1 className="text-3xl italic">Revs American Grill</h1>

          <div className="flex items-center gap-4">
            <div>College Station Temperature: {temp.toFixed(2)}°C</div>
            <Image src="/revs_logo.png" alt="" width={75} height={75}></Image>
          </div>

          <div className="bg-[#7D2020] rounded-lg flex items-center justify-center py-2">
            <h2 className="font-bold">Burgers</h2>
          </div>
          {menuItems.map((item, index) => {
            return (
              <div
                className="bg-[#460606] rounded-lg flex items-center justify-between p-2 gap-4 "
                key={index}
              >
                <div className="w-[15vw]">
                  <p className="font-bold truncate">{item.name}</p>
                  <p className="text-neutral-100 text-xs italic truncate">
                    {item.description}
                  </p>
                </div>
                <div>${item.price}</div>
              </div>
            );
          })}
        </div>

        <div className="bg-[#4A2424] p-[1px] h-min-full my-8 mx-4"></div>

        <div className="flex-grow flex flex-col justify-between">
          <div className="flex-grow flex justify-between w-full">
            <div className="flex flex-col justify-between gap-2">
              <div className="bg-[#7D2020] rounded-lg flex items-center justify-center py-2">
                <h2 className="font-bold">Baskets</h2>
              </div>
              {menuItems.map((item, index) => {
                return (
                  <div
                    className="bg-[#460606] rounded-lg flex items-center justify-between p-2 gap-4"
                    key={index}
                  >
                    <div className="w-[15vw]">
                      <p className="font-bold truncate">{item.name}</p>
                      <p className="text-neutral-100 text-xs italic truncate">
                        {item.description}
                      </p>
                    </div>
                    <div>${item.price}</div>
                  </div>
                );
              })}
              <div className="bg-[#4A2424] p-[1px] m-2"></div>
            </div>
            <div className="bg-[#4A2424] p-[1px] h-min-full my-8 mx-2"></div>
            <div className="flex flex-col justify-between gap-2">
              <div className="bg-[#7D2020] rounded-lg flex items-center justify-center py-2">
                <h2 className="font-bold">Shakes & Sweets</h2>
              </div>
              {menuItems.map((item, index) => {
                return (
                  <div
                    className="bg-[#460606] rounded-lg flex items-center justify-between p-2 gap-4"
                    key={index}
                  >
                    <div className="w-[15vw]">
                      <p className="font-bold truncate">{item.name}</p>
                      <p className="text-neutral-100 text-xs italic truncate">
                        {item.description}
                      </p>
                    </div>
                    <div>${item.price}</div>
                  </div>
                );
              })}
              <div className="bg-[#4A2424] p-[1px] m-2"></div>
            </div>
            <div className="bg-[#4A2424] p-[1px] h-min-full my-8 mx-2"></div>
            <div className="flex flex-col justify-between gap-2">
              <div className="bg-[#7D2020] rounded-lg flex items-center justify-center py-2">
                <h2 className="font-bold">Salad Bar</h2>
              </div>
              {menuItems.map((item, index) => {
                return (
                  <div
                    className="bg-[#460606] rounded-lg flex items-center justify-between p-2 gap-4"
                    key={index}
                  >
                    <div className="w-[15vw]">
                      <p className="font-bold truncate">{item.name}</p>
                      <p className="text-neutral-100 text-xs italic truncate">
                        {item.description}
                      </p>
                    </div>
                    <div>${item.price}</div>
                  </div>
                );
              })}
              <div className="bg-[#4A2424] p-[1px] m-2"></div>
            </div>
          </div>

          <div className="flex-grow flex justify-between w-full mt-2">
            <div className="flex flex-col justify-between gap-2">
              <div className="bg-[#7D2020] rounded-lg flex items-center justify-center py-2">
                <h2 className="font-bold">Sandwiches</h2>
              </div>
              {menuItems.map((item, index) => {
                return (
                  <div
                    className="bg-[#460606] rounded-lg flex items-center justify-between p-2 gap-4"
                    key={index}
                  >
                    <div className="w-[15vw]">
                      <p className="font-bold truncate">{item.name}</p>
                      <p className="text-neutral-100 text-xs italic truncate">
                        {item.description}
                      </p>
                    </div>
                    <div>${item.price}</div>
                  </div>
                );
              })}
            </div>
            <div className="bg-[#4A2424] p-[1px] h-min-full my-8 mx-4"></div>
            <div className="flex flex-col justify-between gap-2">
              <div className="bg-[#7D2020] rounded-lg flex items-center justify-center py-2">
                <h2 className="font-bold">Beverages</h2>
              </div>
              {menuItems.map((item, index) => {
                return (
                  <div
                    className="bg-[#460606] rounded-lg flex items-center justify-between p-2 gap-4"
                    key={index}
                  >
                    <div className="w-[15vw]">
                      <p className="font-bold truncate">{item.name}</p>
                      <p className="text-neutral-100 text-xs italic truncate">
                        {item.description}
                      </p>
                    </div>
                    <div>${item.price}</div>
                  </div>
                );
              })}
            </div>
            <div className="bg-[#4A2424] p-[1px] h-min-full my-8 mx-4"></div>
            <div className="flex flex-col justify-between gap-2">
              <div className="bg-[#7D2020] rounded-lg flex items-center justify-center py-2">
                <h2 className="font-bold">Sauces</h2>
              </div>
              {menuItems.map((item, index) => {
                return (
                  <div
                    className="bg-[#460606] rounded-lg flex items-center justify-between p-2 gap-4"
                    key={index}
                  >
                    <div className="w-[15vw]">
                      <p className="font-bold truncate">{item.name}</p>
                      <p className="text-neutral-100 text-xs italic truncate">
                        {item.description}
                      </p>
                    </div>
                    <div>${item.price}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
