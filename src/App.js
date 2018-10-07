import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { ThemeProvider, injectGlobal } from 'styled-components';
import { theme } from './styles/App';
import Main from './components/Main';
import Settings from './components/Settings';
import TopList from './components/TopList';
import { setExtraColumns } from './utilities/Functions';
import { columns, rowsToSelect } from './utilities/Fields';
import { connect } from 'react-redux';
import { setData, handleChange } from './actions';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    setExtraColumns(this.props.columnsToAdd);
  }
  handleChange(e) {
    this.props.onChange(e);
  }
  render() {
    const { numberOfDice, columnsToAdd } = this.props;
    let bonusLength = 0;
    Object.keys(columnsToAdd).map(item => {
      columnsToAdd[item] && bonusLength++;
    });
    const numberOfFields = (columns.length - 1 + bonusLength) * rowsToSelect.length;
    return (
      <ThemeProvider theme={theme}>
        <Switch>
          <Route
            exact
            path="/"
            render={props => (
              <Main
                {...props}
                columns={columns}
                columnsToAdd={columnsToAdd}
                numberOfColumns={columns.length - 1 + bonusLength}
                numberOfDice={numberOfDice}
                numberOfFields={numberOfFields}
              />
            )}
          />
          <Route
            path="/settings"
            render={props => (
              <Settings
                {...props}
                columnsToAdd={columnsToAdd}
                numberOfDice={numberOfDice}
                handleChange={this.handleChange}
              />
            )}
          />
          <Route
            path="/toplists"
            render={props => (
              <TopList
                {...props}
                numberOfColumns={columns.length - 1 + bonusLength}
                columnsToAdd={columnsToAdd}
                numberOfDice={numberOfDice}
              />
            )}
          />
        </Switch>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  const { numberOfDice, columnsToAdd } = state.gameSettings;
  return {
    numberOfDice,
    columnsToAdd
  };
};

const mapDispatchToProps = {
  setData,
  onChange: handleChange
};

injectGlobal`
  * {
    margin: 0px;
    padding: 0px;
  }
  body {
    background-color: #DCDCDC;
  }
`;

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
