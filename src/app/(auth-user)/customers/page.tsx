"use client";

import { Customer } from "@/types/customer";
import { useEffect, useState } from "react";

const Customers = () => {
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [addName, setAddName] = useState("");
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
    if (editedName === "") {
      alert("ცარიელ სახელს ვერ შეინახავ!");
      return;
    }
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

  const handleAddClick = async () => {
    try {
      const response = await fetch("/api/customer/add-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: addName }),
      });

      if (!response.ok) {
        throw new Error("Failed to add customer");
      }

      setData((prevData) => [
        ...prevData,
        {
          id: prevData[prevData.length - 1].id + 1,
          created_at: new Date().toLocaleDateString("ka-GE"),
          name: addName,
          description: "",
          email: "",
          user_id: "",
        },
      ]);
    } catch (error) {
      console.error("Error adding customer:", error);
    }
    setIsCustomerFormOpen(!isCustomerFormOpen);
  };
  const handleAddCustomerClick = () => {
    setIsCustomerFormOpen(!isCustomerFormOpen);
  };
  const handleCloseClick = () => {
    setIsCustomerFormOpen(!isCustomerFormOpen);
  };

  return (
    <div className="mt-20 mx-5">
      {isCustomerFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-90 flex justify-center items-center z-50">
          <div className="bg-[#f0eff4] p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg text-green-700 font-semibold">
              დაამატე მომხმარებელი
            </p>
            <p className="m-2">
              <input
                type="text"
                className="border border-gray-600 rounded-md"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
              />
            </p>
            <div className="flex gap-1 justify-center">
              <button
                className={`${btnClassName("green")} mb-2`}
                onClick={() => handleAddClick()}
              >
                add
              </button>
              <button
                className={`${btnClassName("gray")} mb-2`}
                onClick={() => handleCloseClick()}
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        className={`${btnClassName("green")} mb-2`}
        onClick={() => handleAddCustomerClick()}
      >
        add customer
      </button>
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
                <span className="sm:hidden text-sm">
                  {new Date(customer.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                </span>
              </td>
              <td className="sm:px-4 py-2 text-left text-gray-900 text-sm sm:text-base bg-red">
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

export default Customers;
