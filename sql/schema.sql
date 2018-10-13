create table users (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  githubId INTEGER NOT NULL,
  login VARCHAR(100),
  avatar VARCHAR(255)
);

create table projects (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  githubId INTEGER NOT NULL,
  ownerGithubId INTEGER NOT NULL,
  ownerLogin VARCHAR(100),
  active BOOLEAN DEFAULT FALSE,
  name VARCHAR(255),
  prettyName VARCHAR(255),
  description TEXT,
  homepage VARCHAR(255),
  htmlUrl VARCHAR(255),
  language VARCHAR(30)
);

create table projects_languages (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  projectId INTEGER NOT NULL,
  languageId INTEGER NOT NULL,
  quantity INTEGER NOT NULL
);

create table languages (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64)
);