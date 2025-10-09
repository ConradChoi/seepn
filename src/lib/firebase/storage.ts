import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll,
  UploadResult 
} from 'firebase/storage';
import { storageClient } from './client';

/**
 * 파일을 Firebase Storage에 업로드합니다.
 * @param file - 업로드할 파일
 * @param path - 저장할 경로 (예: 'images/profile.jpg')
 * @returns 업로드 결과와 다운로드 URL
 */
export async function uploadFile(file: File, path: string): Promise<{ result: UploadResult; downloadURL: string }> {
  try {
    const storageRef = ref(storageClient, path);
    const result = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(result.ref);
    
    return { result, downloadURL };
  } catch (error) {
    console.error('파일 업로드 중 오류 발생:', error);
    console.error('오류 상세:', error);
    throw error;
  }
}

/**
 * 파일을 Firebase Storage에서 삭제합니다.
 * @param path - 삭제할 파일의 경로
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const storageRef = ref(storageClient, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('파일 삭제 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 특정 경로의 모든 파일 목록을 가져옵니다.
 * @param path - 조회할 경로
 * @returns 파일 목록
 */
export async function listFiles(path: string) {
  try {
    const storageRef = ref(storageClient, path);
    const result = await listAll(storageRef);
    return result;
  } catch (error) {
    console.error('파일 목록 조회 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 파일의 다운로드 URL을 가져옵니다.
 * @param path - 파일 경로
 * @returns 다운로드 URL
 */
export async function getFileURL(path: string): Promise<string> {
  try {
    const storageRef = ref(storageClient, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('파일 URL 조회 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 이미지 파일을 업로드하고 최적화된 경로를 생성합니다.
 * @param file - 이미지 파일
 * @param folder - 저장할 폴더 (예: 'profile', 'posts')
 * @param userId - 사용자 ID (선택사항)
 * @returns 업로드 결과와 다운로드 URL
 */
export async function uploadImage(
  file: File, 
  folder: string, 
  userId?: string
): Promise<{ result: UploadResult; downloadURL: string }> {
  // 파일 확장자 추출
  const fileExtension = file.name.split('.').pop();
  
  // 고유한 파일명 생성
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileName = `${timestamp}_${randomString}.${fileExtension}`;
  
  // 경로 생성
  const path = userId 
    ? `${folder}/${userId}/${fileName}`
    : `${folder}/${fileName}`;
  
  return uploadFile(file, path);
}

/**
 * 파일 크기와 타입을 검증합니다.
 * @param file - 검증할 파일
 * @param maxSizeInMB - 최대 크기 (MB)
 * @param allowedTypes - 허용된 파일 타입들
 * @returns 검증 결과
 */
export function validateFile(
  file: File, 
  maxSizeInMB: number = 10, 
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
): { isValid: boolean; error?: string } {
  // 파일 크기 검증
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      error: `파일 크기가 ${maxSizeInMB}MB를 초과합니다.`
    };
  }
  
  // 파일 타입 검증
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `허용되지 않는 파일 타입입니다. 허용된 타입: ${allowedTypes.join(', ')}`
    };
  }
  
  return { isValid: true };
}
