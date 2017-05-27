import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';

import NavigationBar from './Components/NavigationBar.js';
import Footer from './Components/Footer.js';
import Home from './Views/Home.js';
import Login from './Views/Login.js';
import Register from './Views/Register.js';
import ListBooks from './Views/ListBooks.js';
import CreateBook from './Views/CreateBook.js';

import $ from 'jquery';
import KinveyRequester from './KinveyRequester';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state =  {
      username: sessionStorage.getItem('username'),
      userId: sessionStorage.getItem('userId')
    };
  }

  componentDidMount() {
    $(document).on({
      ajaxStart: function() { $("#loadingBox").show() },
      ajaxStop: function() { $('#loadingBox').hide() }
    });

    $(document).ajaxError(
      this.handleAjaxError.bind(this));

    this.showHomeView();
  }

  handleAjaxError(event, response) {
    let errorMsg = JSON.stringify(response);
    if (response.readyState == 0)
      errorMsg = "Cannot connect due to network error."
    if (response.responseJSON && response.responseJSON.description)
      errorMsg = response.responseJSON.description;
    this.showError();
  }

  showInfo(msg) {
    $('#infoBox').text(msg).show();
    setTimeout(function () {
      $('#infoBox').fadeOut(500);
    }, 3000);
  }

  showError(errorMsg) {
    $('#errorBox').text('Error: ' + errorMsg).show();
    setTimeout(function() {
      $('#errorBox').hide(500);
    }, 5000);
  }

  render() {
    return (
      <div className="App">
        <header>
          <NavigationBar
            username = {this.state.username}
            homeClicked={this.showHomeView.bind(this)}
            loginClicked={this.showLoginView.bind(this)}
            registerClicked={this.showRegisterView.bind(this)}
            booksClicked={this.showBooksView.bind(this)}
            createBookClicked={this.showCreateBookView.bind(this)}
            logoutClicked={this.logout.bind(this)}
            />
          <div id="errorBox">Errors here</div>
          <div id="infoBox">Info msg</div>
          <div id="loadingBox">Loading ...</div>
        </header>
        <div id="main">
        </div>
        <Footer />
      </div>
    );
  }

  showView(reactComponent) {
    ReactDOM.render(
      reactComponent,
      document.getElementById('main')
    )

    $('#errorBox').hide();
  }

  showHomeView () {
    this.showView(<Home />)
  }

  showLoginView() {
    this.showView(<Login onSubmit={this.login.bind(this)} />);
  }

  login(username, password) {
    KinveyRequester.loginUser(username, password)
    .then(loginSuccess.bind(this));

    function loginSuccess(userInfo) {
      this.saveAuthInSession(userInfo);
      this.showInfo('Login successfull!')
    }
  }

  saveAuthInSession(userInfo) {
        sessionStorage.setItem('authtoken', userInfo._kmd.authtoken);
        sessionStorage.setItem('userId', userInfo._id);
        sessionStorage.setItem('username', userInfo.username);

        // This will update the entire app UI (e.g. the navigation bar)
        this.setState({
            username: userInfo.username,
            userId: userInfo._id
        });
    }

  showRegisterView() {
    this.showView(<Register onSubmit={this.register.bind(this)}/>);
  }

  register(username, password) {
        KinveyRequester.registerUser(username, password)
            .then(registerSuccess.bind(this));

        function registerSuccess(userInfo) {
            this.saveAuthInSession(userInfo);
            this.showBooksView();
            this.showInfo("User registration successful.");
        }
    }

  showBooksView() {
    KinveyRequester.loadBooks()
    .then(loadBooksSuccess.bind(this));

    function loadBooksSuccess(books) {
      this.showInfo('Books loaded');
      this.showView(<ListBooks books={books}/>)
    }
  }

  showCreateBookView() {
    this.showView(<CreateBook onSubmit={this.createBook.bind(this)} />)
  }

  createBook(title, author, description) {
    KinveyRequester.createBook(title, author, description)
    .then(createBookSuccess.bind(this));

    function createBookSuccess() {
      this.showInfo('Book created!');
      this.showBooksView();
    }
  }

  logout() {
    sessionStorage.clear();

    this.setState(
      {
        username: null,
        userId: null
      }
    )
  }
}

//export default App;
