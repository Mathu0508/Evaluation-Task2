create database EmployeesDB

CREATE TABLE Employees (
    id INT PRIMARY KEY Identity(1,1),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(50) NOT NULL,
    join_date DATE NOT NULL
);

-- Insert sample employees
INSERT INTO Employees (name, email, department, join_date) 
VALUES 
    ('John', 'john@example.com', 'Engineering', '2025-01-15'),
    ('Jane Smith', 'jane@example.com', 'HR', '2025-05-10'),
    ('Mike Johnson', 'mike@example.com', 'Marketing', '2025-04-10');

-- Update an employee
UPDATE Employees 
SET 
    name = 'John Smith',
    email = 'johnsmith@example.com',
    department = 'Finance',
    join_date = '2025-05-01'
WHERE id = 1;

-- Delete an employee
DELETE FROM Employees WHERE id = 2;

-- Find employees who joined in the last 30 days
SELECT * FROM Employees 
WHERE join_date >= DATEADD(DAY, -30, GETDATE());
