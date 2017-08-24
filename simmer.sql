DROP DATABASE IF EXISTS simmer;
CREATE DATABASE simmer;

\c simmer;

CREATE TABLE IF NOT EXISTS users (
  id varchar(17) NOT NULL,
  display_name varchar(256) NOT NULL,
  last_logoff timestamp NOT NULL,
  profile_url varchar(256) NOT NULL,
  avatar_url varchar(256) NOT NULL,
  recent_games varchar(16)[] NOT NULL DEFAULT '{}',
  last_fetch timestamp NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS games (
  id varchar(16) NOT NULL,
  name varchar(256) NOT NULL,
  description text NOT NULL,
  image_url varchar(256) NOT NULL,
  screenshots text[] NOT NULL,
  last_fetch timestamp NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS playtimes (
  steam_id varchar(17) NOT NULL,
  app_id varchar(16) NOT NULL,
  today integer NOT NULL,
  week integer NOT NULL,
  two_weeks integer NOT NULL,
  forever integer NOT NULL,
  PRIMARY KEY(steam_id, app_id)
);