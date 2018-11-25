import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { saveSettings, getDataSettings } from '../utilities/store';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const dataSettings = getDataSettings('dataSettings');
const persistedState = dataSettings && dataSettings['numberOfDice'];

export const store = createStore(
  rootReducer,
  persistedState,
  composeEnhancers(applyMiddleware(thunk))
);

store.subscribe(() => {
  saveSettings({ gameSettings: store.getState().gameSettings });
});
