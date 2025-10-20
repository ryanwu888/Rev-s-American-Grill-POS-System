import React, { useState } from "react";
import "./productUsage.css"; // Ensure you have corresponding CSS for styling
// randmo commen
interface SalesData {
  item: string;
  total_sales: number;
}

interface SalesReportProps {
  trigger: boolean;
  setButtonSalesReport: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}

function SalesReport(props: SalesReportProps) {
  const [data, setData] = useState<SalesData[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    props.setButtonSalesReport(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.URL}/api/salesReport`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startTime, endTime }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const responseData: SalesData[] = await response.json();
      console.log("DATA", responseData);
      setData(responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return props.trigger ? (
    <div className="outline">
      <div className="product-inner">
        <form onSubmit={handleSubmit} className="form-style">
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
        <button
          className="bg-secondary hover:bg-red-800 text-white font-bold py-2 px-4 rounded closer"
          onClick={handleClose}
        >
          Close
        </button>
        <div style={{ padding: "25px" }}>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((d, i) => (
                  <tr key={i}>
                    <td>{d.item}</td>
                    <td>{d.total_sales}</td>
                  </tr>
                ))
              ) : (
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

export default SalesReport;
