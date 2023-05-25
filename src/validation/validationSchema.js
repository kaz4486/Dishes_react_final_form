import * as yup from 'yup';

export const validationSchema = yup.object().shape({
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
