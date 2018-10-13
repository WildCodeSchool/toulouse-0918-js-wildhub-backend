import React, { Component } from 'react';
import RepositoryList from '../components/RepositoryList';
import { githubAxios, apiAxios } from '../axiosInstances';

const getLangUrl = repo => repo.languages_url.replace('https://api.github.com', '');

class MyGitHubReposList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: []
    };
  }

  componentDidMount() {
    this.fetchReposFromGitHub();
  }

  /**
   * Va chercher la liste de repos de l'utilisateur sur GitHub, s'il est connecté
   */
  fetchReposFromGitHub() {
    const { login } = this.props;
    if (login) {
      githubAxios.get(`users/${login}/repos`)
        .then(res => res.data)
        .then(
          repos => {
            const promises = repos.map(
              repo => githubAxios.get(getLangUrl(repo))
                .then(result => result.data)
            );
            return Promise.all(promises)
              .then(languages => languages.map(
                (language, idx) => Object.assign(repos[idx], { language_stat: language })
              ))
              .then(repos => {
                console.log('got repos', repos);
                this.setState({ repos })
              });
          });
    }
  }

  handleClickCard = repo => {
    console.log('card clicked', repo);
    // Exemple d'association d'un repo
    apiAxios.post('/projects', repo);
  }

  render() {
    const { repos } = this.state;
    return <RepositoryList
      repos={repos}
      handleClick={this.handleClickCard}
    />;
  }
}

export default MyGitHubReposList;