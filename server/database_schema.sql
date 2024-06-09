CREATE DATABASE IF NOT EXISTS vision_center;

USE vision_center;

CREATE TABLE Students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    registration_date DATETIME
);

CREATE TABLE Courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_name VARCHAR(50),
    course_level VARCHAR(50),
    session_type VARCHAR(50),
    session_time VARCHAR(50),
    FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE
);

CREATE TABLE Fees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    fees_type VARCHAR(50),
    amount DECIMAL(10, 2),
    payment_date DATETIME,
    FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE
);
