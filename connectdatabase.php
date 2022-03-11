<?php
// connect to database with module5admin user in MySQL
//create user 'module5admin'@'localhost' identified by 'password';
/*** Run the following to create database and table: ***/
/*
        CREATE DATABASE module5;
        
        CREATE TABLE users (
            id int(11) NOT NULL AUTO_INCREMENT,
            username varchar(50) NOT NULL,
            password varchar(255) NOT NULL,
            shared_with TEXT NOT NULL,
            PRIMARY KEY (id, username)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

        CREATE TABLE events (
            event_id int(11) NOT NULL AUTO_INCREMENT,
            username VARCHAR(50) NOT NULL,
            title VARCHAR(1023) NOT NULL,
            starttime VARCHAR(5) NOT NULL,
            endtime VARCHAR(5) NOT NULL,
            tag VARCHAR(10) NOT NULL,
            group_share TEXT NOT NULL,
            PRIMARY KEY (event_id)
        )ENGINE=InnoDB DEFAULT CHARSET=utf8;
        
    */


/*** Run the following to make module 5 admin and give permission to database ***/
/*
        CREATE USER 'module5admin'@'localhost' identified by 'password';
        
        grant select,insert,update,delete on module5.* to module5admin@'localhost';

        flush privileges;
    */

$mysqli = new mysqli('localhost', 'module5admin', 'password', 'module5');

if ($mysqli->connect_errno) {
    printf("Connection Failed: %s\n", $mysqli->connect_error);
    exit;
}
