import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dice from './Dice';
import { setOfDice } from '../utilities/Fields';
import StyledSetOfDice from '../styles/StyledSetOfDice';

class SetOfDice extends Component{
    render(){
        const { dice, toggleSelectDice, rollCounter, selected, numberOfDice } = this.props;
        return(
            <StyledSetOfDice>
                {setOfDice.slice(0,numberOfDice).map((el,i) =>
                    <Dice
                        key={el}
                        name={el}
                        rollCounter={rollCounter}
                        toggleSelectDice={toggleSelectDice}
                        selected={selected[i]}
                        dice={dice[i]}
                    />)}
            </StyledSetOfDice>
        );
    }
}
SetOfDice.propTypes = {
    dice: PropTypes.array.isRequired,
    toggleSelectDice: PropTypes.func.isRequired,
    rollCounter: PropTypes.number.isRequired,
    selected: PropTypes.array,
    numberOfDice: PropTypes.string
};

export default SetOfDice;
