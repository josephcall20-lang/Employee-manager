import { useState, useEffect } from 'react'
import { Plus, Search, Check, X, Eye, Trash2, Mail, Phone } from 'lucide-react'

const CandidateManagement = ({ token, user }) => {
  const [candidates, setCandidates] = useState([])
  const [filteredCandidates, setFilteredCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  const [newCandidate, setNewCandidate] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    status: 'pending',
    notes: '',
  })

  useEffect(() => {
    fetchCandidates()
  }, [])

  useEffect(() => {
    let filtered = candidates.filter(candidate =>
      `${candidate.first_name} ${candidate.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCandidates(filtered)
  }, [candidates, searchTerm])

  const fetchCandidates = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/candidates', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setCandidates(data)
    } catch (error) {
      console.error('Error fetching candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCandidate = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCandidate),
      })
      if (response.ok) {
        setShowAddDialog(false)
        fetchCandidates() // Refresh list
      } else {
        alert('Failed to add candidate')
      }
    } catch (error) {
      console.error('Error adding candidate:', error)
    }
  }

  const handleUpdateStatus = async (candidateId, newStatus) => {
    try {
      const response = await fetch(buildApiUrl(`/api/candidates/${candidateId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pipeline_status: newStatus }),
      })
      if (response.ok) {
        fetchCandidates()
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDeleteCandidate = async (candidateId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await fetch(`/api/candidates/${candidateId}`, { method: 'DELETE' })
        fetchCandidates()
      } catch (error) {
        console.error('Error deleting candidate:', error)
      }
    }
  }

  if (loading) return <div>Loading candidates...</div>

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Candidate Management</h2>
        <button onClick={() => setShowAddDialog(true)} style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
          <Plus size={16} style={{ display: 'inline-block', marginRight: '0.5rem' }} />
          Add Candidate
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
        />
      </div>

      {/* Add Candidate Dialog */}
      {showAddDialog && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', width: '400px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Add New Candidate</h3>
            <form onSubmit={handleAddCandidate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input placeholder="First Name" value={newCandidate.first_name} onChange={(e) => setNewCandidate({...newCandidate, first_name: e.target.value})} required style={{ padding: '0.5rem', border: '1px solid #d1d5db' }} />
              <input placeholder="Last Name" value={newCandidate.last_name} onChange={(e) => setNewCandidate({...newCandidate, last_name: e.target.value})} required style={{ padding: '0.5rem', border: '1px solid #d1d5db' }} />
              <input type="email" placeholder="Email" value={newCandidate.email} onChange={(e) => setNewCandidate({...newCandidate, email: e.target.value})} required style={{ padding: '0.5rem', border: '1px solid #d1d5db' }} />
              <input placeholder="Phone" value={newCandidate.phone} onChange={(e) => setNewCandidate({...newCandidate, phone: e.target.value})} style={{ padding: '0.5rem', border: '1px solid #d1d5db' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddDialog(false)} style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none' }}>Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidates Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Contact</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCandidates.map((candidate) => (
            <tr key={candidate.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem' }}>{candidate.first_name} {candidate.last_name}</td>
              <td style={{ padding: '0.75rem' }}>{candidate.email}</td>
              <td style={{ padding: '0.75rem' }}>
                <select value={candidate.pipeline_status} onChange={(e) => handleUpdateStatus(candidate.id, e.target.value)} style={{ padding: '0.25rem', border: '1px solid #d1d5db' }}>
                  <option>Applied</option>
                  <option>Interviewing</option>
                  <option>Offered</option>
                  <option>Approved</option>
                  <option>Denied</option>
                </select>
              </td>
              <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleDeleteCandidate(candidate.id)} style={{ color: '#dc2626', border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                <button onClick={() => setSelectedCandidate(candidate)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><Eye size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Details View */}
      {selectedCandidate && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Details for {selectedCandidate.first_name}</h3>
          <p>Email: {selectedCandidate.email}</p>
          <p>Phone: {selectedCandidate.phone}</p>
          <p>Status: {selectedCandidate.pipeline_status}</p>
          <button onClick={() => setSelectedCandidate(null)} style={{ marginTop: '1rem', border: '1px solid #d1d5db', padding: '0.5rem 1rem' }}>Close</button>
        </div>
      )}
    </div>
  )
}

export default CandidateManagement
