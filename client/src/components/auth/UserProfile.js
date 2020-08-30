import React, { Component, Fragment } from "react";
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
import { loadUserProfile } from "../../actions/authActions";
import { clearErrors } from "../../actions/errorActions";
import PropTypes from "prop-types";

class UserProfile extends Component {

  state = {
    modal: false,
    msg: null,
  };

  static propTypes = {
    user: PropTypes.object.isRequired,
    loadUserProfile: PropTypes.func.isRequired,
    error: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
  };

  componentDidMount() {
    // const { email, name, register_date } = this.props.auth.user;
    // const user = {
    //   email,
    //   name,
    //   register_date,
    // }
    console.log("Mount");
    // const {user} = this.state.auth;
    // console.log(email, name, register_date);
    // On mount, load user info and pre-populate an update form with that info
  }

  componentDidUpdate(prevProps) {
    console.log("Update");
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === "AUTH_FAIL") {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }
  }

  toggle = () => {
    // Clear errors
    this.props.clearErrors();
    this.setState({
      modal: !this.state.modal,
    });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    // If nothing changes, then prevent button from being clicked
    // if ()
    // If passwords don't match, halt the process. If they do, update it.
    // If nothing is entered in the password field, don't update password.


    // const { name, email, password } = this.state;

    // Create user object
    // const newUser = {
    //   name,
    //   email,
    //   password,
    // };
    //Attempt to Register
    // this.props.register(newUser);
  };

  render() {
    console.log("PROPS " + JSON.stringify(this.props))
    const { email, name, register_date } = this.props.auth.user;
    return (
      <Fragment>
        <NavLink onClick={this.toggle} href="#">
          Update Profile
        </NavLink>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Update User Profile</ModalHeader>
          <ModalBody>
            {this.state.msg ? (
              <Alert color="danger">{this.state.msg}</Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  className="mb-3"
                  onChange={this.onChange}
                />

                <Label for="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  className="mb-3"
                  onChange={this.onChange}
                />

                <Label for="email">Enter your new password</Label>
                <Input
                  type="password"
                  name="newPass"
                  id="newPass"
                  placeholder="New Password"
                  onChange={this.onChange}
                />
                <Input
                  type="password"
                  name="newPassMatch"
                  id="newPassMatch"
                  placeholder="Retype New Password"
                  onChange={this.onChange}
                />
                <Button color="dark" style={{ marginTop: "2rem" }} block>
                  Update
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.error,
  auth: state.auth,
});

export default connect(mapStateToProps, { loadUserProfile, clearErrors })(UserProfile);
