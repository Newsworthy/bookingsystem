
import React, { Component } from 'react';
import {
    Button,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input,
    NavLink,
    Alert,
    Container,
} from "reactstrap";
import { connect } from 'react-redux'

import PropTypes from "prop-types";
import { register, passReset, startPassReset } from "../../actions/authActions";
import { clearErrors } from "../../actions/errorActions";

class PassResetForm extends Component {
    state = {
        modal: false,
        name: "",
        email: "",
        password: "",
        msg: null,
        resetLink: null,
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        // register: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
    };

    componentDidMount() {
        // console.log(this.props.match.params.token);
        //Here I need to get the token from the address loaded, and set it to resetLink.
    }

    componentDidUpdate(prevProps) {
        const { error, isAuthenticated, auth } = this.props;

        if (auth !== prevProps.auth) {
            if (auth.msg !== null) {
                this.setState({ msg: auth.msg })
            } else {
                this.setState({ msg: null });
            }
        }
        if (error !== prevProps.error) {
            // Check for register error
            if (error.id === "RESET_FAIL") {
                this.setState({ msg: error.msg.msg });
            } else {
                this.setState({ msg: null });
            }
        }
    }

    toggle = () => {
        console.log();
        startPassReset();
        
        // console.log(req.params);
        this.setState({
          modal: !this.state.modal,
        //   resetLink: req.params.resetLink,
        });
      };

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onSubmit = (e) => {
        e.preventDefault();

        const { newPass, newPassMatch } = this.state;
        if (newPass !== newPassMatch) {
            this.setState({ msg: "Passwords don't match." })
        } else {
            console.log("newPass and newPassMatch are " + newPass + newPassMatch)

            this.props.passReset(newPass);
        }

        // Create user object
        // const newUser = {
        //     name,
        //     email,
        //     password,
        // };
        //Attempt to Register
        // this.props.register(newUser);
    };

    // DONE Make an api call to your backend that creates a password reset token. Store it in the database and, in one form or another, associate it with the user (usually it's the same database entry).

    // DONE Send an email to the user with a link that has the password reset token embedded into it. Have a route in your react-router routes that will handle the url you link to.

    // Have the route mount a component that has a componentDidMount, which takes the token and makes an api to the backend to validate the token.

    // Once validated, open a ui element in the react component that allows the user to set a new password

    // Take the new password, password confirmation, and reset token and make an api call to the backend to change the password. You need the token a second time because you have to validate the token one last time during the actual password change process, to make sure no one is attempting anything malicious. Hiding inputs behind state is not secure.

    // DONE Delete the reset token in the backend after successful password change

    render() {
        // const {resetLink} = req.params;
        const { isAuthenticated } = this.props;
        // console.log("Reset Link: " + resetLink);
        return (
            <div>
                {isAuthenticated ? null : (
                    <Container>
                        <Row>
                            <Col Col sm="12" md={{ size: 6, offset: 3 }}>
                                <Button onClick={this.toggle} color="dark" style={{ marginTop: "2rem" }} block>
                                    Reset Password
                            </Button>
                            <Modal isOpen={this.state.modal} toggle={this.toggle}>
                            <ModalHeader>

                            
                                {this.state.msg ? (
                                    <Alert color="danger">{this.state.msg}</Alert>
                                ) : null}
                                </ModalHeader>
                                <Form onSubmit={this.onSubmit}>
                                    <FormGroup>
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
                                            Submit New Password
                            </Button>
                                    </FormGroup>
                                </Form>
                                </Modal>
                            </Col>
                        </Row>

                    </Container>
                )
                }

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    error: state.error,
    auth: state.auth,
})


export default connect(mapStateToProps, { passReset, clearErrors })(PassResetForm)
