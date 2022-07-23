/**
 * Main store function
 */
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'localforage'
import thunk from 'redux-thunk'

import rootReducer from './reducers'

const enhancers: any[] = []
const middlewares: any[] = []

// Add the mandatory middlewares
middlewares.push(thunk)


if (process.env.NODE_ENV !== 'production') {
  // Add the logger middleware to debug all redux requests to console
  const loggerMiddleware = createLogger({ collapsed: true })
  middlewares.push(loggerMiddleware)
}

enhancers.push(applyMiddleware(...middlewares))


const persistConfig = {
  blacklist: ['router'],
  key: 'cymmetri',
  storage,
  version: 0
}


const persistedReducer = persistReducer(persistConfig, rootReducer)


export default () => {
  // initialize store
  const store = createStore(persistedReducer, {}, compose(...enhancers))
  const persistor = persistStore(store)
  return { store, persistor }
}
