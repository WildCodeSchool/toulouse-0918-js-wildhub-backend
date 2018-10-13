import React from 'react';
import RepositoryCard from './RepositoryCard';

const RepositoryList = props => (
  <div className="col-6 col-md-8">
    <div className="row">
    {
      props.repos.length > 0
      ? props.repos.map(repo => (
        <RepositoryCard
          key={repo.id}
          repo={repo}
          handleClick={props.handleClick}
        />
      ))
      : <div className="font-weight-bold">Empty repository list</div>
    }
    </div>
  </div>
);

export default RepositoryList;