import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";

// Define an interface for the row data
interface Employee {
  employeeid: number;
  name: string;
  contactinfo: string;
  role: string;
}

function Employees() {
  const [selectedEmployee, setSelectedEmployee] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [records, setRecords] = useState<Employee[]>([]);
  const [showNewEmployeeTable, setShowNewEmployeeTable] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${process.env.URL}/api/employee`);
        if (response.ok) {
          const data = await response.json();
          setEmployees(data);
          setRecords(data);
          console.log("Employees:", data);
        } else {
          console.error("Failed to fetch employees");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const columns = [
    {
      name: "ID",
      selector: (row: Employee) => row.employeeid,
      sortable: true,
    },

    {
      name: "Name",
      // Use the defined type for the row parameter
      selector: (row: Employee) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      // Use the defined type for the row parameter
      selector: (row: Employee) => row.contactinfo,
      sortable: true,
    },
    {
      name: "Role",

      // Use the defined type for the row parameter
      selector: (row: Employee) => row.role,
      sortable: true,
    },
  ];

  function handleFilter(event: React.ChangeEvent<HTMLInputElement>) {
    const newData = employees.filter((row) => {
      return row.name.toLowerCase().includes(event.target.value.toLowerCase());
    });
    setRecords(newData);
  }

  return (
    <div className="container mt-5" style={{ width: "100%", height: "100%" }}>
      <div className="container mt-5" style={{ width: "100%", height: "100%" }}>
        <div className="text-end">
          <div className="flex justify-between w-full">
            <div className="flex flex-column">{/* New button */}</div>

            {/* Filter input */}
            <div>
              <label htmlFor="userInput">Type here:</label>
              <input
                type="text"
                onChange={handleFilter}
                style={{
                  borderRadius:
                    "10px" /* adjust the value to change the roundness */,
                  border: "1px solid #000000" /* border color */,
                  padding: "8px" /* adjust padding as needed */,
                }}
              />
            </div>
          </div>
        </div>
        <div>
          <DataTable
            // columns={[{ field: 'id' }, { field: 'name', editable: true }]}
            columns={columns}
            data={records}
            fixedHeader
            pagination
          />
        </div>
      </div>
    </div>
  );
}
export default Employees;
