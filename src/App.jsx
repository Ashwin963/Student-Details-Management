import React, { useState, useEffect } from 'react';
// The problematic import 'import './App.css';' has been removed.
import './App.css';
// --- Constants ---
const VALID_USERNAME = "admin";
const VALID_PASSWORD = "password123";
const STORAGE_KEY = 'studentDetails';
const IS_LOGGED_IN_KEY = 'isLoggedIn';

// Helper function to load student data from local storage
const loadStudentData = () => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (e) {
      console.error("Error parsing student data from localStorage:", e);
      return [];
    }
  }
  return [];
};

// Helper function to load login status from local storage
const loadLoginStatus = () => {
  return localStorage.getItem(IS_LOGGED_IN_KEY) === 'true';
};


function App() {
  // --- State Variables ---
  const initialLoginStatus = loadLoginStatus(); 
  
  // Initialize login state
  const [isLoggedIn, setIsLoggedIn] = useState(initialLoginStatus);
  
  // FIX: Initialize studentData directly from storage IF the user is already logged in.
  const [studentData, setStudentData] = useState(initialLoginStatus ? loadStudentData() : []);
  
  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  // Add Student form state
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');

  // --- Effects for Data Persistence ---

  // 1. Save Student Data whenever studentData state changes
  useEffect(() => {
    if (isLoggedIn) {
        // Save the current state of studentData to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(studentData));
    }
  }, [studentData, isLoggedIn]);
  
  // 2. Save Login Status whenever isLoggedIn state changes
  useEffect(() => {
      localStorage.setItem(IS_LOGGED_IN_KEY, isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  // --- Handlers ---

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsLoggedIn(true);
      setLoginMessage('');
      
      // Load persistent data here only after a successful fresh login
      setStudentData(loadStudentData()); 
    } else {
      setIsLoggedIn(false);
      setLoginMessage("Invalid username or password.");
      setPassword('');
    }
  };

  const handleAddStudent = (e) => {
    e.preventDefault();

    if (!name || !dob || !gender || !age) {
      // Using console.error instead of alert()
      console.error("Validation Error: All fields must be filled out!");
      return;
    }

    const newStudent = { name, dob, gender, age: Number(age) };
    
    setStudentData([...studentData, newStudent]);

    // Clear form fields
    setName('');
    setDob('');
    setGender('');
    setAge('');
  };

  // --- Render Functions ---

  const renderLogin = () => (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white border border-gray-200 rounded-xl shadow-2xl text-center">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">🔒 Application Login</h2>
        <form onSubmit={handleLogin}>
          <input 
            className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text" 
            placeholder="Username (admin)" 
            required 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          /> <br></br>
          <input 
            className="w-full p-3 mb-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password" 
            placeholder="Password (password123)" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          /><br></br>
          <button 
            type="submit" 
            className="w-1/2 md:w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out"
          >
            Login
          </button><br></br>
          <p className="mt-4 text-sm" style={{ color: 'red' }}>{loginMessage}</p>
        </form>
      </div>
    </div>
  );

  const renderApp = () => (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto bg-white rounded-lg shadow-lg my-10">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-700">🧑‍🎓 Student Details Management</h2>

      <div className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Student</h3>
        <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <input 
            type="text" 
            placeholder="Name" 
            required 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="col-span-1 md:col-span-2 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          /><br></br>
          <input 
            type="text" 
            placeholder="D.O.B (DD/MM/YYYY)" 
            required 
            value={dob} 
            onChange={(e) => setDob(e.target.value)} 
            className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          /><br></br>
          <input 
            type="text" 
            placeholder="Gender" 
            required 
            value={gender} 
            onChange={(e) => setGender(e.target.value)} 
            className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          /><br></br>
          <input 
            type="number" 
            placeholder="Age" 
            required 
            value={age} 
            onChange={(e) => setAge(e.target.value)} 
            className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          /><br></br>
          <button 
            type="submit" 
            className="p-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out"
          >
            Add Student
          </button><br></br>
        </form>
      </div>

      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Registered Students:</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow-md">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">S.No</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">D.O.B</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Gender</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Age</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Map over the studentData state to render table rows */}
            {studentData.map((student, index) => (
              <tr key={index} className="hover:bg-gray-50 transition duration-100">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{student.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{student.dob}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{student.gender}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{student.age}</td>
              </tr>
            ))}
            {studentData.length === 0 && (
                <tr>
                    <td colSpan="5" className="px-4 py-4 text-center text-gray-500 italic">No student records found. Add a new student above.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // --- Main Component Render ---
  return (
    <div className="App min-h-screen bg-gray-100 font-sans">
      {isLoggedIn ? renderApp() : renderLogin()}
    </div>
  );
}

export default App;