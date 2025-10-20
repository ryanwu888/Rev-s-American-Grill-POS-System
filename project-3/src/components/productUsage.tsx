import React, { useState } from "react";
import "./productUsage.css";

/**
 * Represents the data structure of each product entry.
 * @typedef {Object} ProductData
 * @property {string} ingredient - The name of the ingredient.
 * @property {number} total_used - The total quantity of the ingredient used.
 */
interface ProductData {
  ingredient: string;
  total_used: number;
}

/**
 * Props for the ProductUsage component.
 * @typedef {Object} ProductUsageProps
 * @property {boolean} trigger - A boolean value to trigger the display of the ProductUsage component.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setButtonProductUsage - Function to update the state controlling the visibility of the ProductUsage component.
 * @property {React.ReactNode} [children] - Optional children elements to be rendered inside the ProductUsage component.
 */
interface ProductUsageProps {
  trigger: boolean;
  setButtonProductUsage: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}

/**
 * Component that displays product usage data.
 * @param {ProductUsageProps} props - The props for the ProductUsage component.
 * @returns {React.ReactNode} A table connected to the database with editability.
 * @author Ethan Wenthe & Ryan
 */
function ProductUsage(props: ProductUsageProps) {
  /**
   * State variables for product data, start time, end time, loading state, and error message.
   */
  const [data, setData] = useState<ProductData[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Function to close the ProductUsage component.
   */
  const handleClose = () => {
    props.setButtonProductUsage(false);
  };

  /**
   * Function to handle form submission and fetch product usage data.
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.URL}/api/productUsage`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startTime, endTime }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: ProductData[] = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Render the ProductUsage component if triggered.
   */
  return props.trigger ? (
    <div className="outline">
      <div className="product-inner">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="startTime">Start Time:</label>
            <input
              className="bg-[#2B1313] text-white flex items-center justify-center mb-2 px-4 py-2 text-center w-full rounded-md"
              type="text"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="YYYY-MM-DD HH:MM:SS"
              required
            />
          </div>
          <div>
            <label htmlFor="endTime">End Time:</label>
            <input
              className="bg-[#2B1313] text-white flex items-center justify-center mb-2 px-4 py-2 text-center w-full rounded-md"
              type="text"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="YYYY-MM-DD HH:MM:SS"
              required
            />
          </div>
          <button
            className="bg-secondary hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
            type="submit"
            disabled={loading}
          >
            Run Query
          </button>
          {loading && <span>Loading...</span>}
          {error && <span>{error}</span>}
        </form>
        {/**
         * close button to close the chart
         */}
        <button
          className="bg-secondary hover:bg-red-800 text-white font-bold py-2 px-4 rounded closer"
          onClick={handleClose}
        >
          {" "}
          close{" "}
        </button>
        <div style={{ padding: "25px" }}>
          <table>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Total Used</th>
              </tr>
            </thead>
            <tbody>
              {/**
               * distribute data into a chart
               * data.map(ingredient, total_used)
               */}
              {data.map((d, i) => (
                <tr key={i}>
                  <td>{d?.ingredient}</td>
                  <td>{d?.total_used}</td>
                </tr>
              ))}
              {/**
               * if no data, don't try
               */}
              {data.length === 0 && (
                <tr>
                  <td colSpan={2}>No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : null;
}

export default ProductUsage;
