create table entities (
  id integer primary key,
  type varchar(32),
  data jsonb default '{}'
);
