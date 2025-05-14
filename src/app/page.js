'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setMessage('');

    const folderPath = 'files/';
    const filePath = `${folderPath}${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from('curativa-salud.dev')
      .upload(filePath, file);

    if (error) {
      setMessage(`Upload failed: ${error.message}`);
    } else {
      setMessage(`File uploaded successfully: ${data.path}`);
    }

    setUploading(false);
  };

  return (
    <div className="max-w-md p-4 mx-auto">
      <h1 className="mb-4 text-xl font-semibold">Upload a File</h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full"
        />
        <button
          type="submit"
          disabled={uploading}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}
