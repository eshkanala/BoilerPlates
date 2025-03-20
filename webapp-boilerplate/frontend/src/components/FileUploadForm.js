// frontend/src/components/FileUploadForm.js (example)
import React, { useState } from 'react';
import apiClient from '../services/apiClient';

const FileUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      return; // No file selected
    }

    const formData = new FormData();
    formData.append('image', selectedFile); // 'image' should match multer's fieldname

    try {
      const response = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });
      setUploadResult(`File uploaded successfully. Path: ${response.data}`);
      console.log('File upload response:', response.data);
    } catch (error) {
      setUploadResult(`Upload failed: ${error.response?.data?.message || 'Unknown error'}`);
      console.error('File upload error:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {uploadResult && <p>{uploadResult}</p>}
    </div>
  );
};

export default FileUploadForm;