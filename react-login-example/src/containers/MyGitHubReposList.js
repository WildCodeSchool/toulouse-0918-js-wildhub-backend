import React, { Component } from 'react';
import RepositoryList from '../components/RepositoryList';
import { githubAxios } from '../axiosInstances';

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

  render() {
    const { repos } = this.state;
    return <RepositoryList repos={repos} />
  }
}

export default MyGitHubReposList;