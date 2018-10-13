import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import JSONTree from 'react-json-tree'
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import Navbar from './components/Navbar';
import LinksToOtherPages from './components/LinksToOtherPages';
import MyGitHubReposList from './containers/MyGitHubReposList';
import MyWildHubReposList from './containers/MyWildHubReposList';
import AllWildHubReposList from './containers/AllWildHubReposList';
import { apiUrl } from './settings';
import { githubAxios, apiAxios } from './axiosInstances';
import theme from './theme';
import './App.css';

/**
 * Exemple d'utilisation de l'API
 */
class App extends Component {
  constructor (props) {
    super(props);
    // Récupération des données d'authentification, si disponibles
    const {
      jwt,
      login,
      githubId,
      accessToken
    } = this.getStoredAuthData();
    // Utilisation de la "object literal property value shorthand"
    // https://ariya.io/2013/02/es6-and-object-literal-property-value-shorthand
    // Equivalent à { jwt: jwt, login: login, ETC. }
    this.state = {
      jwt, login, githubId, accessToken
    };
  }

  /**
   * Récupération de données d'authentification stockées dans localStorage,
   * si elles sont disponibles
   */
  getStoredAuthData() {
    const jwt = localStorage.getItem('jwt');
    // On renvoie le tout vide si aucun JWT trouvé dans localStorage
    if (!jwt) {
      return { jwt: '', login: '', githubId: 0, accessToken: '' };
    }
    // Sinon on décode les infos contenues dans le JWT
    const { login, githubId, accessToken } = jwtDecode(jwt);
    this.setupAxiosInstances(accessToken, jwt);
    // Puis on renvoie tout
    return { jwt, login, githubId, accessToken };
  }

  setupAxiosInstances(accessToken, jwt) {
    // Set up GitHub axios instance
    Object.assign(githubAxios.defaults, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    // Set up WildHub API axios instance
    Object.assign(apiAxios.defaults, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
  }

  updateStateOnSuccess = ({ token }) => {
    const { accessToken, login, githubId } = jwtDecode(token);
    console.log('decoded jwt', accessToken, login, githubId);
    localStorage.setItem('jwt', token);

    // Configuration des deux instances d'axios
    // chacune avec leur token d'authentification
    this.setupAxiosInstances(accessToken, token);
    this.setState({
      jwt: token, accessToken, login, githubId
    });
    // this.fetchReposFromGitHub();
  };

  /**
   * Gère le cas où la première phase de l'authentification (autorisation pour WildHub
   * d'accéder à l'API GitHub) a fonctionné.
   * GitHub nous renvoie un code, qu'on envoie au serveur de l'API. Le serveur de l'API
   * va finaliser le login via GitHub en envoyant ce code à GitHub, qui en retour lui
   * fournit un "access token" qu'il faudra passer ensuite dans toutes les requêtes à
   * GitHub.
   */
  handleLoginSuccess = ({ code }) => axios.post(`${apiUrl}/api/github/code`, {
    code
  })
    .then(response => response.data)
    .then(this.updateStateOnSuccess);

  /**
   * Gère le cas où le login échoue (rien de spécial ici !)
   */
  handleLoginFailure = response => console.error(response);

  /**
   * On offre la possibilité de reset le state:
   *   - on remet les valeurs initiales
   *   - on supprime ce qui est enregistré dans localStorage
   */
  handleResetState = () => {
    localStorage.removeItem('jwt');
    this.setState({ jwt: '', login: '', githubId: 0, accessToken: '' })
  }

  render() {
    const { login } = this.state;
    return (
      <BrowserRouter>
        <div>
          <Navbar
            handleLoginSuccess={this.handleLoginSuccess}
            handleLoginFailure={this.handleLoginFailure}
            login={login}
          />
          <div className="container-fluid">
            <div className="row">
              <Switch>
                <Route path="/" exact component={LinksToOtherPages} />
                <Route
                  path="/my-github-repos"
                  render={props => <MyGitHubReposList {...props} login={login} />} />
                <Route path="/my-wildhub-repos" component={MyWildHubReposList} />
                <Route path="/all-wildhub-repos" component={AllWildHubReposList} />
              </Switch>
              <div className="col-6 col-md-4">
                {/* Card qui affiche le contenu du state  */}
                <div className="card">
                  <div className="card-header">
                    State
                    <button
                      onClick={this.handleResetState}
                      className="btn btn-sm btn-info"
                      style={{ float: 'right' }}
                    >
                      Reset
                    </button>
                  </div>
                  <div className="card-body">
                    <JSONTree data={this.state} theme={theme} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
