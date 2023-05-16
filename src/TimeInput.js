import React, { useState } from 'react';
import TimeField from 'react-simple-timefield';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Item from './Components/Item/Item';

const TimeInput = (input) => {
  const [currentTime, setCurrentTime] = useState('');

  const handleTimeChange = (event) => {
    const { value } = event.target;
    setCurrentTime(value);
    input.onChange(value);
  };

  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <Item>
          <label htmlFor={input.name}>Preparation time:</label>

          <TimeField
            name={input.name}
            value={currentTime}
            onChange={handleTimeChange}
            showSeconds
            style={{
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '5px',
              marginInline: '5px',
            }}
          />
        </Item>
      </Grid>
    </Grid>
  );
};

export default TimeInput;
