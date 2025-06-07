import { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [form, setForm] = useState({ name: '', email: '', position: '' });
  const [employee, setEmployee] = useState({});
  const [searchId, setSearchId] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:5000/api/employees', form);
    alert('Employee added: ' + JSON.stringify(res.data));
  };

  const handleSearch = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/employees/${searchId}`
    );
    setEmployee(res.data);
  };

  return (
    <div>
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="position" placeholder="Position" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>

      <h2>Find Employee by ID</h2>
      <input
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        placeholder="Enter ID"
      />
      <button onClick={handleSearch}>Search</button>

      {employee?.id && (
        <div>
          <p>Name: {employee.name}</p>
          <p>Email: {employee.email}</p>
          <p>Position: {employee.position}</p>
        </div>
      )}
    </div>
  );
}

