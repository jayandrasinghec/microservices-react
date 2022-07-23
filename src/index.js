import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import thunk from 'redux-thunk';
import storage from 'localforage'
import rootReducer from './redux/reducers'
import configureStore from './redux/store';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import { PersistGate } from 'redux-persist/integration/react'
import { logout } from './modules/authentication/authActions' 

// const { store, persistor } = configureStore();
// export { store }

const persistConfig = {
  blacklist: ['router', 'snackbarReducer'],
  key: 'cymmetri',
  storage,
  version: 0
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(
  persistedReducer,
  applyMiddleware(thunk)
);

const persistor = persistStore(store)


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#363793',
    }
  }
})

window.addEventListener('storage', function (e) {
  // console.log(e);
  if( e.key === 'logout' && e.oldValue===null && e.newValue ){
      store.dispatch(logout())
      window.location="/#/auth/login"
  }
},false);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SnackbarProvider maxSnack={3}>
            <App />
          </SnackbarProvider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()