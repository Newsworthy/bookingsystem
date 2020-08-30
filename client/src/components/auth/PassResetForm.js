
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
    Alert,
    Container,
} from "reactstrap";
import { connect } from 'react-redux'

import PropTypes from "prop-types";
import { passReset, startPassReset } from "../../actions/authActions";
import { clearErrors } from "../../actions/errorActions";

class PassResetForm extends Component {
    state = {
        modal: false,
        name: "",
        email: "",
        password: "",
        msg: null,
        resetLink: "test",
        passMsg: "",
    };

    static propTypes = {
        error: PropTypes.object.isRequired,
        resetLink: PropTypes.string.isRequired,
        clearErrors: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const { resetLink } = this.props.match.params;

        if (!resetLink) {
            console.log("!resetLink");
            this.setState({ msg: "Token error" });
        } else {

            console.log("resetLink!");
            this.setState({
                resetLink: resetLink
            }, (resetLink) => {
                // console.log("updated state:", resetLink)
                console.log("resetLink state within: " + this.state.resetLink);
                this.props.startPassReset(this.state.resetLink);
            });
            console.log("resetLink is: " + resetLink);
        }
        console.log("Here we go");
    }

    componentDidUpdate(prevProps) {
        const { error, auth } = this.props;

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
        this.props.clearErrors();
        this.setState({
            modal: !this.state.modal,
        });
    };

    onChange = (e) => {
        console.log("Changes..>");
        this.setState({ [e.target.name]: e.target.value });


    };

    onSubmit = (e) => {
        e.preventDefault();

        const { newPass, newPassMatch, resetLink } = this.state;
        if (this.state.newPass !== this.state.newPassMatch) {
            this.setState({ passMsg: "Passwords don't match." }, (msg) => {
                console.log("Alert updated");
            });
        } else {
            this.props.passReset(newPass, newPassMatch, resetLink);
            // Error checker

            this.setState({ passMsg: "Your password has been updated. Please login with your new credentials" }, (msg) => {
                console.log("Alert updated");
            });
        }
    };

    render() {
        // const {resetLink} = req.params;
        // console.log()
        const { isAuthenticated } = this.props;
        // console.log("Reset Link: " + resetLink);
        return (
            <div>
                {isAuthenticated ? null : (
                    <Container>
                        <Row>
                            <Col align="center" sm="12" md={{ size: 6, offset: 3 }}>
                                {this.state.msg ? (
                                    <Alert align="center" color="danger">{this.state.msg}</Alert>
                                ) : (
                                        <>
                                            <Button onClick={this.toggle} color="dark" style={{ marginTop: "2rem" }} block>
                                                Reset Password
                                            </Button>
                                            <Modal isOpen={this.state.modal} toggle={this.toggle}>
                                                <ModalHeader>
                                                    <h2 align="center">Reset Password</h2>

                                                </ModalHeader>
                                                <ModalBody>
                                                    {this.state.passMsg ? (
                                                        <Alert align="center" color="danger">{this.state.passMsg}</Alert>
                                                    ) : null}
                                                    <Row>
                                                        <Col sm="12" md={{ size: 6, offset: 3 }}>
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
                                                        </Col>
                                                    </Row>
                                                </ModalBody>
                                            </Modal>
                                        </>
                                    )}
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
    resetLink: state.resetLink,
})


export default connect(mapStateToProps, { passReset, clearErrors, startPassReset })(PassResetForm)
