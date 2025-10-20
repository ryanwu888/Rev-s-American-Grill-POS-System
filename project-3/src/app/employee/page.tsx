"use client";
import Image from "next/image";
import DropDown from "../../components/DropDown";
import { defaultButton } from "../styles";
import Employees from "../../components/Employees";
import { useState, useEffect, useRef } from "react";
import LogoutPlayer from "../../components/audioPlayers/manager/logoutPlayer";
import RefreshPlayer from "../../components/audioPlayers/manager/refreshPlayer";
import ViewEmployeePlayer from "../../components/audioPlayers/manager/viewEmployeePlayer";
import AddEmployeePlayer from "../../components/audioPlayers/manager/addEmployeePlayer";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * Represents an employee.
 * @typedef {Object} Employee
 * @property {number} employeeid - The unique identifier of the employee.
 * @property {string} name - The name of the employee.
 * @property {string} contactinfo - The contact information of the employee.
 * @property {string} role - The role of the employee.
 */
interface Employee {
  employeeid: number;
  name: string;
  contactinfo: string;
  role: string;
}
/**
 * Employee component for managing employee data.
 * @returns JSX.Element
 */
export default function Employee() {
  const { data: session, status } = useSession();
  const router = useRouter();

  /**
   * Represents the state of the active tab.
   */
  const [activeTab, setActiveTab] = useState<string>("Employees");

  /**
   * Represents the font size state.
   */
  const [fontSize, setFontSize] = useState<string>("16px");

  /**
   * Represents the list of employees.
   */
  const [employees, setEmployees] = useState<Employee[]>([]);

  /**
   * Represents the state for displaying employee buttons.
   */
  const [buttonEmployeePop, setButtonEmployees] = useState(false);

  /**
   * Represents the index of the employee currently being edited.
   */
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  /**
   * Represents the form data for adding/editing an employee.
   */
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    contactinfo: "",
    role: "",
  });

  /**
   * Function to handle font size change.
   * @param newFontSize - New font size value.
   */
  const handleFontSizeChange = (newFontSize: string) => {
    setFontSize(newFontSize);
  };
  /**
   * State to manage text-to-speech feature.
   */
  const [textSpeech, setTextSpeech] = useState(false);

  /**
   * The authentication status of the user.
   */
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [showContent, setShowContent] = useState(false);

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
          if (data.role !== "admin") {
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
   * Represents the state for managing audio playback.
   */
  const [audio, setAudio] = useState<string>("null");
  /**
   * Effect hook to fetch employees data.
   */
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${process.env.URL}/api/employee`);
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees(); // Call the fetchEmployees function when the component mounts
  }, []); // Empty dependency array to ensure the effect runs only once when the component mounts

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${process.env.URL}/api/employee`);
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      const data = await response.json();
      // console.log("data", data);
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  /**
   * Handles the submission of the employee addition form.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleAddEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.URL}/api/employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Clear form data upon successful submission
        setFormData({
          id: 0,
          name: "",
          contactinfo: "",
          role: "",
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
   * Handles the editing of an employee.
   * @param {number} id - The ID of the employee to edit.
   */
  const handleEditEmployee = async (id: number) => {
    try {
      const updatedEmployee = employees.find(
        (employee) => employee.employeeid === id
      );
      if (!updatedEmployee) {
        console.error("Employee not found");
        return;
      }

      // Update `formData` state with the details of the employee being edited
      setFormData((prevFormData) => ({
        ...prevFormData,
        id: updatedEmployee.employeeid,
        name: updatedEmployee.name,
        contactinfo: updatedEmployee.contactinfo,
        role: updatedEmployee.role,
      }));

      console.log("Updated formData:", formData); // Check formData before sending the request

      // Send updated employee data to the server
      const response = await fetch(`${process.env.URL}/api/employee/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Use formData to send updated employee data
      });

      if (response.ok) {
        fetchEmployees();
        alert("Employee updated successfully!");
        setEditingIndex(-1); // Reset editingIndex after successful update
        setFormData({ id: 0, name: "", contactinfo: "", role: "" }); // Clear formData after successful update
      } else {
        console.error("Failed to update employee:", response.status);
        alert("Failed to update employee. Please try again later.");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  /**
   * Handles the deletion of an employee.
   * @param {number} id - The ID of the employee to delete.
   */
  const handleDeleteEmployee = (id: number) => {
    fetch(`${process.env.URL}/api/employee/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Include any necessary headers such as authorization token
      },
    })
      .then((response) => {
        if (response.ok) {
          setEmployees((prevEmployees) => {
            return prevEmployees.filter(
              (employee) => employee.employeeid !== id
            );
          });
        } else {
          console.error("Failed to delete employee:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error deleting employee:", error);
      });
  };

  /**
   * Saves changes in input fields for edit.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  /**
   * Saves changes for the dropdown of roles.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  fetchEmployees();
  return (
    showContent && (
      <main className="bg-[#1B0D0D] flex min-h-screen items-center justify-between gap-8">
        {/* sidebar */}
        <div className="bg-accent flex flex-col items-center gap-4 pb-8 min-h-screen mr-8">
          <div className="flex-grow flex flex-col items-center gap-4">
            <Image src="/revs_logo.png" width={200} height={200} alt="" />
            <div className="flex flex-col items-center gap-2"></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => {
                setButtonEmployees(true);
                setActiveTab("Employees");
                setAudio("viewEmployee");
              }}
              className={defaultButton}
            >
              View Employee
            </button>
            {audio === "viewEmployee" && textSpeech && (
              <ViewEmployeePlayer autoPlay={true} />
            )}

            <button
              onClick={() => {
                setActiveTab("AddEmployee");
                setAudio("addEmployee");
              }}
              className={defaultButton}
            >
              Add Employee
            </button>
            {audio === "addEmployee" && textSpeech && (
              <AddEmployeePlayer autoPlay={true} />
            )}

            <a
              href="/employee"
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

        {/* Order History Trends */}
        <div className="flex-grow flex items-center justify-center text-3xl h-screen py-16">
          {activeTab === "AddEmployee" && (
            <div className="flex-grow gap-4">
              <form
                onSubmit={handleAddEmployee}
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
                    id="name"
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-700 text-sm font-bold mb-2"
                    htmlFor="contactinfo"
                  >
                    Contact Info
                  </label>
                  <input
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="contactinfo"
                    type="text"
                    placeholder="contactinfo"
                    value={formData.contactinfo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    className="block text-700 text-sm font-bold mb-2"
                    htmlFor="role"
                  >
                    Role
                  </label>
                  <select
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="role"
                    value={formData.role}
                    onChange={handleSelectChange}
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="cashier">Cashier</option>
                    <option value="manager">Manager</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <button className={defaultButton} type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "Employees" && (
            <div className="text-sm overflow-auto items-start justify-center py-2 text-center w-full rounded-md">
              <div
                className="table-container overflow-y-auto"
                style={{ height: "calc(100vh - 200px)" }}
              >
                <table
                  className="table-auto bg-[#2B1313] text-center"
                  style={{ borderCollapse: "collapse", width: "70%" }}
                >
                  <thead style={{ backgroundColor: "#7D2020" }}>
                    <tr style={{ backgroundColor: "#7D2020" }}>
                      <th
                        className="text-white bg-[#7D2020]"
                        style={{ border: "1px solid white" }}
                      >
                        ID
                      </th>
                      <th
                        className="text-white bg-[#7D2020]"
                        style={{ border: "1px solid white" }}
                      >
                        Name
                      </th>
                      <th
                        className="text-white bg-[#7D2020]"
                        style={{ border: "1px solid white" }}
                      >
                        Contact Info
                      </th>
                      <th
                        className="text-white bg-[#7D2020]"
                        style={{ border: "1px solid white" }}
                      >
                        Role
                      </th>
                      <th
                        className="text-white bg-[#7D2020]"
                        style={{ border: "1px solid white" }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees?.map((employee, index) => (
                      <tr
                        key={employee.employeeid}
                        style={{ backgroundColor: "#2B1313" }}
                      >
                        <td style={{ border: "1px solid white" }}>
                          {employee.employeeid}
                        </td>
                        <td style={{ border: "1px solid white" }}>
                          {editingIndex === index ? (
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                              style={{ color: "#000" }}
                            />
                          ) : (
                            employee.name
                          )}
                        </td>
                        <td style={{ border: "1px solid white" }}>
                          {editingIndex === index ? (
                            <input
                              type="text"
                              value={formData.contactinfo}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  contactinfo: e.target.value,
                                })
                              }
                              style={{ color: "#000" }}
                            />
                          ) : (
                            employee.contactinfo
                          )}
                        </td>
                        <td style={{ border: "1px solid white" }}>
                          {editingIndex === index ? (
                            <select
                              value={formData.role}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  role: e.target.value,
                                })
                              }
                              style={{ color: "#000" }}
                            >
                              <option value="cashier">Cashier</option>
                              <option value="manager">Manager</option>
                              <option value="customer">Customer</option>
                            </select>
                          ) : (
                            employee.role
                          )}
                        </td>
                        <td
                          style={{
                            border: "1px solid white",
                            display: "flex",
                            justifyContent: "space-evenly",
                            width: "100%",
                          }}
                        >
                          {editingIndex === index ? (
                            <button
                              className={defaultButton}
                              onClick={() =>
                                handleEditEmployee(employee.employeeid)
                              }
                            >
                              Save
                            </button>
                          ) : (
                            <React.Fragment>
                              <button
                                className={defaultButton}
                                onClick={() => setEditingIndex(index)}
                              >
                                Edit
                              </button>
                              <button
                                className={defaultButton}
                                onClick={() =>
                                  handleDeleteEmployee(employee.employeeid)
                                }
                              >
                                Delete
                              </button>
                            </React.Fragment>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        {/* Report Stuff */}
        <div className="flex flex-col items-center gap-4 p-4 min-h-screen">
          <div className="bg-accent text-white flex items-center justify-center px-4 py-2 text-center w-full rounded-md">
            <DropDown
              onFontSizeChange={handleFontSizeChange}
              textToSpeech={setTextSpeech}
            ></DropDown>
          </div>
        </div>
      </main>
    )
  );
}
