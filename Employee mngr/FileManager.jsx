import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Upload, Download, Trash2, File, FileText, Image, Archive } from 'lucide-react'

const FileManager = ({ token, user }) => {
  const [files, setFiles] = useState({})
  const [loading, setLoading] = useState(true)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadType, setUploadType] = useState('documents')
  const [entityId, setEntityId] = useState('')
  const [entityType, setEntityType] = useState('candidate')

  const fileTypes = [
    { value: 'resumes', label: 'Resumes', icon: FileText },
    { value: 'contracts', label: 'Contracts', icon: FileText },
    { value: 'policies', label: 'Policy Documents', icon: FileText },
    { value: 'licenses', label: 'Licenses', icon: FileText },
    { value: 'awards', label: 'Awards', icon: Archive },
    { value: 'documents', label: 'General Documents', icon: File }
  ]

  useEffect(() => {
    fetchAllFiles()
  }, [])

  const fetchAllFiles = async () => {
    try {
      const fileData = {}
      for (const type of fileTypes) {
        const response = await fetch(`/api/files/list/${type.value}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        fileData[type.value] = data
      }
      setFiles(fileData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching files:', error)
      setLoading(false)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('type', uploadType)
      formData.append('entity_id', entityId)
      formData.append('entity_type', entityType)

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        alert('File uploaded successfully!')
        setShowUploadDialog(false)
        setSelectedFile(null)
        setEntityId('')
        fetchAllFiles() // Refresh file list
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to upload file')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file')
    }
  }

  const handleFileDelete = async (fileType, filename) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const response = await fetch(`/api/files/delete/${fileType}/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('File deleted successfully!')
        fetchAllFiles() // Refresh file list
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete file')
      }
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Error deleting file')
    }
  }

  const handleFileDownload = (downloadUrl) => {
    window.open(downloadUrl, '_blank')
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return <Image className="w-4 h-4" />
    } else if (['pdf', 'doc', 'docx'].includes(extension)) {
      return <FileText className="w-4 h-4" />
    } else {
      return <File className="w-4 h-4" />
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">File Manager</h2>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload File</DialogTitle>
              <DialogDescription>
                Upload documents, resumes, contracts, and other files to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="col-span-3"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xls,.xlsx"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Category</Label>
                <Select value={uploadType} onValueChange={setUploadType}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fileTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="entity-type" className="text-right">Entity Type</Label>
                <Select value={entityType} onValueChange={setEntityType}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="candidate">Candidate</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="entity-id" className="text-right">Entity ID</Label>
                <Input
                  id="entity-id"
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                  placeholder="Optional: Candidate/Employee ID"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleFileUpload}>Upload File</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="resumes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          {fileTypes.map((type) => {
            const Icon = type.icon
            return (
              <TabsTrigger key={type.value} value={type.value} className="flex items-center">
                <Icon className="w-4 h-4 mr-1" />
                {type.label}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {fileTypes.map((type) => (
          <TabsContent key={type.value} value={type.value} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <type.icon className="w-5 h-5 mr-2" />
                  {type.label}
                </CardTitle>
                <CardDescription>
                  Manage {type.label.toLowerCase()} files
                </CardDescription>
              </CardHeader>
              <CardContent>
                {files[type.value] && files[type.value].length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Modified</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {files[type.value].map((file, index) => (
                        <TableRow key={index}>
                          <TableCell className="flex items-center">
                            {getFileIcon(file.filename)}
                            <span className="ml-2">{file.filename}</span>
                          </TableCell>
                          <TableCell>{formatFileSize(file.size)}</TableCell>
                          <TableCell>
                            {new Date(file.modified).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleFileDownload(file.download_url)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleFileDelete(type.value, file.filename)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No {type.label.toLowerCase()} files uploaded yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default FileManager

