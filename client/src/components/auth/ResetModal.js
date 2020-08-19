import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  NavLink,
  Alert,
} from "reactstrap";
import { connect } from "react-redux";
import { passForgot } from "../../actions/authActions";
import PropTypes from "prop-types";
import { clearErrors } from "../../actions/errorActions";

class ResetModal extends Component {
  state = {
    modal: false,
    email: "",
    msg: null,
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated, auth } = this.props;

    if (auth !== prevProps.auth) {
      if (auth.msg !== null) {
        this.setState({ msg: auth.msg})
      } else {
        this.setState({ msg: null });
      }
    }    

    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === "RESET_FAIL") {
        this.setState({ msg: error.msg.msg });
      }  else {
        this.setState({ msg: null });
      } 
    } 
    
    //If authenticated close modal
    if (this.state.modal) {
      if (isAuthenticated) {
        this.toggle();
      }
    }
  }

  toggle = () => {
    this.props.clearErrors();
    this.setState({
      modal: !this.state.modal,

    });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {
    this.props.clearErrors();
    e.preventDefault();

    const { email } = this.state;

    const resetEmail = {
      email,
    };
    // console.log("Modal Email to reset is: " + resetEmail)
    // console.log("Props " + this.state.email)
    this.props.passForgot(resetEmail);
    // this.props.passReset(emailToReset);
    // Close Modal
  };

  render() {
    return (
      <div>

        <NavLink onClick={this.toggle} href="#">
          Reset Password
        </NavLink>


        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Reset Password</ModalHeader>
          <ModalBody>
            {this.state.msg ? (
              <Alert color="danger">{this.state.msg}</Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="email">Enter your email address</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email Address"
                  onChange={this.onChange}
                />
                <Button color="dark" style={{ marginTop: "2rem" }} block>
                  Reset Password
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  item: state.item,
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  auth: state.auth,
});

export default connect(mapStateToProps, { passForgot, clearErrors })(ResetModal);
