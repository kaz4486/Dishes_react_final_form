import { validationSchema } from './validationSchema';

export const validateField = (value) => {
  // eslint-disable-next-line no-restricted-globals
  const schema = validationSchema.fields['name'];

  try {
    schema.validateSync(value);
  } catch (e) {
    return e.errors && e.errors[0];
  }
};
