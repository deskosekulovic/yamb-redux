import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StyledTopList from '../styles/StyledTopList';
import { Link } from 'react-router-dom';
import TopListSettings from './TopListSettings';
import DisplayTopList from './DisplayTopList';
import Button from '../styles/Button';
import { saveTopListSettings, getDataSettings } from '../utilities/store';
import { connect } from 'react-redux';
import { handleChange, toggleTopListSettings } from '../actions';

class TopList extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    saveTopListSettings(e.target.name, e.target.value);
    this.props.onChange(e);
  }

  render() {
    const {
      localNumberOfDice,
      localNumberOfColumns,
      numberOfResults,
      showTopListSettings,
      toggleTopListSettings
    } = this.props;
    const data =
      getDataSettings(localNumberOfDice) &&
      getDataSettings(localNumberOfDice)[localNumberOfColumns];
    return (
      <StyledTopList>
        <TopListSettings
          showTopListSettings={showTopListSettings}
          localNumberOfDice={localNumberOfDice}
          localNumberOfColumns={localNumberOfColumns}
          numberOfResults={numberOfResults}
          toggleTopListSettings={toggleTopListSettings}
          handleChange={this.handleChange}
        />
        <DisplayTopList
          localNumberOfDice={localNumberOfDice}
          localNumberOfColumns={localNumberOfColumns}
          numberOfResults={numberOfResults}
          data={data}
        />
        <Link to="/">
          <Button>Nazad</Button>
        </Link>
      </StyledTopList>
    );
  }
}

TopList.propTypes = {
  numberOfResults: PropTypes.string,
  localNumberOfDice: PropTypes.string,
  localNumberOfColumns: PropTypes.string,
  showTopListSettings: PropTypes.bool,
  toggleTopListSettings: PropTypes.func,
  onChange: PropTypes.func
};

const mapStateToProps = state => {
  const {
    localNumberOfDice,
    localNumberOfColumns,
    numberOfResults,
    showTopListSettings
  } = state.gameSettings;
  return {
    localNumberOfDice,
    localNumberOfColumns,
    numberOfResults,
    showTopListSettings
  };
};

const mapDispatchToProps = {
  onChange: handleChange,
  toggleTopListSettings
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopList);
