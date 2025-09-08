import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Users, Database, Settings, Shield, Download } from 'lucide-react'

const AdminPanel = ({ token, user }) => {
  const [users, setUsers] = useState([])
  const [dbStats, setDbStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const usersRes = await fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } })
      const usersData = await usersRes.json()
      setUsers(usersData)

      const statsRes = await fetch('/api/admin/database/stats', { headers: { 'Authorization': `Bearer ${token}` } })
      const statsData = await statsRes.json()
      setDbStats(statsData)
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newUser),
      })
      if (response.ok) {
        setShowAddUserDialog(false)
        fetchData()
      } else {
        alert('Failed to add user')
      }
    } catch (error) {
      console.error('Error adding user:', error)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        fetchData()
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  if (loading) return <div>Loading admin panel...</div>

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Admin Panel</h2>
        <button onClick={() => setShowAddUserDialog(true)} style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
          <Plus size={16} style={{ display: 'inline-block', marginRight: '0.5rem' }} />
          Add User
        </button>
      </div>

      {/* Add User Dialog */}
      {showAddUserDialog && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', width: '400px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Add New User</h3>
            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} required style={{ padding: '0.5rem', border: '1px solid #d1d5db' }} />
              <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} required style={{ padding: '0.5rem', border: '1px solid #d1d5db' }} />
              <input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} required style={{ padding: '0.5rem', border: '1px solid #d1d5db' }} />
              <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} style={{ padding: '0.5rem', border: '1px solid #d1d5db' }}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddUserDialog(false)} style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none' }}>Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '1rem' }}>User Management</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Username</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Role</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem' }}>{u.username}</td>
              <td style={{ padding: '0.75rem' }}>{u.email}</td>
              <td style={{ padding: '0.75rem' }}>{u.role}</td>
              <td style={{ padding: '0.75rem' }}>
                <button onClick={() => handleDeleteUser(u.id)} style={{ color: '#dc2626', border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminPanel
