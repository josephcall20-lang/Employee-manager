import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Plus, Search, Eye, Edit, Trash2, Mail, Phone, Calendar, FileText, Award, Clock, AlertTriangle } from 'lucide-react'

const EmployeeManagement = ({ token, user }) => {
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showAddItemDialog, setShowAddItemDialog] = useState(false)
  const [addItemType, setAddItemType] = useState('')

  const [newEmployee, setNewEmployee] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    start_date: '',
    initial_pto_hours: 80
  })

  const [newItem, setNewItem] = useState({})

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    filterEmployees()
  }, [employees, searchTerm])

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      setEmployees(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching employees:', error)
      setLoading(false)
    }
  }

  const fetchEmployeeDetails = async (employeeId) => {
    try {
      const response = await fetch(`/api/employees/${employeeId}`)
      const data = await response.json()
      setSelectedEmployee(data)
    } catch (error) {
      console.error('Error fetching employee details:', error)
    }
  }

  const filterEmployees = () => {
    let filtered = employees

    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredEmployees(filtered)
  }

  const handleAddEmployee = async () => {
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      })

      if (response.ok) {
        const employee = await response.json()
        setEmployees([...employees, employee])
        setNewEmployee({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          address: '',
          start_date: '',
          initial_pto_hours: 80
        })
        setShowAddDialog(false)
      }
    } catch (error) {
      console.error('Error adding employee:', error)
    }
  }

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee? This will also delete all related records.')) {
      try {
        const response = await fetch(`/api/employees/${employeeId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setEmployees(employees.filter(e => e.id !== employeeId))
        }
      } catch (error) {
        console.error('Error deleting employee:', error)
      }
    }
  }

  const handleAddItem = async () => {
    try {
      const endpoint = `/api/employees/${selectedEmployee.id}/${addItemType}`
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      })

      if (response.ok) {
        // Refresh employee details
        await fetchEmployeeDetails(selectedEmployee.id)
        setNewItem({})
        setShowAddItemDialog(false)
      }
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const openAddItemDialog = (type) => {
    setAddItemType(type)
    setNewItem({})
    setShowAddItemDialog(true)
  }

  const renderAddItemForm = () => {
    switch (addItemType) {
      case 'contracts':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="contract_title">Contract Title</Label>
              <Input
                id="contract_title"
                value={newItem.contract_title || ''}
                onChange={(e) => setNewItem({...newItem, contract_title: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="sign_date">Sign Date</Label>
              <Input
                id="sign_date"
                type="date"
                value={newItem.sign_date || ''}
                onChange={(e) => setNewItem({...newItem, sign_date: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="contract_path">Contract File Path</Label>
              <Input
                id="contract_path"
                value={newItem.contract_path || ''}
                onChange={(e) => setNewItem({...newItem, contract_path: e.target.value})}
              />
            </div>
          </div>
        )
      case 'administrative-actions':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="action_date">Action Date</Label>
              <Input
                id="action_date"
                type="date"
                value={newItem.action_date || ''}
                onChange={(e) => setNewItem({...newItem, action_date: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newItem.description || ''}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="document_path">Document Path</Label>
              <Input
                id="document_path"
                value={newItem.document_path || ''}
                onChange={(e) => setNewItem({...newItem, document_path: e.target.value})}
              />
            </div>
          </div>
        )
      case 'absences':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="absence_date">Absence Date</Label>
              <Input
                id="absence_date"
                type="date"
                value={newItem.absence_date || ''}
                onChange={(e) => setNewItem({...newItem, absence_date: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                value={newItem.reason || ''}
                onChange={(e) => setNewItem({...newItem, reason: e.target.value})}
              />
            </div>
          </div>
        )
      case 'licensures':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="license_name">License Name</Label>
              <Input
                id="license_name"
                value={newItem.license_name || ''}
                onChange={(e) => setNewItem({...newItem, license_name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="issuing_body">Issuing Body</Label>
              <Input
                id="issuing_body"
                value={newItem.issuing_body || ''}
                onChange={(e) => setNewItem({...newItem, issuing_body: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issue_date">Issue Date</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={newItem.issue_date || ''}
                  onChange={(e) => setNewItem({...newItem, issue_date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="expiry_date">Expiry Date</Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={newItem.expiry_date || ''}
                  onChange={(e) => setNewItem({...newItem, expiry_date: e.target.value})}
                />
              </div>
            </div>
          </div>
        )
      case 'awards':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="award_name">Award Name</Label>
              <Input
                id="award_name"
                value={newItem.award_name || ''}
                onChange={(e) => setNewItem({...newItem, award_name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="award_date">Award Date</Label>
              <Input
                id="award_date"
                type="date"
                value={newItem.award_date || ''}
                onChange={(e) => setNewItem({...newItem, award_date: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newItem.description || ''}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading employees...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
          <p className="text-gray-600">Manage employee information, contracts, and administrative records</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Enter the employee's information to add them to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={newEmployee.first_name}
                    onChange={(e) => setNewEmployee({...newEmployee, first_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={newEmployee.last_name}
                    onChange={(e) => setNewEmployee({...newEmployee, last_name: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={newEmployee.start_date}
                    onChange={(e) => setNewEmployee({...newEmployee, start_date: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={newEmployee.address}
                  onChange={(e) => setNewEmployee({...newEmployee, address: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="initial_pto_hours">Initial PTO Hours</Label>
                <Input
                  id="initial_pto_hours"
                  type="number"
                  value={newEmployee.initial_pto_hours}
                  onChange={(e) => setNewEmployee({...newEmployee, initial_pto_hours: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddEmployee}>Add Employee</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employees ({filteredEmployees.length})</CardTitle>
          <CardDescription>
            Manage employee records and access detailed information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{employee.first_name} {employee.last_name}</div>
                      <div className="text-sm text-gray-500">ID: {employee.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {employee.email}
                      </div>
                      {employee.phone && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Phone className="h-3 w-3" />
                          {employee.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {new Date(employee.start_date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={employee.end_date ? "secondary" : "default"}>
                      {employee.end_date ? 'Inactive' : 'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          fetchEmployeeDetails(employee.id)
                          setShowDetailsDialog(true)
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteEmployee(employee.id)}
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

      {/* Employee Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="contracts">Contracts</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="absences">Absences</TabsTrigger>
                <TabsTrigger value="licensures">Licenses</TabsTrigger>
                <TabsTrigger value="awards">Awards</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Name</Label>
                    <p className="text-sm">{selectedEmployee.first_name} {selectedEmployee.last_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="text-sm">{selectedEmployee.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Phone</Label>
                    <p className="text-sm">{selectedEmployee.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Start Date</Label>
                    <p className="text-sm">{new Date(selectedEmployee.start_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Address</Label>
                  <p className="text-sm">{selectedEmployee.address || 'Not provided'}</p>
                </div>
                {selectedEmployee.pto && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">PTO Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Available Hours</Label>
                          <p className="text-lg font-semibold text-green-600">{selectedEmployee.pto.available_hours}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Used Hours</Label>
                          <p className="text-lg font-semibold text-red-600">{selectedEmployee.pto.used_hours}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Remaining Hours</Label>
                          <p className="text-lg font-semibold text-blue-600">{selectedEmployee.pto.remaining_hours}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="contracts" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Contracts</h3>
                  <Button size="sm" onClick={() => openAddItemDialog('contracts')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contract
                  </Button>
                </div>
                <div className="space-y-2">
                  {selectedEmployee.contracts?.map((contract) => (
                    <Card key={contract.id}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{contract.contract_title}</h4>
                            <p className="text-sm text-gray-500">Signed: {new Date(contract.sign_date).toLocaleDateString()}</p>
                            {contract.contract_path && (
                              <p className="text-sm text-blue-600">{contract.contract_path}</p>
                            )}
                          </div>
                          <FileText className="h-4 w-4 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="actions" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Administrative Actions</h3>
                  <Button size="sm" onClick={() => openAddItemDialog('administrative-actions')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Action
                  </Button>
                </div>
                <div className="space-y-2">
                  {selectedEmployee.administrative_actions?.map((action) => (
                    <Card key={action.id}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm">{action.description}</p>
                            <p className="text-sm text-gray-500">Date: {new Date(action.action_date).toLocaleDateString()}</p>
                          </div>
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="absences" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Unexcused Absences</h3>
                  <Button size="sm" onClick={() => openAddItemDialog('absences')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Absence
                  </Button>
                </div>
                <div className="space-y-2">
                  {selectedEmployee.absences?.map((absence) => (
                    <Card key={absence.id}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium">Date: {new Date(absence.absence_date).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-500">{absence.reason || 'No reason provided'}</p>
                          </div>
                          <Clock className="h-4 w-4 text-red-500" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="licensures" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Licensures</h3>
                  <Button size="sm" onClick={() => openAddItemDialog('licensures')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add License
                  </Button>
                </div>
                <div className="space-y-2">
                  {selectedEmployee.licensures?.map((license) => (
                    <Card key={license.id}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{license.license_name}</h4>
                            <p className="text-sm text-gray-500">Issued by: {license.issuing_body}</p>
                            <p className="text-sm text-gray-500">
                              {license.issue_date && `Issued: ${new Date(license.issue_date).toLocaleDateString()}`}
                              {license.expiry_date && ` | Expires: ${new Date(license.expiry_date).toLocaleDateString()}`}
                            </p>
                          </div>
                          <Badge variant="outline">License</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="awards" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Awards & Recognition</h3>
                  <Button size="sm" onClick={() => openAddItemDialog('awards')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Award
                  </Button>
                </div>
                <div className="space-y-2">
                  {selectedEmployee.awards?.map((award) => (
                    <Card key={award.id}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{award.award_name}</h4>
                            <p className="text-sm text-gray-500">
                              {award.award_date && `Date: ${new Date(award.award_date).toLocaleDateString()}`}
                            </p>
                            <p className="text-sm">{award.description}</p>
                          </div>
                          <Award className="h-4 w-4 text-yellow-500" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Item Dialog */}
      <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add {addItemType?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</DialogTitle>
          </DialogHeader>
          {renderAddItemForm()}
          <DialogFooter>
            <Button onClick={handleAddItem}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EmployeeManagement

