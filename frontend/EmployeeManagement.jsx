import { useState, useEffect } from 'react'
import { Plus, Search, Eye, Trash2, Mail, Phone, Calendar } from 'lucide-react'

const EmployeeManagement = ({ token, user }) => {
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const [newEmployee, setNewEmployee] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    start_date: '',
    initial_pto_hours: 80
  })

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    let filtered = employees.filter(employee =>
      `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredEmployees(filtered)
  }, [employees, searchTerm])

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/employees', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setEmployees(data)
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEmployee = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee),
      })
      if (response.ok) {
        setShowAddDialog(false)
        fetchEmployees()
      } else {
        alert('Failed to add employee')
      }
    } catch (error) {
      console.error('Error adding employee:', error)
    }
  }

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await fetch(`/api/employees/${employeeId}`, { method: 'DELETE' })
        fetchEmployees()
      } catch (error) {
        console.error('Error deleting employee:', error)
      }
    }
  }

  if (loading) return <div>Loading employees...</div>

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Employee Management</h2>
        <button onClick={() => setShowAddDialog(true)} style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
          <Plus size={16} style={{ display: 'inline-block', marginRight: '0.5rem' }} />
          Add Employee
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
        />
      </div>

      {/* Add Employee Dialog */}
      {showAddDialog && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', width: '400px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Add New Employee</h3>
            <form onSubmit={handleAddEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input placeholder="First Name" value={newEmployee.first_name} onChange={(e) => setNewEmployee({...newEmployee, first_name: e.target.value})} required style={{ padding: '0.5rem', border: '1px solid #d1d5db' }} />
              <input placeholder="Last Name" value={newEmployee.last_name} onChange={(e) => setNewEmployee({...newEmployee, last_name: e.target.value})} required style={{ padding: '0.5rem', border: '1px solid #d1d5db' }} />
              <input type="email" placeholder="Email" value={newEmployee.email} onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})} required style={{ padding: '0.5rem', border: '1px solid #d1d5db' }} />
              <input placeholder="Phone" value={newEmployee.phone} onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})} style={{ padding: '0.5rem', border: '1px solid #d1d5db' }} />
              <input type="date" placeholder="Start Date" value={newEmployee.start_date} onChange={(e) => setNewEmployee({...newEmployee, start_date: e.target.value})} required style={{ padding: '0.5rem', border: '1px solid #d1d5db' }} />
              <textarea placeholder="Address" value={newEmployee.address} onChange={(e) => setNewEmployee({...newEmployee, address: e.target.value})} style={{ padding: '0.5rem', border: '1px solid #d1d5db' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddDialog(false)} style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none' }}>Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employees Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Contact</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Start Date</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem' }}>{employee.first_name} {employee.last_name}</td>
              <td style={{ padding: '0.75rem' }}>{employee.email}</td>
              <td style={{ padding: '0.75rem' }}>{new Date(employee.start_date).toLocaleDateString()}</td>
              <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleDeleteEmployee(employee.id)} style={{ color: '#dc2626', border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                <button onClick={() => setSelectedEmployee(employee)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><Eye size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Details View */}
      {selectedEmployee && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Details for {selectedEmployee.first_name}</h3>
          <p>Email: {selectedEmployee.email}</p>
          <p>Phone: {selectedEmployee.phone}</p>
          <p>Start Date: {new Date(selectedEmployee.start_date).toLocaleDateString()}</p>
          <p>Address: {selectedEmployee.address}</p>
          <button onClick={() => setSelectedEmployee(null)} style={{ marginTop: '1rem', border: '1px solid #d1d5db', padding: '0.5rem 1rem' }}>Close</button>
        </div>
      )}
    </div>
  )
}

export default EmployeeManagement
