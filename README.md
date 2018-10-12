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

