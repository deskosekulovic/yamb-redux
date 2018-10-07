import { combineReducers } from 'redux';
import gameSettings from './gameSettings';
import game from './game';

const rootReducer = combineReducers({
  gameSettings,
  game
});

export default rootReducer;
