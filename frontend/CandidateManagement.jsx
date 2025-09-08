import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Plus, Search, Filter, Check, X, Eye, Edit, Trash2, Mail, Phone } from 'lucide-react'

const CandidateManagement = ({ token, user }) => {
  const [candidates, setCandidates] = useState([])
  const [filteredCandidates, setFilteredCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [approvalFilter, setApprovalFilter] = useState('all')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  const [newCandidate, setNewCandidate] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    pipeline_status: 'Applied',
    resume_path: ''
  })

  useEffect(() => {
    fetchCandidates()
  }, [])

  useEffect(() => {
    filterCandidates()
  }, [candidates, searchTerm, statusFilter, approvalFilter])

  const fetchCandidates = async () => {
    try {
      const response = await fetch('/api/candidates', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      setCandidates(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching candidates:', error)
      setLoading(false)
    }
  }

  const filterCandidates = () => {
    let filtered = candidates

    if (searchTerm) {
      filtered = filtered.filter(candidate =>
        candidate.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(candidate => candidate.pipeline_status === statusFilter)
    }

    if (approvalFilter !== 'all') {
      filtered = filtered.filter(candidate => candidate.admin_approval === approvalFilter)
    }

    setFilteredCandidates(filtered)
  }

  const handleAddCandidate = async () => {
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
        const candidate = await response.json()
        setCandidates([...candidates, candidate])
        setNewCandidate({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          pipeline_status: 'Applied',
          resume_path: ''
        })
        setShowAddDialog(false)
      }
    } catch (error) {
      console.error('Error adding candidate:', error)
    }
  }

  const handleApproveCandidate = async (candidateId) => {
    try {
      const response = await fetch(`/api/candidates/${candidateId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const updatedCandidate = await response.json()
        setCandidates(candidates.map(c => c.id === candidateId ? updatedCandidate : c))
      }
    } catch (error) {
      console.error('Error approving candidate:', error)
    }
  }

  const handleDenyCandidate = async (candidateId) => {
    try {
      const response = await fetch(`/api/candidates/${candidateId}/deny`, {
        method: 'POST',
      })

      if (response.ok) {
        const updatedCandidate = await response.json()
        setCandidates(candidates.map(c => c.id === candidateId ? updatedCandidate : c))
      }
    } catch (error) {
      console.error('Error denying candidate:', error)
    }
  }

  const handleUpdateStatus = async (candidateId, newStatus) => {
    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pipeline_status: newStatus }),
      })

      if (response.ok) {
        const updatedCandidate = await response.json()
        setCandidates(candidates.map(c => c.id === candidateId ? updatedCandidate : c))
      }
    } catch (error) {
      console.error('Error updating candidate status:', error)
    }
  }

  const handleDeleteCandidate = async (candidateId) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        const response = await fetch(`/api/candidates/${candidateId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setCandidates(candidates.filter(c => c.id !== candidateId))
        }
      } catch (error) {
        console.error('Error deleting candidate:', error)
      }
    }
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      'Applied': 'bg-blue-100 text-blue-800',
      'Interviewing': 'bg-yellow-100 text-yellow-800',
      'Offered': 'bg-purple-100 text-purple-800',
      'Approved': 'bg-green-100 text-green-800',
      'Denied': 'bg-red-100 text-red-800'
    }
    return statusColors[status] || 'bg-gray-100 text-gray-800'
  }

  const getApprovalBadge = (approval) => {
    const approvalColors = {
      'Approved': 'bg-green-100 text-green-800',
      'Denied': 'bg-red-100 text-red-800',
      'Pending': 'bg-orange-100 text-orange-800'
    }
    return approvalColors[approval] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading candidates...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Candidate Management</h2>
          <p className="text-gray-600">Track and manage potential hires through the recruitment pipeline</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Candidate
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Candidate</DialogTitle>
              <DialogDescription>
                Enter the candidate's information to add them to the pipeline.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={newCandidate.first_name}
                    onChange={(e) => setNewCandidate({...newCandidate, first_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={newCandidate.last_name}
                    onChange={(e) => setNewCandidate({...newCandidate, last_name: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCandidate.email}
                  onChange={(e) => setNewCandidate({...newCandidate, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newCandidate.phone}
                  onChange={(e) => setNewCandidate({...newCandidate, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Pipeline Status</Label>
                <Select value={newCandidate.pipeline_status} onValueChange={(value) => setNewCandidate({...newCandidate, pipeline_status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Interviewing">Interviewing</SelectItem>
                    <SelectItem value="Offered">Offered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddCandidate}>Add Candidate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pipeline Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="Interviewing">Interviewing</SelectItem>
                <SelectItem value="Offered">Offered</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Denied">Denied</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={approvalFilter} onValueChange={setApprovalFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Admin Approval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Approvals</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Denied">Denied</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Candidates ({filteredCandidates.length})</CardTitle>
          <CardDescription>
            Manage candidate applications and track their progress through the hiring pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Pipeline Status</TableHead>
                <TableHead>Admin Approval</TableHead>
                <TableHead>Indeed Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{candidate.first_name} {candidate.last_name}</div>
                      <div className="text-sm text-gray-500">ID: {candidate.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {candidate.email}
                      </div>
                      {candidate.phone && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Phone className="h-3 w-3" />
                          {candidate.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select value={candidate.pipeline_status} onValueChange={(value) => handleUpdateStatus(candidate.id, value)}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="Interviewing">Interviewing</SelectItem>
                        <SelectItem value="Offered">Offered</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge className={getApprovalBadge(candidate.admin_approval)}>
                      {candidate.admin_approval}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {candidate.indeed_status ? (
                      <Badge variant="outline">{candidate.indeed_status}</Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {candidate.admin_approval === 'Pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproveCandidate(candidate.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDenyCandidate(candidate.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCandidate(candidate)
                          setShowDetailsDialog(true)
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCandidate(candidate.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Candidate Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Candidate Details</DialogTitle>
          </DialogHeader>
          {selectedCandidate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Name</Label>
                  <p className="text-sm">{selectedCandidate.first_name} {selectedCandidate.last_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p className="text-sm">{selectedCandidate.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Phone</Label>
                  <p className="text-sm">{selectedCandidate.phone || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Pipeline Status</Label>
                  <Badge className={getStatusBadge(selectedCandidate.pipeline_status)}>
                    {selectedCandidate.pipeline_status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Admin Approval</Label>
                  <Badge className={getApprovalBadge(selectedCandidate.admin_approval)}>
                    {selectedCandidate.admin_approval}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Indeed Status</Label>
                  <p className="text-sm">{selectedCandidate.indeed_status || 'Not synced'}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Created</Label>
                <p className="text-sm">{new Date(selectedCandidate.created_at).toLocaleDateString()}</p>
              </div>
              {selectedCandidate.indeed_registration_id && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Indeed Registration ID</Label>
                  <p className="text-sm font-mono">{selectedCandidate.indeed_registration_id}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CandidateManagement

