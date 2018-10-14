create table users (
  iid INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id INTEGER NOT NULL,
  login VARCHAR(100),
  avatar VARCHAR(255)
);

create table projects (
  iid INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id INTEGER NOT NULL,
  ownerGithubId INTEGER NOT NULL,
  ownerLogin VARCHAR(100),
  active BOOLEAN DEFAULT FALSE,
  name VARCHAR(255),
  prettyName VARCHAR(255),
  description TEXT,
  homepage VARCHAR(255),
  htmlUrl VARCHAR(255),
  language VARCHAR(30),
  registeredAt TIMESTAMP NOT NULL DEFAULT NOW(),
  createdAt TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP NOT NULL
);

create table projects_languages (
  iid INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  projectId INTEGER NOT NULL,
  languageId INTEGER NOT NULL,
  quantity INTEGER NOT NULL
);

create table languages (
  iid INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64)
);