import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { REQUEST_STATUS } from '../constants';

import { getFormImage } from '../actions/';
import { Button, Container, Divider, Form, Grid, Header, Icon, Input, Segment } from 'semantic-ui-react'

const InfoBlock = ( { data } ) => {
  const { fields } = data;
  const fieldBlock = fields.map(({label, _id}) => {
    return (<Form.Field key={_id}>
      <label>{label}</label>
      <Input type='text' />
    </Form.Field>);
  });
  return (<div>
    {fieldBlock}
  </div>);
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
    const formBlock = (() => {
      switch (formFetchStatus) {
        case REQUEST_STATUS.REQUESTING:
        return (<Container>
            <Header icon style={styles.statusIcon}>
              <Icon name='sun' loading />
              Fetching your Form...
            </Header>
          </Container>);
        case REQUEST_STATUS.SUCCESS:
          return <InfoBlock data={formData} />;
        default:
          return "Errored";
      }
    })();
    return (
      <Container style={styles.wrap}>
        <Segment style={styles.customSegment}>
          { formBlock }
        </Segment>
      </Container>
    );
  }
};

const styles = {
  customSegment: {
    fontSize: '18px',
    padding: '3em'
  },
  statusIcon: {
    display: 'block',
    margin: 'auto'
  },
  wrap: {
    margin: '6em'
  }
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
