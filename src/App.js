import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/App';
import Main from './components/Main';
import Settings from './components/Settings';
import TopList from './components/TopList';
import { setExtraColumns } from './utilities/Functions';
// import { getDataSettings } from './utilities/store';
import { columns, rowsToSelect } from './utilities/Fields';
import { connect } from 'react-redux';
import { setData } from './actions';

class App extends Component {
    constructor(props){
        super(props);
        this.handleChange=this.handleChange.bind(this);
    }
    componentDidMount(){
        const { columnsToAdd } = this.props;
        setData('SET_DATA','columnsToAdd',columnsToAdd);
        setExtraColumns(columnsToAdd);
    }
    handleChange(e){
        const { setData } = this.props;
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        setData('SET_DATA',name, value);
    }
    render() {
        const { numberOfDice, columnsToAdd } = this.props;
        let bonusLength = 0;
        Object.keys(columnsToAdd).map(item=>{
            columnsToAdd[item] && bonusLength++;
        });
        const numberOfFields = (columns.length+bonusLength)*rowsToSelect.length;
        return (
            <ThemeProvider theme={theme}>
                <Switch>
                    <Route
                        exact path="/"
                        render={props=>
                            <Main
                                {...props}
                                columnsToAdd={columnsToAdd}
                                numberOfColumns={columns.length+bonusLength}
                                numberOfDice={numberOfDice}
                                numberOfFields={numberOfFields}
                            />}
                    />
                    <Route
                        path="/settings"
                        render={props=>
                            <Settings
                                {...props}
                                columnsToAdd={columnsToAdd}
                                numberOfDice={numberOfDice}
                                handleChange={this.handleChange}
                            />}
                    />
                    <Route
                        path="/toplists"
                        render={props=>
                            <TopList
                                {...props}
                                numberOfColumns={columns.length+bonusLength}
                                columnsToAdd={columnsToAdd}
                                numberOfDice={numberOfDice}
                            />}
                    />
                </Switch>
            </ThemeProvider>
        );
    }
}

const mapStateToProps = (state) => {
    const { numberOfDice, columnsToAdd } = state.gameSettings;
    return {
        numberOfDice,
        columnsToAdd
    };
};

const mapDispatchToProps = {
    setData
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
