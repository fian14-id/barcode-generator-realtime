import React, { useState } from "react";

const AlertOnInputChange = () => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Trigger alert when input changes
    alert(`Input changed to: ${newValue}`);
  };

  return (
    <div>
      <label htmlFor="userInput">Enter something: </label>
      <input
        type="text"
        id="userInput"
        value={inputValue}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default AlertOnInputChange;
