import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

// TODO: fill this in
// TODO: use file drag n drop
// TODO: Use file 'accept' attribute (assume image for now)
// TODO: disable submit button if state.file === null
// TODO: extract copy
// TODO: augment form submission with more info - form title, form description, etc
import { uploadFormImage } from '../actions/';
// import { Button, Form, FileUpload } from 'elemental';
import { COLORS, REQUEST_STATUS, STRINGS } from '../constants';
import { Button, Container, Divider, Form, Grid, Header, Icon, Segment } from 'semantic-ui-react'

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      file: null
    };
  }

  onChange = (e) => {
    this.setState({ file:e.target.files[0] });
  }

  onFormSubmit(e) {
    e.preventDefault();
    if (this.state.file) { // remove guard once disable state is up
      this.props.uploadFormImage({
        file: this.state.file
      });
    }
  }

  render() {
    // <FileUpload 
    //       buttonLabelInitial= 'Upload Form'
    //       buttonLabelChange= 'Pick another Form'
    //       onChange={this.onChange}
    //       >
    //       Upload Form
    //     </FileUpload>
    const { requestStatus } = this.props;
    const { file } = this.state;
    let label = file ?
		  (file.name.length > 14 ?
       file.name.substr(0, 4) + "..." + file.name.substr(-7) : file.name) : STRINGS.select;
    const requesting = requestStatus === REQUEST_STATUS.REQUESTING;
    if (requesting) {
      label = STRINGS.requesting;
    }
    const uploadIcon = (() => {
      switch (requestStatus) {
        case REQUEST_STATUS.ERROR:
          return 'exclamation circle';
        case REQUEST_STATUS.REQUESTING:
          return 'sun';
        case REQUEST_STATUS.SUCCESS:
          return 'check';
        case REQUEST_STATUS.NOT_REQUESTING:
        default:
          return 'arrow circle up';
      }
    })();
    return (
      <Container style={styles.wrap}>
        <Segment color='teal' style={styles.customSegment}>
          <Grid columns={2} stackable textAlign='center'>
            <Divider vertical hidden />
            <Grid.Row verticalAlign='middle'>
              <Grid.Column>
                <Grid.Row>
                  <Header as='h1'>
                    <Icon name='paper plane outline' />
                    <Header.Content>
                      PopForm
                    </Header.Content>
                  </Header>
                </Grid.Row>
                <Grid.Row>
                  Go paperless! Photos to forms, easier than ever.
                </Grid.Row>
              </Grid.Column>

              <Grid.Column>
                <Form onSubmit={e => this.onFormSubmit(e)}>
                  <input style={ styles.fileStyle }
                    name="file" id="file"
                    type="file" onChange={this.onChange}
                    accept="image/*"
                  />
                  <label htmlFor="file" style={styles.labelStyle}>
                    <Header icon>
                      <Icon name={uploadIcon} loading={requesting} style={styles.statusIcon}/>
                      { label }
                    </Header>
                  </label>
                  <Form.Button basic color='black'
                    type="submit" disabled={requesting}> 
                    { STRINGS.confirm }
                  </Form.Button>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Container>
    )
  }
};

const styles = {
  customSegment: {
    fontSize: '18px',
    padding: '3em'
  },
  fileStyle: {
    width: "0.1px",
    height: "0.1px",
    opacity: "0",
    overflow: "hidden",
    position: "absolute",
    zIndex: "-1"
  },
  labelStyle: {
    border: "2px solid black",
    borderRadius: "4px",
    cursor: 'pointer',
    fontSize: "1.25em",
    fontWeight: "700",
    padding: "1em",
    margin: "1em",
    display: "inline-block",
    width: "12em"
  },
  statusIcon: {
    margin: '14px'
  },
  wrap: {
    margin: '6em'
  }
}

const mapStateToProps = state => {
  return {
    requestStatus: state.formFetchStatus,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    uploadFormImage
  }, dispatch);
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Home));
