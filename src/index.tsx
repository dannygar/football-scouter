import React from 'react';
import ReactDOM from 'react-dom';
import './Styles/App.css';
import { AzureAD } from 'react-aad-msal'
import { authProvider } from './Auth/AuthProvider'
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <AzureAD provider={authProvider} forceLogin={true}>
      <App />
    </AzureAD>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
