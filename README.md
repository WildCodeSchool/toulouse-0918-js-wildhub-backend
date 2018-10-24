# API pour WildHub

## Comment ça marche ?

L'API du projet est une "API REST". Sans entrer dans les détails, les API REST offrent une architecture "standard" permettant d'accéder aux données présentes sur un serveur (et stockées le plus souvent dans une base de données comme MySQL, PostgreSQL, SQLite, mongoDB, etc.).
Les opérations possibles sur une API sont résumées par l'acronyme *CRUD* :
* **C** pour Create : créer une entrée dans la base de données
* **R** pour Read : lire une entrée (*read one*) ou toutes les entrées (*read all*) de la base de données
* **U** pour Update : mettre à jour une entrée
* **D** pour Delete : supprimer une entrée

Les URL sont souvent formées d'un socle commun, suivi éventuellement d'un *id* permettant d'identifier une certaine "ressource". Prenons l'exemple d'un blog.
Je vais manipuler deux types de données : des articles (*posts*) et des commentaires (*comments*).

Pour accéder aux articles, je vais envoyer des requêtes vers des URL dont le préfixe commun sera par exemple `/posts` ou `/api/posts`.
De plus, je vais utiliser une des "méthodes" offertes par le protocole HTTP.

* Une requête en méthode `GET` correspond au *Read* de CRUD, et est ce qui nous est le plus familier : c'est la méthode par défaut du navigateur web, quand on valide une adresse dans la barre d'adresses, ou quand on clique sur un lien.
On cherche à *obtenir* des données. Sur une API REST classique, pour obtenir des articles, on va faire des requêtes en méthode `GET` sur les URL suivantes :

    * `/api/posts` pour obtenir tous les articles (éventuellement avec une notion de pagination, pour limiter le nombre de résultats à 20 par requêtes)
    * `/api/posts/ID` pour obtenir un article seul (en remplaçant `ID` par l'identifiant numérique de l'article dans la bases de données)

* Une requête en `POST` correspond au *Create* de CRUD, permet d'envoyer des données vers une API. C'est celle qui est typiquement utilisée quand on soumet un formulaire d'inscription ou de connexion.
Une requête en `POST` vers `/api/posts` permet de créer un article.
* Les requêtes en `PUT` ou en `PATCH` permettent aussi d'envoyer des données vers l'API. L'une domme l'autre correspondent au *Update* de CRUD et s'effectue vers l'URL `/api/posts/ID`. `PUT` est utilisée pour envoyer au serveur *tout* l'objet à mettre à jour, `PATCH` pour ne modifier que les champs spécifiés dans la requête qu'on envoie.
* Une requête en `DELETE` correspond logiquement au *Delete* de CRUD, et permet de demander la suppression d'une entrée dans la base de données de l'API. Elle se fait aussi vers une URL type `/api/posts/ID`.

## Les routes disponibles (en cours d'élaboration)

Toutes les routes décrites sont disponibles en concaténant le chemin de la route à l'URL de base ou *Base URL* suivante&nbsp;:&nbsp;[https://wildhub.ssd1.ovh](https://wildhub.ssd1.ovh).

Liste complète (détails en suivant) :
* `GET /api/projects` récupérer tous les projets (repos)
* `POST /api/projects` référencer/déréférencer un projet
* `GET /api/projects/by-language/:lang` récupérer tous les projets utilisant un certain langage
* `GET /api/users` récupérer tous les utilisateurs
* `GET /api/users/:login` récupérer un utilisateur par son login GitHub
* `GET /api/users/:login/projects` récupérer les projets d'un utilisateur
* `GET /api/users/self/projects` récupérer les projets de l'utilisateur connecté
* `GET /api/users/:login/:repoName` récupérer un repo précis d'un utilisateur

### `GET /api/projects` - récupérer tous les projets

* Méthode : `GET`
* Chemin de la route: `/api/projects`

Exemple d'utilisation avec `fetch` (la méthode par défaut est `GET`, on n'a donc pas besoin de la spécifier) :

```javascript
fetch('https://wildhub.ssd1.ovh/api/projects')
  .then(res => res.json())
  .then(repos => {
    // utiliser les repos
  });
```

Exemple de retour de l'API (résultat avec des projets enregistrés sur mon ordinateur) :

