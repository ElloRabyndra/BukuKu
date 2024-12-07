-- Query Pembuatan Database

-- Buat Database
create database BukuKu;


-- Buat Tabel User
create table user (
  id_user int not null auto_increment,
  username varchar(255) not null,
  password varchar(255) not null,
  primary key(id_user)
);


-- Buat Tabel Categories
create table categories (
  id_categories int  not null auto_increment,
  name varchar(50),
  id_user int not null,
  primary key(id_categories),
  foreign key(id_user) references user(id_user)
);

-- Buat Tabel Book
create table book (
  id_book int not null auto_increment,
  id_user int not null,
  tittle varchar(255),
  author varchar(255),
  publisher varchar(255),
  status varchar(25) default 'Belum Dibaca',
  start_date date,
  end_date date, 
  notes text,
  cover_book varchar(100),
  id_categories int,
  primary key(id_book),
  foreign key(id_user) references user(id_user),
  foreign key(id_categories) references categories(id_categories) on delete set null on update cascade
);
