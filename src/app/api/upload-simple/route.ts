import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { fileData, fileName, fileType } = await request.json();

    if (!fileData || !fileName) {
      return NextResponse.json({ error: '파일 데이터가 없습니다' }, { status: 400 });
    }

    // Base64 데이터를 그대로 반환 (실제로는 여기서 처리할 수 있음)
    const result = {
      success: true,
      dataUrl: fileData,
      fileName,
      fileType,
      message: 'Base64 데이터가 성공적으로 처리되었습니다'
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Base64 업로드 실패:', error);
    return NextResponse.json(
      { error: 'Base64 업로드 실패', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Base64 업로드 API' });
}