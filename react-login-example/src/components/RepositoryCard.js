import React from 'react';

// Bon exemple où Fragment est utile: je veux mettre directement
// les colonnes Bootstrap sous la row, sans avoir une div intermédiaire.
const RepositoryCard = props => (
  <div className="col-12 col-sm-6 col-md-4" style={{ marginBottom: '20px' }}>
    <div className="card">
      <div className="card-header">
        {props.repo.name}
      </div>
      <div className="card-body">
      </div>
    </div>
  </div>
);

export default RepositoryCard;