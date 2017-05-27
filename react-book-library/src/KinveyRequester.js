import $ from 'jquery';

let KinveyRequester = (function () {
  const baseUrl = 'https://baas.kinvey.com/';
  const appId = 'kid_Sk7BhySx-';
  const appSecret = '3bbaeeca7d3e4ca1b2e88386340865ec';
  const appAuthHeaders = {
    Authorization: 'Basic ' + btoa(appId + ':' + appSecret)
  };

  function loginUser(username, password) {
    return $.ajax(
      {
        method: 'POST',
        url: baseUrl + 'user/' + appId + '/login',
        headers: appAuthHeaders,
        data: JSON.stringify({username, password}),
        contentType: 'application/json'
      }
    );
  }

  function registerUser(username, password) {
    return $.ajax(
      {
        method: 'POST',
        url: baseUrl + 'user/' + appId + '/',
        headers: appAuthHeaders,
        data: {username, password}
      }
    );
  }

  function loadBooks() {
    return $.ajax(
      {
        method: 'GET',
        url: baseUrl + "appdata/" + appId + '/books',
        headers: getKinveyUserAuthHeaders()
      }
    );
  }

  function createBook(title, author, description) {
    return $.ajax(
      {
        method: 'POST',
        url: baseUrl + "appdata/" + appId + '/books',
        headers: getKinveyUserAuthHeaders(),
        data: {title, author, description}
      }
    );
  }

  function getKinveyUserAuthHeaders() {
        return {
            'Authorization': "Kinvey " + sessionStorage.getItem('authtoken'),
        };
    }

  return {
    loginUser,
    registerUser,
    loadBooks,
    createBook
  }
})();

export default KinveyRequester;
