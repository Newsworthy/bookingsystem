import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
// import ShoppingList from './components/ShoppingList';
import { Provider } from 'react-redux';
import store from './store';
// import ItemModal from './components/ItemModal';
import { Container } from 'reactstrap';
import { loadUser } from './actions/authActions';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import PassResetForm from './components/auth/PassResetForm';
import UserProfile from './components/auth/UserProfile';

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Router>
        <Provider store={store}>
          <div className="App">
            <AppNavbar />
            <Container>
              <Route exact={true} path="/api/users/resetpassword/:resetLink" component={PassResetForm} />
              <Route exact={true} path="/api/auth/:user" component={UserProfile} />

            </Container>
          </div>
        </Provider>
      </Router>
    );
  }

}

export default App;
