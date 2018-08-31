import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { StyledApp, Game, Span, Rezultati } from '../styles/App';
import calculate, { permissionHandler, columnResult, totalResult, selectedDice } from '../utilities/Functions';
import Fields from './Fields';
import SetOfDice from './SetOfDice';
import TopList from './TopList';
import { connect } from 'react-redux';
import { getData } from '../actions';

class Main extends Component {
    constructor(props){
        super(props);
        this.rollDice = this.rollDice.bind(this);
        this.toggleSelectDice = this.toggleSelectDice.bind(this);
        this.handleInput=this.handleInput.bind(this);
        this.resetGame=this.resetGame.bind(this);
        this.handleMouseOver=this.handleMouseOver.bind(this);
        this.handleMouseOut=this.handleMouseOut.bind(this);
    }
    componentDidMount() {
        this.resetGame();
        window.scrollTo(0, 0);
    }
    componentDidUpdate(prevProps) {
        const { rollCounter, najavljeno, columnsToAdd, getData } = this.props;
        let per=permissionHandler(null, rollCounter);
        if((prevProps.rollCounter!==rollCounter && rollCounter) || (prevProps.najavljeno!==najavljeno && rollCounter)){
            this.najavaAndRucno = 0;
            Object.keys(per).map(item=>{
                (columnsToAdd['rucno'] && item.split('-')[0]=='rucno' || item.split('-')[0]=='najava') && per[item] && this.najavaAndRucno++;
            });
            if(!najavljeno){
                getData('PERMISSION', per);
            }
        }
    }
    rollDice(){
        const { selected, dice, rollCounter, inputCount, najavljeno, numberOfDice, numberOfFields, getData } = this.props;
        if((numberOfFields-inputCount)!==this.najavaAndRucno || !rollCounter || najavljeno){
            let diceValue=[];
            for(let i=0; i<numberOfDice; i++){
                diceValue[i] = selected[i] ? dice[i] : Math.floor(Math.random()*6+1);
            }
            getData('ROLL_DICE', diceValue);
        }
        if((numberOfFields-inputCount)==this.najavaAndRucno && rollCounter && !najavljeno){
            alert('Morate najaviti ili uneti iznos!');
        }
    }
    toggleSelectDice(e){
        const { getData } = this.props;
        const index=e.target.name.split('-')[1]-1;
        getData('SELECTED_DICE', index);
    }
    handleInput(e){
        const { dice, rollCounter, najavljeno, numberOfDice, getData } = this.props;
        const field = e.target.id.split('-')[1];
        const column = e.target.id.split('-')[0];
        let input, res={};
        if(((column==='rucno' || (column==='najava' && !najavljeno)) && rollCounter!==1) || (column==='najava' && rollCounter===1 && field!=='kenta')){
            input=0;
        }else{
            input=calculate(field,dice,rollCounter);
            res=columnResult(e.target.id,input);
        }
        (!(column==='najava' && rollCounter===1) || (column==='najava' && rollCounter===1 && field==='kenta' && input)) && permissionHandler(e.target.id);

        column==='najava' && rollCounter===1 && getData('HANDLE_NAJAVA', e.target.id);

        (column==='najava' && (rollCounter===1 && field==='kenta' && input || rollCounter!==1) || column!=='najava')
        && getData('HANDLE_INPUT', {field:{[e.target.id]: input}, selected: selectedDice(numberOfDice), res});
    }
    handleMouseOver(e){
        const { dice, rollCounter, getData } = this.props;
        const field = e.target.id.split('-')[1];
        const input=calculate(field,dice,rollCounter);

        getData('HANDLE_MOUSEOVER', {field:{[e.target.id]: input}});
    }
    handleMouseOut(e){
        const { getData } = this.props;
        getData('HANDLE_MOUSEOUT', e.target.id);
    }
    resetGame(){
        const { numberOfDice, getData } = this.props;
        getData('RESET_GAME', selectedDice(numberOfDice));
        permissionHandler(null, null, null, true);
        columnResult(null, null, true);
    }
    render() {
        const { dice, rollCounter, selected, fields, permission, inputCount, najavljeno, numberOfDice, columnsToAdd, numberOfFields, numberOfColumns, match } = this.props;
        return (
            <StyledApp>
                <Game>
                    <Span onClick={this.resetGame}><b>Nova igra</b></Span>
                    <Link to='/settings' style={{'color':'black','paddingLeft':'10px'}}><b>Podešavanja</b></Link>
                    <Link to='/toplists' style={{'color':'black','paddingLeft':'10px'}}><b>Top Liste</b></Link>
                    <Fields
                        fields={fields}
                        columnsToAdd={columnsToAdd}
                        handleInput={this.handleInput}
                        handleMouseOver={this.handleMouseOver}
                        handleMouseOut={this.handleMouseOut}
                        permission={permission}
                        rollCounter={rollCounter}
                        najavljeno={najavljeno}
                    />
                    {numberOfFields!==inputCount && <SetOfDice
                        rollDice={this.rollDice}
                        toggleSelectDice={this.toggleSelectDice}
                        selected={selected}
                        rollCounter={rollCounter}
                        dice={dice}
                        numberOfDice={numberOfDice}
                    />}
                </Game>
                <Rezultati>
                    {totalResult()!==0 && <h1>Rezultat: {totalResult()}</h1>}
                    {inputCount===numberOfFields && <TopList match={match} numberOfDice={numberOfDice} numberOfColumns={numberOfColumns} totalResult={totalResult()} />}
                </Rezultati>
            </StyledApp>
        );
    }
}

Main.propTypes={
    numberOfDice: PropTypes.string,
    columnsToAdd: PropTypes.object,
    numberOfFields: PropTypes.number,
    numberOfColumns: PropTypes.number,
    match: PropTypes.object,
    rollCounter: PropTypes.number,
    permission: PropTypes.object,
    fields: PropTypes.object,
    selected: PropTypes.array,
    dice: PropTypes.array,
    inputCount: PropTypes.number,
    najavljeno: PropTypes.bool,
    getData: PropTypes.func
};

const mapStateToProps = (state) =>{
    const { dice, selected, rollCounter, fields, permission, najavljeno, inputCount } = state.game;
    return {
        dice,
        selected,
        rollCounter,
        fields,
        permission,
        najavljeno,
        inputCount
    };
};

const mapDispatchToProps = {
    getData
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