```json
[
  {
    "iid":31,
    "id":153817247,
    "active":1,
    "name":"cpp",
    "pretty_name":"cpp",
    "description":null,
    "homepage":null,
    "html_url":"https://github.com/WWWilder/cpp",
    "language":"C++",
    "registered_at":"2018-10-19T17:42:02.000Z",
    "created_at":"2018-10-19T15:16:07.000Z",
    "updated_at":"2018-10-19T15:16:24.000Z",
    "language_stat":{
      "C++":391
    },
    "owner":{
      "id":36938461,
      "login":"WWWilder"
    }
  },
  {
    "iid":10,
    "id":152908263,
    "active":1,
    "name":"wildhub-test",
    "pretty_name":"wildhub-test",
    "description":"Test repo for WildHub",
    "homepage":null,
    "html_url":"https://github.com/WildWilder31/wildhub-test",
    "language":"JavaScript",
    "registered_at":"2018-10-14T10:56:10.000Z",
    "created_at":"2018-10-13T17:43:10.000Z",
    "updated_at":"2018-10-13T17:46:09.000Z",
    "language_stat":{
      "HTML":249,
      "JavaScript":240
    },
    "owner":{
      "id":36938730,
      "login":"WildWilder31"
    }
  }
]
```

On reçoit un tableau de reposittories. Explicitation des champs :
* `iid` identifiant interne du projet/repo dans l'API WildHub
* `id` identifiant du projet sur GitHub
* `owner` *propriétaire* du projet: objet ayant deux propriétés `id` et `login` (id dans la base de données de GitHub et identifiant de connextion)
* `name` et `pretty_name` le nom du projet sur GitHub. L'idée de base derrière cela, est qu'on pourrait permettre, depuis l'app React, d'indiquer un nom différent. Pour l'instant ce sont les deux mêmes, et mieux vaut garder `name` identique à celui sur GitHub.
* `language`: identique au champ correspondant sur GitHub, c'est à dire le langage principal utilisé
* `languate_stat`: statistiques des langages utilisés

### `POST /api/projects` enregistrer/référencer un projet

* Méthode : `POST`
* Chemin de la route: `/api/projects`

C'est bien le même chemin que pour la route en `GET`, mais cette route est bien distinguée de la précédente par le serveur, du fait même qu'on spécifie la méthode lors de l'appel.

Exemple avec `fetch` (sur les repos de "TJ", un contributeur massif à la communauté Node.js, auteur notamment d'Express et Mocha) :

```javascript
// Récupération des repos sur GitHub
fetch('https://api.github.com/users/tj/repos')
  .then(res => res.json())
  .then(repos => {
    // stocker les repos, par exemple dans le state....
    this.setState({ repos });
  });

// ... dans une autre méthode ...

// Lors de l'appui sur un bouton par exemple, on détecte l'index du repo qui a été cliqué
// pour ensuite lancer la requête pour le référencer
handleClickSaveButton(index) {
  const repoToSave = this.state.repos[index];
  fetch('https://wildhub.ssd1.ovh/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'  // informe le serveur qu'on lui envoie du JSON
    },
    body: JSON.stringify(repoToSave)
  })
    .then(res => res.json())
    .then(repo => {
      // On reçoit les données du repo sauvegardé
    });
}
```

### `GET /api/projects/by-language/:lang` récupérer les projets par langage

Cette route s'appelle en GET, dans l'URL il faut remplacer `:lang` par le langage en question.
Par exemple `/api/projects/by-language/JavaScript`.

### `GET /api/users` récupérer tous les utilisateurs

Cette route permet de récupérer tous les utilisateurs qui se sont connectés au moins une fois à la plateforme.

### `GET /api/users/:login` récupérer un utilisateur par son login GitHub

On appelle cette route en remplaçant `:login` par le login GitHub de l'utilisateur. Par exemple `/api/users/WildWilder31` pour récupérer le profil de `WildWilder31`.

### `GET /api/users/:login/projects` récupérer les projets d'un utilisateur

En remplaçant `:login` par le login de l'utilisateur, on peut récupérer tous ses projets.

#### `GET /api/users/:login/:repoName` récupérer un repo précis d'un utilisateur

Remplacer `:login` par le login de l'utilisateur, et `:repoName` par le nom du repo.