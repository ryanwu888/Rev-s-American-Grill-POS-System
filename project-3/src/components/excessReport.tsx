import React, { useState, useEffect } from "react";
import "./productUsage.css";
// comment
interface ExcessData {
  ingredient: string;
  usagecount: number;
  totalstock: number;
}

interface ExcessReportProps {
  trigger: boolean;
  setButtonExcessReport: React.Dispatch<boolean>; // Define prop type for setButtonReport
  children?: React.ReactNode;
}

function ExcessReport(props: ExcessReportProps) {
  const [data, setData] = useState<ExcessData[]>([]);
  const [startTime, setStartTime] = useState("");

  const handleClose = () => {
    props.setButtonExcessReport(false);
  };

  const fetchExcessReport = async () => {
    try {
      const response = await fetch(`${process.env.URL}/api/excessReport`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startTime }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch excess report data");
      }
      // console.log("DATA", response.json())
      const responseData: ExcessData[] = await response.json();
      setData(responseData);
    } catch (error) {
      console.error("Error fetching excess report data:", error);
    }
  };

  // Fetch excess report data when the start time changes and the component is triggered
  useEffect(() => {
    if (props.trigger && startTime) {
      fetchExcessReport();
    }
  }, [props.trigger, startTime]);

  return props.trigger ? (
    <div className="outline">
      <div className="product-inner">
        <form onSubmit={fetchExcessReport} className="form-style">
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
                <th>Ingredient</th>
                <th>Usage Count</th>
                <th>Total Stock</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((d, i) => (
                  <tr key={i}>
                    <td>{d.ingredient}</td>
                    <td>{d.usagecount}</td>
                    <td>{d.totalstock}</td>
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

export default ExcessReport;
