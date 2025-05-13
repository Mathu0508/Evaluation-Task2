// Mock data
let employees = [
    { id: 1, name: "John Doe", email: "john@example.com", department: "Engineering", joinDate: "2023-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", department: "HR", joinDate: "2023-05-20" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", department: "Marketing", joinDate: "2023-06-10" },
    // Add a recent employee (within last 30 days)
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", department: "Finance", joinDate: new Date().toISOString().split('T')[0] }
];

// DOM elements
const employeeForm = document.getElementById('employeeForm');
const employeeList = document.getElementById('employeeList');
const employeeIdField = document.getElementById('employeeId');
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const departmentField = document.getElementById('department');
const joinDateField = document.getElementById('joinDate');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const recentBtn = document.getElementById('recentBtn');
const allBtn = document.getElementById('allBtn');

// Display employees
function displayEmployees(employeesToDisplay = employees) {
    employeeList.innerHTML = '';
    
    employeesToDisplay.forEach(employee => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.email}</td>
            <td>${employee.department}</td>
            <td>${formatDate(employee.joinDate)}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${employee.id}">Edit</button>
                <button class="action-btn delete-btn" data-id="${employee.id}">Delete</button>
            </td>
        `;
        
        employeeList.appendChild(row);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', editEmployee);
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', deleteEmployee);
    });
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Validate form
function validateForm() {
    let isValid = true;
    
    // Reset errors
    nameError.textContent = '';
    emailError.textContent = '';
    
    // Validate name
    if (nameField.value.trim() === '') {
        nameError.textContent = 'Name is required';
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value)) {
        emailError.textContent = 'Please enter a valid email';
        isValid = false;
    }
    
    return isValid;
}

// Add or update employee
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const employeeId = employeeIdField.value;
    
    if (employeeId) {
        // Update existing employee
        const index = employees.findIndex(emp => emp.id === parseInt(employeeId));
        
        if (index !== -1) {
            employees[index] = {
                id: parseInt(employeeId),
                name: nameField.value,
                email: emailField.value,
                department: departmentField.value,
                joinDate: joinDateField.value
            };
        }
    } else {
        // Add new employee
        const newId = employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1;
        
        employees.push({
            id: newId,
            name: nameField.value,
            email: emailField.value,
            department: departmentField.value,
            joinDate: joinDateField.value
        });
        displayEmployees();
        saveEmployeesToLocalStorage();
    }
    
    // Reset form and update display
    resetForm();
    displayEmployees();
}

// Edit employee
function editEmployee(e) {
    const employeeId = parseInt(e.target.getAttribute('data-id'));
    const employee = employees.find(emp => emp.id === employeeId);
    
    if (employee) {
        employeeIdField.value = employee.id;
        nameField.value = employee.name;
        emailField.value = employee.email;
        departmentField.value = employee.department;
        joinDateField.value = employee.joinDate;
        
        submitBtn.textContent = 'Update Employee';
        cancelBtn.style.display = 'inline-block';
    }
    displayEmployees();
    saveEmployeesToLocalStorage();
}

// Delete employee
function deleteEmployee(e) {
    if (confirm('Are you sure you want to delete this employee?')) {
        const employeeId = parseInt(e.target.getAttribute('data-id'));
        employees = employees.filter(emp => emp.id !== employeeId);
        displayEmployees();
    }
    displayEmployees();
    saveEmployeesToLocalStorage();
}

// Reset form
function resetForm() {
    employeeForm.reset();
    employeeIdField.value = '';
    submitBtn.textContent = 'Add Employee';
    cancelBtn.style.display = 'none';
    nameError.textContent = '';
    emailError.textContent = '';
}

// Filter employees who joined in the last 30 days
function filterRecentEmployees() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEmployees = employees.filter(employee => {
        const joinDate = new Date(employee.joinDate);
        return joinDate >= thirtyDaysAgo;
    });
    
    displayEmployees(recentEmployees);
}
function saveEmployeesToLocalStorage() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Event listeners
employeeForm.addEventListener('submit', handleFormSubmit);
cancelBtn.addEventListener('click', resetForm);
recentBtn.addEventListener('click', filterRecentEmployees);
allBtn.addEventListener('click', () => displayEmployees());

// Initialize
displayEmployees();