import React, { Component } from 'react';
import GitHubLogin from 'react-github-login';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { clientId, redirectUri } from './settings';
import { post } from './api.js';
import './App.css';

const serverUrl = 'https://wildhub.ssd1.ovh';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      accessToken: '',
      repos: []
    };
  }
  componentDidMount() {
    this.fetchRepos();
  }
  fetchRepos() {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      this.setState({ accessToken });
      axios.get('https://api.github.com/users/bhubr/repos', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(res => res.data)
      .then(repos => this.setState({ repos }))
    }
  }

  onSuccess = ({ code }) => post(`${serverUrl}/api/github/code`, {
    code
  })
    .then(({ token }) => {
      const { accessToken, login, githubId } = jwtDecode(token);
      console.log('decoded jwt', accessToken, login, githubId);
      localStorage.setItem('jwt', token);
      localStorage.setItem('accessToken', accessToken);
      this.fetchRepos();
    });

  onFailure = response => console.error(response);

  render() {
    const { accessToken, repos } = this.state;
    return (
      <div className="App">
        <div>{accessToken}</div>
        <GitHubLogin
          clientId={clientId}
          redirectUri={redirectUri}
          onSuccess={this.onSuccess}
          scope="user:email,public_repo,gist"
          onFailure={this.onFailure}/>
          <ul>
            { repos.length && repos.map((r, k) => <li key={k}><a href={r.html_url}>{r.name}</a></li>)}
          </ul>
      </div>
    );
  }
}

export default App;
