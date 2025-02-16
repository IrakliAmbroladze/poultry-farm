"use client";
import { Customer } from "@/types/customer";
import { useEffect, useState } from "react";

const Revenues = () => {
  const [data, setData] = useState<Customer[]>([]);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/fetch-customers", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("No response");
        }

        const result: Customer[] = await response.json();

        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.error("Expected an array but got:", result);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (customer: Customer) => {
    setEditingId(customer.id);
    setEditedName(customer.name);
  };

  const handleSaveClick = async (id: number | string) => {
    if (id === "blank") {
      // Handle adding a new customer
      try {
        const response = await fetch("/api/add-customer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: editedName }),
        });

        if (!response.ok) {
          throw new Error("Failed to add customer");
        }

        // Add new customer to local state
        const newCustomer = await response.json();
        setData((prevData) => [...prevData, newCustomer]);
      } catch (error) {
        console.error("Error adding customer:", error);
      }
    } else {
      // Handle updating an existing customer
      setData((prevData) =>
        prevData.map((customer) =>
          customer.id === id ? { ...customer, name: editedName } : customer
        )
      );
    }

    setEditingId(null);
    setEditedName("");
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditedName("");
  };

  if (data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="mt-20">
      <table className="border-collapse border border-gray-300 w-full">
        {/* <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 px-4 py-2">Date</th>
            <th className="border border-gray-400 px-4 py-2">Name</th>
            <th className="border border-gray-400 px-4 py-2">Action</th>
          </tr>
        </thead> */}
        <tbody>
          {data.map((customer) => (
            <tr
              key={customer.id}
              className="border-b border-gray-300 hover:bg-gray-100"
            >
              <td className="px-4 py-2 text-center font-medium text-gray-700">
                {new Date(customer.created_at).toLocaleDateString("en-GB")}
              </td>
              <td className="px-4 py-2 text-left text-gray-900">
                {editingId === customer.id ? (
                  <input
                    type="text"
                    className="border px-2 py-1 rounded w-full"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                ) : (
                  customer.name
                )}
              </td>
              <td className="px-4 py-2 text-left text-gray-900">
                {editingId === customer.id ? (
                  <div className="flex space-x-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 hover:scale-105 active:scale-95"
                      onClick={() => handleSaveClick(customer.id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 hover:scale-105 active:scale-95"
                      onClick={handleCancelClick}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 hover:scale-105 active:scale-95"
                    onClick={() => handleEditClick(customer)}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
          <tr
            key="blank"
            className="border-b border-gray-300 hover:bg-gray-100 bg-stone-300"
          >
            <td className="px-4 py-2 text-center font-medium text-gray-700">
              {new Date().toLocaleDateString("en-GB")}
            </td>
            <td className="px-4 py-2 text-left text-gray-900">
              <input
                type="text"
                className="border px-2 py-1 rounded w-full"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            </td>
            <td className="px-4 py-2 text-left text-gray-900">
              {editingId === "blank" ? (
                <div className="flex space-x-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 hover:scale-105 active:scale-95"
                    onClick={() => handleSaveClick("blank")}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 hover:scale-105 active:scale-95"
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 hover:scale-105 active:scale-95"
                  onClick={() => setEditingId("blank")}
                >
                  Add
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Revenues;
