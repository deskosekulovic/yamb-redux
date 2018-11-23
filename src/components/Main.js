import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { StyledApp, Game, Span, Results, Navigation } from '../styles/App';
import { permissionHandler, totalResult } from '../utilities/Functions';
import Fields from './Fields';
import SetOfDice from './SetOfDice';
import Button from './Button';
import { saveData } from '../utilities/store';
import { connect } from 'react-redux';
import {
  getData,
  toggleSelectDice,
  handleMouseOver,
  handleMouseOut,
  resetGame,
  rollDice,
  handleInput
} from '../actions';
import { PERMISSION } from '../actions/types';

class Main extends Component {
  constructor(props) {
    super(props);
    this.toggleSelectDice = this.toggleSelectDice.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }
  componentDidMount() {
    this.props.onResetGame(this.props.numberOfDice);
  }
  componentDidUpdate(prevProps) {
    const {
      rollCounter,
      najavljeno,
      columnsToAdd,
      getData,
      inputCount,
      numberOfFields,
      numberOfDice,
      numberOfColumns
    } = this.props;
    let per = permissionHandler(null, rollCounter);
    if (
      (prevProps.rollCounter !== rollCounter && rollCounter) ||
      (prevProps.najavljeno !== najavljeno && rollCounter)
    ) {
      this.najavaAndRucno = 0;
      Object.keys(per).map(item => {
        ((columnsToAdd['rucno'] && item.split('-')[0] == 'rucno') ||
          item.split('-')[0] == 'najava') &&
          per[item] &&
          this.najavaAndRucno++;
      });
      if (!najavljeno) {
        getData(PERMISSION, per);
      }
    }
    if (inputCount === numberOfFields) {
      let name = prompt('Unesite ime', '');
      name = name && name.trim().length > 0 ? name : 'Neznani junak';
      saveData(name, totalResult(), numberOfDice, numberOfColumns);
    }
  }
  toggleSelectDice(e) {
    this.props.onToggleSelect(e);
  }
  handleInput(e) {
    const {
      dice,
      rollCounter,
      najavljeno,
      numberOfDice,
      onHandleInput
    } = this.props;
    onHandleInput(e, dice, rollCounter, najavljeno, numberOfDice);
  }
  handleMouseOver(e) {
    const { dice, rollCounter, onHandleMouseOver } = this.props;
    onHandleMouseOver(e, dice, rollCounter);
  }
  handleMouseOut(e) {
    this.props.onHandleMouseOut(e);
  }
  render() {
    const {
      numberOfDice,
      columns,
      columnsToAdd,
      numberOfFields,
      dice,
      rollCounter,
      selected,
      fields,
      permission,
      inputCount,
      najavljeno
    } = this.props;

    let extraColumns = Object.keys(columnsToAdd);
    let mergedColumns = [...columns];
    extraColumns.map(item => {
      if (columnsToAdd[item]) {
        mergedColumns = [
          ...mergedColumns,
          ...[{ [item]: item == 'rucno' ? ' R' : item }]
        ];
      }
    });
    return (
      <StyledApp>
        <Game>
          <Navigation>
            <Span onClick={() => this.props.onResetGame(numberOfDice)}>
              <b>Nova igra</b>
            </Span>
            <Link
              to="/settings"
              style={{ color: 'black', paddingLeft: '10px' }}
            >
              <b>Podešavanja</b>
            </Link>
            <Link
              to="/toplists"
              style={{ color: 'black', paddingLeft: '10px' }}
            >
              <b>Top Liste</b>
            </Link>
          </Navigation>
          <Fields
            fields={fields}
            columns={mergedColumns}
            handleInput={this.handleInput}
            handleMouseOver={this.handleMouseOver}
            handleMouseOut={this.handleMouseOut}
            permission={permission}
            rollCounter={rollCounter}
            najavljeno={najavljeno}
          />
          <SetOfDice
            toggleSelectDice={this.toggleSelectDice}
            selected={selected}
            rollCounter={rollCounter}
            dice={dice}
            numberOfDice={numberOfDice}
          />
          <Button
            rollDice={() =>
              this.props.rollDice(
                selected,
                dice,
                rollCounter,
                inputCount,
                najavljeno,
                numberOfDice,
                numberOfFields,
                this.najavaAndRucno
              )
            }
            rollCounter={rollCounter}
            disabled={numberOfFields === inputCount}
          />
        </Game>
        <Results>
          {totalResult() !== 0 && <h1>Rezultat: {totalResult()}</h1>}
        </Results>
      </StyledApp>
    );
  }
}

Main.propTypes = {
  numberOfDice: PropTypes.string,
  columns: PropTypes.array,
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
  getData: PropTypes.func,
  onToggleSelect: PropTypes.func,
  onHandleMouseOut: PropTypes.func,
  onHandleMouseOver: PropTypes.func,
  onResetGame: PropTypes.func,
  rollDice: PropTypes.func,
  onHandleInput: PropTypes.func
};

const mapStateToProps = state => {
  const {
    dice,
    selected,
    rollCounter,
    fields,
    permission,
    najavljeno,
    inputCount
  } = state.game;
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
  getData,
  onToggleSelect: toggleSelectDice,
  onHandleMouseOver: handleMouseOver,
  onHandleMouseOut: handleMouseOut,
  onResetGame: resetGame,
  onHandleInput: handleInput,
  rollDice
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
