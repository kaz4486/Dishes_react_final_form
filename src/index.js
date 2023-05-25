import React from 'react';
import ReactDOM from 'react-dom';

import Styles from './Styles';
import FormDishes from './Components/Form/FormDishes';

const App = () => {
  return (
    <Styles>
      <h1>Insert your dish!</h1>
      <FormDishes />
    </Styles>
  );
};

// render(<App />, document.getElementById('root'));
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);
ReactDOM.render(<App />, document.getElementById('root'));
