// 간단한 Base64 업로드 함수들

/**
 * 파일을 Base64로 변환하여 반환
 */
export async function uploadFileSimpleBase64(file: File, path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl);
    };
    
    reader.onerror = () => {
      reject(new Error('파일 읽기 실패'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * 클라이언트에서 직접 Base64로 변환 (API 호출 없음)
 */
export async function uploadFileClientBase64(file: File, path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const dataUrl = reader.result as string;
      console.log('✅ 클라이언트 Base64 변환 성공:', dataUrl.substring(0, 100) + '...');
      resolve(dataUrl);
    };
    
    reader.onerror = () => {
      reject(new Error('파일 읽기 실패'));
    };
    
    reader.readAsDataURL(file);
  });
}