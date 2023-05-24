import * as yup from 'yup';
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
import { v4 as uuid } from 'uuid';

const validationSchema = yup.object().shape({
  name: yup.string().required('This field is required'),
  preparation_time: yup
    .string()
    .required('This field is required')
    .test('not-equal', 'Preparation time is required', (value) => {
      return value !== '00:00:00';
    }),
  type: yup
    .string()
    .required('This field is required')
    .test('equal', 'Type must be equal pizza or soup or sandwich ', (value) => {
      return value !== 'pizza' || value !== 'soup' || value !== 'sandwich';
    }),
  no_of_slices: yup
    .number()
    .min(1, "This field can't be smaller than 1")
    .max(99, "This field can't be bigger than 1")
    .when('type', {
      is: 'pizza',
      then: yup.number().required('This field is required'),
      otherwise: yup.number(),
    }),
  diameter: yup
    .number()
    .min(1, "This field can't be smaller than 1")
    .max(99, "This field can't be bigger than 99")
    .when('type', {
      is: 'pizza',
      then: yup.number().required('This field is required'),
      otherwise: yup.number(),
    }),
  spiciness_scale: yup
    .number()
    .min(1, "This field can't be smaller than 1")
    .max(99, "This field can't be bigger than 1")
    .when('type', {
      is: 'soup',
      then: yup.number().required('This field is required'),
      otherwise: yup.number(),
    }),
  slices_of_bread: yup
    .number()
    .min(1, "This field can't be smaller than 1")
    .max(99, "This field can't be bigger than 1")
    .when('type', {
      is: 'sandwich',
      then: yup.number().required('This field is required'),
      otherwise: yup.number(),
    }),
});

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

const onSubmit = async (values) => {
  console.log('ha');
  console.log(values);
  const id = uuid();
  const small_id = id.slice(0, 8);
  console.log(id);
  const dish = {
    small_id,
    ...values,
  };
  const jsonData = JSON.stringify(dish);
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
      console.log('Bad request', response.status);
    }
  } catch (error) {
    console.log('Error:', error);
  }
};

const validateField = (value) => {
  // eslint-disable-next-line no-restricted-globals
  const schema = validationSchema.fields['name'];

  try {
    schema.validateSync(value);
  } catch (e) {
    return e.errors && e.errors[0];
  }
};

const App = () => {
  return (
    <Styles>
      <h1>Insert your dish!</h1>
      <Form
        onSubmit={onSubmit}
        // validate={validate}
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
                // component={TextField}
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
                    <TimeInput {...input} />
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

            {/*if pizza */}
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
};

// render(<App />, document.getElementById('root'));
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);
ReactDOM.render(<App />, document.getElementById('root'));
