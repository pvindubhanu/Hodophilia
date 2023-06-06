drop database hodophiliadb;
drop user hodophilia;
create user hodophilia with password 'password';
create database hodophiliadb with template=template0 owner=hodophilia;
\connect hodophiliadb;
alter default privileges grant all on tables to hodophilia;
alter default privileges grant all on sequences to hodophilia;

create table hodo_users(
user_id integer primary key not null,
first_name varchar(20) not null,
last_name varchar(20) not null,
email_id varchar(30) not null,
password text not null
);

create sequence hodo_users_seq increment 1 start 1;