import React, { Component } from 'react';
import RepositoryList from '../components/RepositoryList';
import { githubAxios, apiAxios } from '../axiosInstances';

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
        .then(repos => this.setState({ repos }));
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