import React, { useState } from "react";

const ProfileEditableField = ({ label, value, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");

  const handleSave = () => {
    onSave(inputValue);
    setEditing(false);
  };

  return (
    <div className="mb-4 relative">
      <label className=" text-gray-700 font-medium flex justify-between items-center">
        {label}
        <button
          className="text-gray-500 hover:text-indigo-500"
          onClick={() => setEditing(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536M16.88 3.88a3 3 0 114.24 4.24l-9.192 9.192a4.5 4.5 0 01-1.591 1.04l-3.338 1.112 1.112-3.338a4.5 4.5 0 011.04-1.592l9.192-9.192z"
            />
          </svg>
        </button>
      </label>
      {editing ? (
        <div className="flex items-center mt-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border rounded p-2 w-full"
          />
          <button
            onClick={handleSave}
            className="ml-2 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
          >
            Simpan
          </button>
        </div>
      ) : (
        <p className="border rounded p-2 bg-gray-50 mt-2">
          {value || "Tidak tersedia"}
        </p>
      )}
    </div>
  );
};

export default ProfileEditableField;
