/**
 * 서버 사이드를 통한 업로드 (CORS 완전 우회)
 */
export async function uploadFileServer(file: File, path: string): Promise<string> {
  try {
    console.log('🔄 서버 사이드 업로드 시도...');
    
    // FormData 생성
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    
    // 서버 API 호출
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`서버 업로드 실패: ${errorData.error || response.statusText}`);
    }
    
    const result = await response.json();
    console.log('✅ 서버 사이드 업로드 성공:', result.downloadURL);
    
    return result.downloadURL;
    
  } catch (error) {
    console.error('서버 사이드 업로드 실패:', error);
    throw error;
  }
}

/**
 * 파일을 Base64로 변환하여 서버로 전송
 */
export async function uploadFileBase64Server(file: File, path: string): Promise<string> {
  try {
    console.log('🔄 Base64 서버 업로드 시도...');
    
    // 파일을 Base64로 변환
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    
    // 서버로 Base64 데이터 전송
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64,
        fileName: file.name,
        fileType: file.type,
        path: path
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Base64 서버 업로드 실패: ${errorData.error || response.statusText}`);
    }
    
    const result = await response.json();
    console.log('✅ Base64 서버 업로드 성공:', result.downloadURL);
    
    return result.downloadURL;
    
  } catch (error) {
    console.error('Base64 서버 업로드 실패:', error);
    throw error;
  }
}
