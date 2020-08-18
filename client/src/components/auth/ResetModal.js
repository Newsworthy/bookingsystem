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
// import { addItem } from "../../actions/itemActions";
import { passReset } from "../../actions/authActions";
import PropTypes from "prop-types";

class ResetModal extends Component {
  state = {
    modal: false,
    name: "",
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { email } = this.state;
    console.log("Email to reset is: " + email)
    const emailToReset = email;
    // const newItem = {
    //   name: this.state.name,
    // };

    // // Add item via addItem actions
    this.props.passReset(emailToReset);
    // Close Modal
    this.toggle();
  };

  render() {
    return (
      <div>
        {this.props.isAuthenticated ? (
          <Button
            color="dark"
            style={{ marginBottom: "2rem" }}
            onClick={this.toggle}
          >
            Add Item
          </Button>
        ) : (
            <NavLink onClick={this.toggle} href="#">
              Reset Password
            </NavLink>
          )}

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
});

export default connect(mapStateToProps, {})(ResetModal);
