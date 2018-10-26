import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

class Home extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
	Hello World
      </div>
    )
  }
};

const styles = {
}

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
  }, dispatch);
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Home));
