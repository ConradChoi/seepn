/**
 * 직접 Firebase Storage API를 사용한 업로드 (CORS 우회)
 */
export async function uploadFileDirect(file: File, path: string): Promise<string> {
  try {
    console.log('🔄 직접 업로드 시도...');
    
    // Firebase Storage REST API 직접 호출
    const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    
    if (!bucket || !projectId) {
      throw new Error('Firebase 환경 변수가 설정되지 않았습니다');
    }
    
    // 파일을 FormData로 변환
    const formData = new FormData();
    formData.append('file', file);
    
    // Firebase Storage REST API URL
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?name=${encodeURIComponent(path)}`;
    
    console.log('업로드 URL:', uploadUrl);
    
    // 직접 fetch로 업로드
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('업로드 실패:', response.status, errorText);
      throw new Error(`업로드 실패: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('업로드 결과:', result);
    
    // 다운로드 URL 생성
    const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(path)}?alt=media`;
    
    console.log('✅ 직접 업로드 성공:', downloadURL);
    return downloadURL;
    
  } catch (error) {
    console.error('직접 업로드 실패:', error);
    throw error;
  }
}

/**
 * Base64를 통한 업로드 (CORS 완전 우회)
 */
export async function uploadFileBase64Direct(file: File, path: string): Promise<string> {
  try {
    console.log('🔄 Base64 직접 업로드 시도...');
    
    // 파일을 Base64로 변환
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    
    // Base64 데이터 추출
    const base64Data = base64.split(',')[1];
    
    const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucket) {
      throw new Error('Firebase Storage 버킷이 설정되지 않았습니다');
    }
    
    // Firebase Storage REST API로 업로드
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?name=${encodeURIComponent(path)}`;
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: Buffer.from(base64Data, 'base64'),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Base64 업로드 실패:', response.status, errorText);
      throw new Error(`Base64 업로드 실패: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Base64 업로드 결과:', result);
    
    // 다운로드 URL 생성
    const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(path)}?alt=media`;
    
    console.log('✅ Base64 직접 업로드 성공:', downloadURL);
    return downloadURL;
    
  } catch (error) {
    console.error('Base64 직접 업로드 실패:', error);
    throw error;
  }
}

/**
 * 로컬 스토리지에 임시 저장 (최후의 수단)
 */
export function saveFileLocally(file: File, path: string): string {
  try {
    console.log('🔄 로컬 스토리지에 임시 저장...');
    
    // 파일을 Base64로 변환
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      localStorage.setItem(`temp_file_${path}`, base64);
      console.log('✅ 로컬 스토리지에 저장됨:', path);
    };
    reader.readAsDataURL(file);
    
    // 임시 URL 반환
    const tempUrl = `local://temp_file_${path}`;
    console.log('✅ 로컬 임시 URL:', tempUrl);
    return tempUrl;
    
  } catch (error) {
    console.error('로컬 저장 실패:', error);
    throw error;
  }
}
