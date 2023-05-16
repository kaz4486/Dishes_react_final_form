import React from 'react';
import ReactDOM from 'react-dom';

import Styles from './Styles';
import { Form, Field } from 'react-final-form';
import TimeInput from './TimeInput';
import { OnChange } from 'react-final-form-listeners';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { TextField } from '@mui/material';

const onSubmit = async (values) => {
  console.log(values);
  const jsonData = JSON.stringify(values);
  console.log(jsonData);

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
      console.log('Błąd żądania:', response.status);
    }
  } catch (error) {
    console.log('Wystąpił błąd:', error);
  }
};

// await sleep(300);
// window.alert(JSON.stringify(values, 0, 2));

const required = (value) => (value ? undefined : 'Required');
// const validateRequired = (value) => (!value ? 'Required' : undefined);

const mustBeNumber = (value) => (isNaN(value) ? 'Must be a number' : undefined);
// const minValue = min => value =>
//   isNaN(value) || value >= min ? undefined : `Should be greater than ${min}`
const composeValidators =
  (...validators) =>
  (value) =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined
    );

const Condition = ({ when, is, children }) => (
  <Field name={when} subscription={{ value: true }}>
    {({ input: { value } }) => (value === is ? children : null)}
  </Field>
);

const WhenFieldChanges = ({ field, becomes, set, to }) => (
  <Field name={set} subscription={{}}>
    {(
      // No subscription. We only use Field to get to the change function
      { input: { onChange } }
    ) => (
      <OnChange name={field}>
        {(value) => {
          if (value === becomes) {
            onChange(to);
          }
        }}
      </OnChange>
    )}
  </Field>
);

const App = () => (
  <Styles>
    <h1>Insert your dish!</h1>
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <Field name='name' validate={required}>
              {({ input, meta }) => (
                <div>
                  <TextField label='Dish name' variant='outlined'>
                    <label>Dish name</label>
                    <input {...input} type='text' />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </TextField>
                </div>
              )}
            </Field>

            <Field name='preparation_time' validate={required}>
              {({ input, meta }) => (
                <div>
                  <TimeInput {...input} />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </div>
              )}
            </Field>
          </div>

          <div className='horizontal_center_div'>
            <label>Type of dish:</label>
            <Field
              name='type'
              component='select'
              validate={required}

              // validate={composeValidators(required, mustBeNumber, minValue(18))}
            >
              <option>Select type of the dish</option>
              <option value='pizza'>pizza</option>
              <option value='soup'>soup</option>
              <option value='sandwich'>sandwich</option>
              {/* {meta.error && meta.touched && <span>{meta.error}</span>} */}
            </Field>
          </div>

          {/* if pizza */}
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
            <Field
              name='no_of_slices'
              validate={composeValidators(required, mustBeNumber)}
            >
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

            <Field
              name='diameter'
              validate={composeValidators(required, mustBeNumber)}
            >
              {({ input, meta }) => {
                return (
                  <div className='horizontal_center_div'>
                    <label>Diameter:</label>
                    <input {...input} type='float' step='0.5' />
                    {/* kąt, float */}
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </div>
                );
              }}
            </Field>
          </Condition>

          {/* if soup */}
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
                component='select'
                validate={composeValidators(required, mustBeNumber)}
              >
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
              </Field>
            </div>
          </Condition>

          {/* if sandwich */}
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
            <Field
              name='slices_of_bread'
              validate={composeValidators(required, mustBeNumber)}
            >
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
              onClick={form.reset}
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
  </Styles>
);

// render(<App />, document.getElementById('root'));
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);
ReactDOM.render(<App />, document.getElementById('root'));
