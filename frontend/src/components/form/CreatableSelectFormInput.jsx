import React, { useState } from "react";
import { Plus, X } from "lucide-react"; // Optional: Use any icon library or just text

const UserFriendlyAmenityInput = ({ value = [], onChange }) => {
  const [inputValue, setInputValue] = useState("");

  const suggestedOptions = [
    "Swimming pool",
    "Spa",
    "Gym",
    "WiFi",
    "Parking",
    "Kitchen",
  ];

  const handleToggle = (item) => {
    const newValue = value.includes(item)
      ? value.filter((i) => i !== item) // Remove if exists
      : [...value, item]; // Add if doesn't exist
    onChange(newValue);
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue("");
    }
  };

  const removeTag = (itemToRemove) => {
    onChange(value.filter((item) => item !== itemToRemove));
  };

  return (
    <div className="card border p-3 bg-light">
      {/* 1. Quick Select Suggestions */}
      <div className="mb-3">
        <label className="form-label text-muted small uppercase fw-bold">
          Quick Select Suggestions:
        </label>
        <div className="d-flex flex-wrap gap-2">
          {suggestedOptions.map((option) => {
            const isSelected = value.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleToggle(option)}
                className={`btn btn-sm rounded-pill ${
                  isSelected ? "btn-primary" : "btn-outline-secondary bg-white"
                }`}
              >
                {isSelected ? "✓ " : "+ "} {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Manual Add Input */}
      <div className="mb-3">
        <label className="form-label text-muted small fw-bold">
          Add Custom Amenity:
        </label>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Pet Friendly"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleManualAdd(e);
              }
            }}
          />
          <button
            className="btn btn-dark"
            type="button"
            onClick={handleManualAdd}
          >
            Add
          </button>
        </div>
      </div>

      {/* 3. Current Selection Display */}
      <div>
        <label className="form-label text-muted small fw-bold">
          Selected Amenities:
        </label>
        <div className="d-flex flex-wrap gap-2">
          {value.length === 0 && (
            <span className="text-muted small italic">
              No amenities selected yet.
            </span>
          )}
          {value.map((item) => (
            <span
              key={item}
              className="badge bg-white text-dark border d-flex align-items-center gap-2 p-2 shadow-sm"
            >
              {item}
              <X
                size={14}
                className="text-danger cursor-pointer"
                style={{ cursor: "pointer" }}
                onClick={() => removeTag(item)}
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserFriendlyAmenityInput;
