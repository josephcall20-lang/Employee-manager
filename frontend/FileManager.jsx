import { useState, useEffect } from 'react'
import { Upload, Download, Trash2, File, FileText, Image } from 'lucide-react'

const FileManager = ({ token, user }) => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/files', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setFiles(data)
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (response.ok) {
        alert('File uploaded successfully!')
        setShowUploadDialog(false)
        setSelectedFile(null)
        fetchFiles() // Refresh file list
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to upload file')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file')
    }
  }

  const handleFileDelete = async (filePath) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const response = await fetch(`/api/files/${filePath}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        alert('File deleted successfully!')
        fetchFiles() // Refresh file list
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete file')
      }
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Error deleting file')
    }
  }

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return <Image size={16} />
    if (['pdf', 'doc', 'docx'].includes(extension)) return <FileText size={16} />
    return <File size={16} />
  }

  if (loading) return <div>Loading files...</div>

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>File Manager</h2>
        <button onClick={() => setShowUploadDialog(true)} style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
          <Upload size={16} style={{ display: 'inline-block', marginRight: '0.5rem' }} />
          Upload File
        </button>
      </div>

      {/* Upload Dialog */}
      {showUploadDialog && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', width: '400px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Upload New File</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowUploadDialog(false)} style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db' }}>Cancel</button>
                <button onClick={handleFileUpload} style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none' }}>Upload</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Files Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>File</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Path</th>
            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {getFileIcon(file.name)}
                {file.name}
              </td>
              <td style={{ padding: '0.75rem' }}>{file.path}</td>
              <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleFileDelete(file.path)} style={{ color: '#dc2626', border: 'none', background: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FileManager
