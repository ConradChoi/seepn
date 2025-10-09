'use client';

import { useRef, useState } from 'react';
import { useFileUpload } from '@/lib/firebase/useFileUpload';

interface FileUploadProps {
  folder: string;
  userId?: string;
  onUploadSuccess?: (downloadURL: string) => void;
  onUploadError?: (error: string) => void;
  maxSizeInMB?: number;
  allowedTypes?: string[];
  className?: string;
}

export default function FileUpload({
  folder,
  userId,
  onUploadSuccess,
  onUploadError,
  maxSizeInMB = 10,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  className = ''
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const { isUploading, error, downloadURL, uploadImageFile, reset } = useFileUpload({
    maxSizeInMB,
    allowedTypes,
    onSuccess: onUploadSuccess,
    onError: onUploadError
  });

  const handleFileSelect = (file: File) => {
    uploadImageFile(file, folder, userId);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-600">업로드 중...</p>
          </div>
        ) : downloadURL ? (
          <div className="space-y-2">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-green-600">업로드 완료!</p>
            <button
              onClick={handleRemove}
              className="text-xs text-red-500 hover:text-red-700 underline"
            >
              제거
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              파일을 드래그하거나 클릭하여 업로드
            </p>
            <p className="text-xs text-gray-500">
              최대 {maxSizeInMB}MB, {allowedTypes.map(type => type.split('/')[1]).join(', ')} 파일만 허용
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}

      {downloadURL && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-600">
          <p>업로드된 파일 URL:</p>
          <p className="text-xs break-all">{downloadURL}</p>
        </div>
      )}
    </div>
  );
}
