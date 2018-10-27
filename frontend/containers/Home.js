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
import { Button, Input, Form } from 'semantic-ui-react';

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
    const label = file ?
		  (file.name.length > 14 ?
		   file.name.substr(0, 4) + "..." + file.name.substr(-7) : file.name) : "Upload Form";
    
    return (
      <Form onSubmit={e => this.onFormSubmit(e)}>
	      <input style={ styles.fileStyle }
		     name="file" id="file"
		     type="file" onChange={this.onChange}
		     accept="image/*"
	      />
	      <label htmlFor="file" style={styles.labelStyle}>
          { label }
	      </label>
        <Form.Button
          type="submit"> 
          Confirm Form
	      </Form.Button>
      </Form>
    )
  }
};

const styles = {
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
    display: "inline-block"
  },
}

const mapStateToProps = state => {
  return {
    requestStatus: state.requestStatus,
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
