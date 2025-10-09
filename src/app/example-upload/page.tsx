'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';

export default function ExampleUploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleUploadSuccess = (downloadURL: string) => {
    setUploadedFiles(prev => [...prev, downloadURL]);
    console.log('업로드 성공:', downloadURL);
  };

  const handleUploadError = (error: string) => {
    console.error('업로드 실패:', error);
    alert(`업로드 실패: ${error}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Firebase Storage 업로드 예제</h1>
      
      <div className="space-y-8">
        {/* 기본 파일 업로드 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">기본 파일 업로드</h2>
          <FileUpload
            folder="uploads"
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            maxSizeInMB={5}
            className="max-w-md"
          />
        </div>

        {/* 사용자별 이미지 업로드 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">사용자 프로필 이미지 업로드</h2>
          <FileUpload
            folder="profile"
            userId="user123"
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            maxSizeInMB={2}
            allowedTypes={['image/jpeg', 'image/png']}
            className="max-w-md"
          />
        </div>

        {/* 게시물 이미지 업로드 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">게시물 이미지 업로드</h2>
          <FileUpload
            folder="posts"
            userId="user123"
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            maxSizeInMB={10}
            className="max-w-md"
          />
        </div>

        {/* 업로드된 파일 목록 */}
        {uploadedFiles.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">업로드된 파일들</h2>
            <div className="space-y-2">
              {uploadedFiles.map((url, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">파일 {index + 1}:</p>
                  <img 
                    src={url} 
                    alt={`업로드된 파일 ${index + 1}`}
                    className="max-w-xs h-auto rounded"
                  />
                  <p className="text-xs text-gray-500 mt-2 break-all">{url}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
