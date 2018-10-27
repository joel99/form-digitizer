import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { REQUEST_STATUS } from '../constants';

import { getFormImage } from '../actions/';

const InfoBlock = ({ formInfo }) => {
  return (<div>Stubbed</div>);
};

class FormView extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    const { formFetchStatus, getFormImage, match } = this.props;
    if (formFetchStatus === REQUEST_STATUS.NOT_REQUESTING) {
      getFormImage(match.params.id);
    }
  }

  render() {
    const { formData, formFetchStatus } = this.props;
    console.log(formData);
    const formBlock = (() => {
      switch (formFetchStatus) {
        case REQUEST_STATUS.REQUESTING:
          return "Requesting";
        case REQUEST_STATUS.SUCCESS:
          return <InfoBlock />;
        default:
          return "Errored";
      }
    })();
    return (
      <div>
        {formBlock}
      </div>
    )
  }
};

const styles = {
}

const mapStateToProps = state => {
  return {
    formData: state.formData,
    formFetchStatus: state.formFetchStatus 
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
      getFormImage
  }, dispatch);
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(FormView));
