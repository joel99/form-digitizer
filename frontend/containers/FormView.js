import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { REQUEST_STATUS, STRINGS } from '../constants';

import { completeSubmission, getFormImage } from '../actions/';
import { Button, Container, Form, Header, Icon, Input, Segment } from 'semantic-ui-react'

const InfoBlock = ( { clearValues, data, onChange, onSubmit, values } ) => {
  const { fields } = data;
  const fieldBlock = fields.map(({inputType, label, _id}) => {
    const updateVal = (e) => {
      onChange(_id, e.target.value);
    };
    if (inputType === 'info' || inputType === 'heading') {
      return (<h3>{label}</h3>);
    }

    return (<Form.Field key={_id}>
      <label>{label}</label>
      <Input
        type='text' 
        placeholder='Answer' 
        value={values[_id] ? values[_id] : ""}
        onChange={updateVal} 
        />
    </Form.Field>);
  });
  return (<Form onSubmit={onSubmit}>
    {fieldBlock}
    <Button basic color='black' type='submit'>{STRINGS.complete}</Button>
    <Button basic color='red' onClick={clearValues}>{STRINGS.clear}</Button>
  </Form>);
};

class FormView extends Component {
  constructor(props){
    super(props);
    this.state = {
      formValues: {}
    };
  }

  componentDidMount() {
    const { formFetchStatus, getFormImage, match } = this.props;
    if (formFetchStatus === REQUEST_STATUS.NOT_REQUESTING) {
      getFormImage(match.params.id);
    }
  }

  onFormSubmit = (e) => {
    e.preventDefault();
    const { formValues } = this.state;
    const { completeSubmission, match } = this.props;
    completeSubmission({
      id: match.params.id,
      formValues
    });
    // TODO: wipe form
  }
          
  // children get considerable power here, wow
  updateFormValues = (key, newVal) => {
    const { formValues } = this.state;
    const newVals = { ...formValues, [key]: newVal };
    this.setState({ formValues: newVals });
  };

  clearValues = () => {
    this.setState({formValues: {}});
  };

  render() {
    const { formData, formFetchStatus } = this.props;
    const { formValues } = this.state;
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
          return (<InfoBlock 
            data={formData}
            onChange={this.updateFormValues}
            values={formValues}  
            onSubmit={e => this.onFormSubmit(e)}
            clearValues={this.clearValues}
          />);
        default:
          return (<div>
            Sorry, we couldn't find this form. Try making a new one!
          </div>);
      }
    })();
    return (
      <Container style={styles.wrap}>
        <Segment color="green" style={styles.customSegment}>
          Fill out your Form!
          <div style={styles.backDiv}>
            <Link to="/"><Button basic color="black"> Create Another! </Button></Link>
          </div>
        </Segment>
        <Segment color="teal" style={styles.customSegment}>
          { formBlock }
        </Segment>
      </Container>
    );
  }
};

const styles = {
  backDiv: {
    float: 'right'
  },
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
      getFormImage,
      completeSubmission
  }, dispatch);
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(FormView));
