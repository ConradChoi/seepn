import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 로컬 파일 업로드 시작...');
    
    // FormData 파싱
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;
    
    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다' }, { status: 400 });
    }
    
    if (!path) {
      return NextResponse.json({ error: '경로가 없습니다' }, { status: 400 });
    }
    
    console.log('파일 정보:', {
      name: file.name,
      size: file.size,
      type: file.type,
      path: path
    });
    
    // 파일을 ArrayBuffer로 변환
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // 업로드 디렉토리 생성
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    
    // 파일 저장
    const filePath = join(uploadDir, path);
    await writeFile(filePath, buffer);
    
    // 다운로드 URL 생성
    const downloadURL = `/uploads/${path}`;
    
    console.log('✅ 로컬 파일 업로드 성공:', downloadURL);
    
    return NextResponse.json({
      success: true,
      downloadURL,
      path: path,
      metadata: {
        name: file.name,
        size: file.size,
        type: file.type
      }
    });
    
  } catch (error) {
    console.error('❌ 로컬 파일 업로드 실패:', error);
    return NextResponse.json(
      { 
        error: '업로드 실패', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: '로컬 파일 업로드 API' });
}
