const initState = {
    numberOfDice: '6',
    columnsToAdd: {}
};

const gameSettings = (state=initState, action) => {
    if(action.type==='SET_DATA'){
        if(action.data.name==='numberOfDice'){
            return {...state, numberOfDice: action.data.value};
        }else{
            return {...state, 'columnsToAdd': {...state.columnsToAdd, [action.data.name]:action.data.value}};
        }

    }
    // if(action.type==='SAVE_SETTINGS'){
    //     return {...state, numberOfDice: action.data.numberOfDice, 'columnsToAdd': {[action.data.name]:action.data.value}};
    // }
    return state;
};

export default gameSettings;
