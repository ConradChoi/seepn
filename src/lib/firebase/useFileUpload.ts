import { useState } from 'react';
import { uploadFile, uploadImage, validateFile, deleteFile } from './storage';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  downloadURL: string | null;
}

interface UseFileUploadOptions {
  maxSizeInMB?: number;
  allowedTypes?: string[];
  onSuccess?: (downloadURL: string) => void;
  onError?: (error: string) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    maxSizeInMB = 10,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    onSuccess,
    onError
  } = options;

  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    downloadURL: null
  });

  const upload = async (file: File, path: string) => {
    // 파일 검증
    const validation = validateFile(file, maxSizeInMB, allowedTypes);
    if (!validation.isValid) {
      const error = validation.error || '파일 검증에 실패했습니다.';
      setUploadState(prev => ({ ...prev, error }));
      onError?.(error);
      return;
    }

    setUploadState(prev => ({ 
      ...prev, 
      isUploading: true, 
      error: null,
      progress: 0 
    }));

    try {
      const { downloadURL } = await uploadFile(file, path);
      
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
        downloadURL
      }));

      onSuccess?.(downloadURL);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.';
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        error: errorMessage
      }));
      onError?.(errorMessage);
    }
  };

  const uploadImageFile = async (file: File, folder: string, userId?: string) => {
    // 파일 검증
    const validation = validateFile(file, maxSizeInMB, allowedTypes);
    if (!validation.isValid) {
      const error = validation.error || '파일 검증에 실패했습니다.';
      setUploadState(prev => ({ ...prev, error }));
      onError?.(error);
      return;
    }

    setUploadState(prev => ({ 
      ...prev, 
      isUploading: true, 
      error: null,
      progress: 0 
    }));

    try {
      const { downloadURL } = await uploadImage(file, folder, userId);
      
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
        downloadURL
      }));

      onSuccess?.(downloadURL);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.';
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        error: errorMessage
      }));
      onError?.(errorMessage);
    }
  };

  const remove = async (path: string) => {
    try {
      await deleteFile(path);
      setUploadState(prev => ({
        ...prev,
        downloadURL: null,
        error: null
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '파일 삭제 중 오류가 발생했습니다.';
      setUploadState(prev => ({ ...prev, error: errorMessage }));
      onError?.(errorMessage);
    }
  };

  const reset = () => {
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      downloadURL: null
    });
  };

  return {
    ...uploadState,
    upload,
    uploadImageFile,
    remove,
    reset
  };
}
