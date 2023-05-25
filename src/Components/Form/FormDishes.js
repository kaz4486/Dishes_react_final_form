import { Form, Field } from 'react-final-form';
import TimeInput from '../TimeInput/TimeInput.js';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { TextField } from '@mui/material';
import { Condition, WhenFieldChanges } from '../../utils/utils.js';
import { validateField } from '../../validation/validationField.js';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';

const FormDishes = () => {
  const [currentTime, setCurrentTime] = useState('');
  const handleResetForm = (form, setCurrentTime) => {
    console.log(setCurrentTime);
    form.reset();
    setCurrentTime('');
  };

  const onSubmit = async (values) => {
    const id = uuid();
    const small_id = id.slice(0, 8);
    const dish = {
      small_id,
      ...values,
    };
    const jsonData = JSON.stringify(dish);

    try {
      // Wykonanie żądania asynchronicznego do serwera
      const response = await fetch(
        'https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonData,
        }
      );

      if (response.ok) {
        // Odczytanie odpowiedzi jako JSON
        const responseData = await response.json();
        console.log(responseData);
      } else {
        console.log('Bad request', response.status);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={({
        handleSubmit,
        form,
        submitting,
        pristine,
        values,
        touched,
      }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <Field
              name='name'
              component={TextField}
              type='text'
              validate={validateField}
            >
              {({ input, meta }) => (
                <div>
                  <label>Dish name</label>
                  <input {...input} type='text' />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </div>
              )}
            </Field>

            <Field name='preparation_time' validate={validateField}>
              {({ input, meta }) => (
                <div>
                  <TimeInput
                    input={input}
                    currentTime={currentTime}
                    setCurrentTime={setCurrentTime}
                  />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </div>
              )}
            </Field>
          </div>

          <div className='horizontal_center_div'>
            <Field name='type' type='select' validate={validateField}>
              {({ input, meta }) => (
                <div className={meta.active && 'active'}>
                  <label>Type of dish:</label>
                  <select {...input}>
                    {' '}
                    <option value=''>Select type of the dish</option>{' '}
                    <option value='pizza'>pizza</option>
                    <option value='soup'>soup</option>
                    <option value='sandwich'>sandwich</option>
                  </select>

                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </div>
              )}
            </Field>
          </div>

          {/*if not pizza */}
          <WhenFieldChanges
            field='type'
            becomes={'soup'}
            set='no_of_slices'
            to={''}
          />
          <WhenFieldChanges
            field='type'
            becomes={'soup'}
            set='diameter'
            to={''}
          />
          <WhenFieldChanges
            field='type'
            becomes={'sandwich'}
            set='no_of_slices'
            to={''}
          />
          <WhenFieldChanges
            field='type'
            becomes={'sandwich'}
            set='diameter'
            to={''}
          />
          <Condition when='type' is='pizza'>
            <Field name='no_of_slices' validate={validateField}>
              {({ input, meta }) => {
                return (
                  <div className='horizontal_center_div'>
                    <label>Number of slices:</label>
                    <input {...input} type='number' min={0} />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </div>
                );
              }}
            </Field>

            <Field name='diameter' validate={validateField}>
              {({ input, meta }) => {
                return (
                  <div className='horizontal_center_div'>
                    <label>Diameter:</label>
                    <input {...input} type='number' step='0.1' />

                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </div>
                );
              }}
            </Field>
          </Condition>

          {/* if not soup */}
          <WhenFieldChanges
            field='type'
            becomes={'pizza'}
            set='spiciness_scale'
            to={''}
          />
          <WhenFieldChanges
            field='type'
            becomes={'sandwich'}
            set='spiciness_scale'
            to={''}
          />
          <Condition when='type' is='soup'>
            <div className='horizontal_center_div'>
              <label>Spiciness scale:</label>
              <Field
                name='spiciness_scale'
                type='select'
                validate={validateField}
                // validate={validate}
              >
                {({ input, meta }) => (
                  <div>
                    {' '}
                    <select {...input}>
                      {' '}
                      <option value=''>Select a spiciness level</option>
                      <option value='1'>1</option>
                      <option value='2'>2</option>
                      <option value='3'>3</option>
                      <option value='4'>4</option>
                      <option value='5'>5</option>
                      <option value='6'>6</option>
                      <option value='7'>7</option>
                      <option value='8'>8</option>
                      <option value='9'>9</option>
                      <option value='10'>10</option>
                    </select>{' '}
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </div>
                )}
              </Field>
            </div>
          </Condition>

          {/* if not sandwich */}
          <WhenFieldChanges
            field='type'
            becomes={'pizza'}
            set='slices_of_bread'
            to={''}
          />
          <WhenFieldChanges
            field='type'
            becomes={'soup'}
            set='slices_of_bread'
            to={''}
          />
          <Condition when='type' is='sandwich'>
            <Field name='slices_of_bread' validate={validateField}>
              {({ input, meta }) => (
                <div className='horizontal_center_div'>
                  <label>Slices of bread:</label>
                  <input {...input} type='number' />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </div>
              )}
            </Field>
          </Condition>

          <div className='buttons'>
            <Button
              type='submit'
              disabled={submitting}
              variant='contained'
              endIcon={<SendIcon />}
            >
              Submit
            </Button>
            <Button
              type='button'
              onClick={() => handleResetForm(form, setCurrentTime)}
              disabled={submitting || pristine}
              variant='outlined'
              startIcon={<DeleteIcon />}
            >
              Reset
            </Button>
          </div>
          <pre>{JSON.stringify(values, 0, 2)}</pre>
        </form>
      )}
    />
  );
};

export default FormDishes;
