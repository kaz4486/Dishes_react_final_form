import React, { useState } from 'react';
import TimeField from 'react-simple-timefield';

const TimeInput = (input, meta) => {
  const [currentTime, setCurrentTime] = useState('');

  const handleTimeChange = (event) => {
    const { value } = event.target;
    setCurrentTime(value);
    input.onChange(value);
  };

  return (
    <div>
      <label htmlFor={input.name}>Time</label>
      <TimeField
        name={input.name}
        value={currentTime}
        onChange={handleTimeChange}
        showSeconds
        style={{
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '5px',
        }}
      />
      {meta.touched && meta.error && (
        <span style={{ color: 'red' }}>{meta.error}</span>
      )}
    </div>
  );
};

export default TimeInput;
