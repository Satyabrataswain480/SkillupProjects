CREATE DATABASE IF NOT EXISTS demo;

USE demo;

CREATE TABLE IF NOT EXISTS employee (
    empid int NOT NULL,
    ename VARCHAR(255) NOT NULL,
    salary int NOT NULL
);

INSERT INTO employee (empid, ename, salary) VALUES
    (1,'John P', 99000),
    (2,'Jonathan Smith', 75000),
    (3, 'Emily Johnson', 50000);