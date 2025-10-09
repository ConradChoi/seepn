import { storageClient } from './client';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

/**
 * 대안 업로드 방법 - Resumable Upload 사용
 */
export async function uploadFileAlternative(file: File, path: string): Promise<string> {
  try {
    console.log('🔄 대안 업로드 방법 시도...');
    
    const storageRef = ref(storageClient, path);
    
    // Resumable upload 사용
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          // 업로드 진행률
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`업로드 진행률: ${progress}%`);
        },
        (error) => {
          console.error('업로드 오류:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('✅ 업로드 성공:', downloadURL);
            resolve(downloadURL);
          } catch (error) {
            console.error('URL 가져오기 오류:', error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('대안 업로드 실패:', error);
    throw error;
  }
}

/**
 * 간단한 파일 업로드 (최소 설정)
 */
export async function uploadFileSimple(file: File, path: string): Promise<string> {
  try {
    console.log('🔄 간단 업로드 시도...');
    
    // 파일명을 URL 안전하게 만들기
    const safeFileName = encodeURIComponent(file.name);
    const timestamp = Date.now();
    const finalPath = `${path}/${timestamp}_${safeFileName}`;
    
    const storageRef = ref(storageClient, finalPath);
    
    // 기본 업로드 시도
    const snapshot = await uploadBytesResumable(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('✅ 간단 업로드 성공:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('간단 업로드 실패:', error);
    throw error;
  }
}

/**
 * Base64를 통한 업로드 (최후의 수단)
 */
export async function uploadFileBase64(file: File, path: string): Promise<string> {
  try {
    console.log('🔄 Base64 업로드 시도...');
    
    // 파일을 Base64로 변환
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    
    // Base64 데이터를 Blob으로 변환
    const response = await fetch(base64);
    const blob = await response.blob();
    
    // Blob을 업로드
    const storageRef = ref(storageClient, path);
    const snapshot = await uploadBytesResumable(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('✅ Base64 업로드 성공:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Base64 업로드 실패:', error);
    throw error;
  }
}
