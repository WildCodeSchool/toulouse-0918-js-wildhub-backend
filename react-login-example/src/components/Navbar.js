import React from 'react';
import GitHubLogin from 'react-github-login';
import { Link } from 'react-router-dom';
import { clientId, redirectUri } from '../settings';

const Navbar = props => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <Link className="navbar-brand" to="/">Example</Link>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav mr-auto flex-grow-1">
        <li className="nav-item active">
          <Link className="nav-link" to="/">Home</Link>
        </li>
      </ul>
      {
        props.login
        ? <span>Logged-in as <b>{props.login}</b></span>
        : <GitHubLogin
          className="btn btn-primary"
          scope="user:email,public_repo"
          clientId={clientId}
          redirectUri={redirectUri}
          onSuccess={props.handleLoginSuccess}
          onFailure={props.handleLoginFailure}
        />
      }
    </div>
  </nav>
);

export default Navbar;
