"use client";

import { Customer } from "@/types/customer";
import { useEffect, useState } from "react";

const Revenues = () => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const thClassName =
    "border border-gray-400 sm:px-4 py-2 bg-gray-200 text-xs sm:text-base";
  const btnClassName = (color: string) => {
    return `bg-${color}-500 text-white px-1 text-sm sm:text-base sm:px-3 py-1 rounded hover:bg-${color}-600 hover:scale-105 active:scale-95`;
  };

  const tableHeader = [
    { className: thClassName, value: "თარიღი" },
    { className: thClassName, value: "სახელი" },
    { className: thClassName, value: "რედ." },
  ];

  const [data, setData] = useState<Customer[]>([]);

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

  const handleSaveClick = async (id: number) => {
    try {
      const response = await fetch("/api/customer/update-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name: editedName }),
      });

      if (!response.ok) {
        throw new Error("Failed to update customer");
      }
    } catch (error) {
      console.error("Error adding customer:", error);
    }
    setData((prevData) =>
      prevData.map((customer) =>
        customer.id === id ? { ...customer, name: editedName } : customer
      )
    );
    setEditingId(null);
    setEditedName("");
  };
  const handleCancelClick = () => {
    setEditingId(null);
    setEditedName("");
  };

  return (
    <div className="mt-20 mx-5">
      <table className="border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            {tableHeader.map((header, index) => (
              <th key={index} className={header.className}>
                {header.value}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((customer) => (
            <tr
              key={customer.id}
              className="border-b border-gray-300 hover:bg-gray-100"
            >
              <td className="px-1 py-2 text-center font-medium text-gray-700">
                <span className="hidden sm:inline">
                  {new Date(customer.created_at).toLocaleDateString("en-GB")}
                </span>
                <span className="sm:hidden text-xs">
                  {new Date(customer.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                </span>
              </td>
              <td className="sm:px-4 py-2 text-left text-gray-900 text-xs sm:text-base">
                {editingId === customer.id ? (
                  <input
                    type="text"
                    className="border sm:px-2 py-1 rounded w-full"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                ) : (
                  customer.name
                )}
              </td>
              <td className="px-1 py-2 text-center text-gray-900">
                {editingId === customer.id ? (
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-center">
                    <button
                      className={btnClassName("green")}
                      onClick={() => handleSaveClick(customer.id)}
                    >
                      Save
                    </button>
                    <button
                      className={btnClassName("gray")}
                      onClick={handleCancelClick}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className={btnClassName("blue")}
                    onClick={() => handleEditClick(customer)}
                  >
                    edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Revenues;
