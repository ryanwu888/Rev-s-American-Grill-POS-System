import React, { useState } from "react";
import "./productUsage.css";

interface OrderData {
  food: string;
  drink: string;
  total_orders: number;
}

interface CommonPairingsProps {
  trigger: boolean;
  setButtonCommonPairings: React.Dispatch<boolean>; // Define prop type for setButtonReport
  children?: React.ReactNode;
}

function CommonPairings(props: CommonPairingsProps) {
  const [data, setData] = useState<OrderData[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleClose = () => {
    // Call the function passed from the parent component to close the report
    props.setButtonCommonPairings(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Run the query using the provided start and end times
    // Perform database query here
    console.log("Start Time:", startTime);
    console.log("End Time:", endTime);

    try {
      // Fetch data from the API route
      const response = await fetch(`${process.env.URL}/api/CommonPairings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startTime, endTime }),
      });

      // throw if failed
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return props.trigger ? (
    <div className="outline">
      <div className="product-inner">
        {/* submit button for start and end times */}
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
          >
            Run Query
          </button>
        </form>
        {/* close button to close the chart */}
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
                <th>Food Name</th>
                <th>Drink Name</th>
                <th>Total Orders</th>
              </tr>
            </thead>
            <tbody>
              {/* distribute data into a chart */}
              {data.length > 0 ? (
                data.map((d, i) => (
                  <tr key={i}>
                    <td>{d.food}</td>
                    <td>{d.drink}</td>
                    <td>{d.total_orders}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : null;
}

export default CommonPairings;
