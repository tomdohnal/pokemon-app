import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Favorites from './Favorites';
import { FavoritePokemonContextProvider } from './lib/favorite-pokemons';
import { Global, ThemeProvider } from '@emotion/react';

const theme = {
  primaryColor: '#e91e63',
  textLightColor: '#757575',
  textColor: '#212121',
  lightGrey: '#e0e0e0',
};

ReactDOM.render(
  <React.StrictMode>
    <Global
      styles={{
        body: {
          color: theme.textColor,
        },
      }}
    />
    <FavoritePokemonContextProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
              <Route path="/favorites" element={<Favorites />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </FavoritePokemonContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
