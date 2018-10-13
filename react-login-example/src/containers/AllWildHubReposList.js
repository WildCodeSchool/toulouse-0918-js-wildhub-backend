import React, { Component } from 'react';
import RepositoryList from '../components/RepositoryList';
import { apiAxios } from '../axiosInstances';

class AllWildHubReposList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: []
    };
  }

  componentDidMount() {
    this.fetchReposFromWildHubApi();
  }

  /**
   * Va chercher la liste des projets de l'utilisateur sur l'API WildHub
   */
  fetchReposFromWildHubApi() {
      apiAxios.get('users/self/projects')
        .then(res => res.data)
        .then(repos => this.setState({ repos }));
  }

  render() {
    const { repos } = this.state;
    return <RepositoryList repos={repos} />
  }
}

export default AllWildHubReposList;