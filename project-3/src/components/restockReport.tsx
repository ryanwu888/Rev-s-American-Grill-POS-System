import React, { useState } from 'react';
import './productUsage.css';

interface RestockData {
    ingredient: string;
    current_capacity: number;
    max_capacity: number;
}

interface RestockReportProps {
    trigger: boolean;
    setButtonRestockReport: React.Dispatch<boolean>;
    children?: React.ReactNode;
}

function RestockReport(props: RestockReportProps) {
    const [data, setData] = useState<RestockData[]>([]);

    const handleClose = () => {
        props.setButtonRestockReport(false);
    };

    const fetchRestockReport = async () => {
        try {
            const response = await fetch(`${process.env.URL}/api/restockReport`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch restock report data');
            }

            const responseData: RestockData[] = await response.json();
            setData(responseData);
        } catch (error) {
            console.error('Error fetching restock report data:', error);
        }
    };

    // Fetch restock report data when the component mounts
    React.useEffect(() => {
        if (props.trigger) {
            fetchRestockReport();
        }
    }, [props.trigger]);

    return props.trigger ? (
        <div className="outline">
            <div className="product-inner">
                <form onSubmit={fetchRestockReport} className="form-style">
                    <button
                        className="bg-secondary hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
                        type="submit"
                    >
                        Run Report
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
                                <th>Current Capacity</th>
                                <th>Max Capacity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((d, i) => (
                                    <tr key={i}>
                                        <td>{d.ingredient}</td>
                                        <td>{d.current_capacity}</td>
                                        <td>{d.max_capacity}</td>
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

export default RestockReport;