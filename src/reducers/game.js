const initState = {
  dice: [],
  selected: [],
  rollCounter: 0,
  fields: {},
  permission: {},
  najavljeno: false,
  inputCount: 0
};

const game = (state = initState, action) => {
  switch (action.type) {
  case 'ROLL_DICE':
    return {
      ...state,
      dice: action.data,
      rollCounter: state.rollCounter + 1
    };
  case 'SELECTED_DICE':
    return {
      ...state,
      selected: state.selected.map((el, i) => {
        return i === action.data ? !el : el;
      })
    };
  case 'RESET_GAME':
    return {
      ...state,
      dice: [],
      selected: action.data,
      rollCounter: 0,
      fields: {},
      permission: {},
      najavljeno: false,
      inputCount: 0
    };
  case 'HANDLE_INPUT':
    return {
      ...state,
      fields: {
        ...state.fields,
        [Object.keys(action.data.field)[0]]: Object.values(
          action.data.field
        )[0],
        ...action.data.res
      },
      rollCounter: 0,
      dice: [],
      selected: action.data['selected'],
      permission: {},
      inputCount: state.inputCount + 1,
      najavljeno: false
    };
  case 'PERMISSION':
    return { ...state, permission: action.data };
  case 'HANDLE_NAJAVA':
    return {
      ...state,
      permission: { [action.data]: true },
      najavljeno: !state.najavljeno
    };
  case 'HANDLE_MOUSEOVER':
    return {
      ...state,
      fields: {
        ...state.fields,
        [Object.keys(action.data.field)[0]]: Object.values(
          action.data.field
        )[0]
      }
    };
  case 'HANDLE_MOUSEOUT':
    return {
      ...state,
      fields: { ...state.fields, [action.data]: '' }
    };
  default:
    return state;
  }
};

export default game;
