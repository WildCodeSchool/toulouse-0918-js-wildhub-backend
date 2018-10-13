import React from 'react';
import { Link } from 'react-router-dom';

const LinksToOtherPages = props => (
  <div className="col-6 col-md-8">
    <ul>
      <li>
        <Link to="/my-github-repos">Mes dépôts GitHub</Link>
      </li>
      <li>
        <Link to="/my-wildhub-repos">Mes dépôts sélectionnés pour WildHub</Link>
      </li>
      <li>
        <Link to="/all-wildhub-repos">Tous les dépôts disponibles sur WilHub</Link>
      </li>
    </ul>
  </div>
);

export default LinksToOtherPages;
