/**
 * 로컬 파일 시스템을 통한 업로드 (Firebase Storage 대안)
 */
export async function uploadFileLocal(file: File, path: string): Promise<string> {
  try {
    console.log('🔄 로컬 파일 업로드 시도...');
    
    // FormData 생성
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    
    // 로컬 업로드 API 호출
    const response = await fetch('/api/upload-local', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`로컬 업로드 실패: ${errorData.error || response.statusText}`);
    }
    
    const result = await response.json();
    console.log('✅ 로컬 파일 업로드 성공:', result.downloadURL);
    
    return result.downloadURL;
    
  } catch (error) {
    console.error('로컬 파일 업로드 실패:', error);
    throw error;
  }
}

/**
 * Base64를 통한 로컬 업로드
 */
export async function uploadFileBase64Local(file: File, path: string): Promise<string> {
  try {
    console.log('🔄 Base64 로컬 업로드 시도...');
    
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
    const fileFromBlob = new File([blob], file.name, { type: file.type });
    
    // 로컬 업로드
    return await uploadFileLocal(fileFromBlob, path);
    
  } catch (error) {
    console.error('Base64 로컬 업로드 실패:', error);
    throw error;
  }
}
