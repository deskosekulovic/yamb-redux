import { getDataSettings } from '../utilities/store';

let dataSettings = getDataSettings('dataSettings');
let topListSettings = getDataSettings('topListSettings');

const initState = {
    numberOfDice: dataSettings['numberOfDice'] || '6',
    columnsToAdd: dataSettings['columnsToAdd'] || {},
    localNumberOfDice: topListSettings['localNumberOfDice'] || '6',
    localNumberOfColumns: topListSettings['localNumberOfColumns'] || '7',
    numberOfResults: topListSettings['numberOfResults'] || '10',
    showTopListSettings: false
};

const gameSettings = (state=initState, action) => {
    if(action.type==='SET_DATA'){
        if(action.data.name==='numberOfDice'){
            return {...state, numberOfDice: action.data.value};
        }else if(action.data.name==='localNumberOfDice'){
            return {...state, localNumberOfDice: action.data.value};
        }
        else if(action.data.name==='localNumberOfColumns'){
            return {...state, localNumberOfColumns: action.data.value};
        }
        else if(action.data.name==='numberOfResults'){
            return {...state, numberOfResults:action.data.value};
        }
        else if(action.data.name==='showTopListSettings'){
            return {...state, showTopListSettings: !state.showTopListSettings};
        }
        else{
            return {...state, columnsToAdd: {...state.columnsToAdd, [action.data.name]:action.data.value}};
        }

    }
    return state;
};

export default gameSettings;
