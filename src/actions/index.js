import calculate, {
  permissionHandler,
  columnResult,
  selectedDice
} from '../utilities/Functions';
import {
  SET_DATA,
  ROLL_DICE,
  HANDLE_NAJAVA,
  HANDLE_INPUT,
  SELECTED_DICE,
  HANDLE_MOUSEOVER,
  HANDLE_MOUSEOUT,
  RESET_GAME
} from './types';

export const setData = (name, value) => ({
  type: SET_DATA,
  data: {
    name,
    value
  }
});

export const getData = (type, value) => ({
  type,
  data: value
});

export const handleChange = e => dispatch => {
  const target = e.target;
  const value = target.type === 'checkbox' ? target.checked : target.value;
  const name = target.name;
  dispatch(setData(name, value));
};

export const rollDice = (
  selected,
  dice,
  rollCounter,
  inputCount,
  najavljeno,
  numberOfDice,
  numberOfFields,
  najavaAndRucno
) => dispatch => {
  if (
    numberOfFields - inputCount !== najavaAndRucno ||
    !rollCounter ||
    najavljeno
  ) {
    let diceValue = [];
    for (let i = 0; i < numberOfDice; i++) {
      diceValue[i] = selected[i] ? dice[i] : Math.floor(Math.random() * 6 + 1);
    }
    dispatch(getData(ROLL_DICE, diceValue));
  }
  if (
    numberOfFields - inputCount == najavaAndRucno &&
    rollCounter &&
    !najavljeno
  ) {
    alert('Morate najaviti ili uneti iznos!');
  }
};

export const handleInput = (
  e,
  dice,
  rollCounter,
  najavljeno,
  numberOfDice
) => dispatch => {
  const field = e.target.id.split('-')[1];
  const column = e.target.id.split('-')[0];
  let input,
    res = {};
  if (
    ((column === 'rucno' || (column === 'najava' && !najavljeno)) &&
      rollCounter !== 1) ||
    (column === 'najava' && rollCounter === 1 && field !== 'kenta')
  ) {
    input = 0;
  } else {
    input = calculate(field, dice, rollCounter);
    res = columnResult(e.target.id, input);
  }
  (!(column === 'najava' && rollCounter === 1) ||
    (column === 'najava' && rollCounter === 1 && field === 'kenta' && input)) &&
    permissionHandler(e.target.id);

  column === 'najava' &&
    rollCounter === 1 &&
    dispatch(getData(HANDLE_NAJAVA, e.target.id));

  ((column === 'najava' &&
    ((rollCounter === 1 && field === 'kenta' && input) || rollCounter !== 1)) ||
    column !== 'najava') &&
    dispatch(
      getData(HANDLE_INPUT, {
        field: { [e.target.id]: input },
        selected: selectedDice(numberOfDice),
        res
      })
    );
};

export const toggleSelectDice = e => dispatch => {
  const index = e.target.name.split('-')[1] - 1;
  dispatch(getData(SELECTED_DICE, index));
};

export const handleMouseOver = (e, dice, rollCounter) => dispatch => {
  const field = e.target.id.split('-')[1];
  const input = calculate(field, dice, rollCounter);

  dispatch(getData(HANDLE_MOUSEOVER, { field: { [e.target.id]: input } }));
};

export const handleMouseOut = e => dispatch => {
  dispatch(getData(HANDLE_MOUSEOUT, e.target.id));
};

export const resetGame = numberOfDice => dispatch => {
  dispatch(getData(RESET_GAME, selectedDice(numberOfDice)));
  permissionHandler(null, null, null, true);
  columnResult(null, null, true);
};

export const toggleTopListSettings = () => dispatch => {
  dispatch(setData('showTopListSettings', null));
};
