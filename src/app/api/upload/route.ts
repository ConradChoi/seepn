import { NextRequest, NextResponse } from 'next/server';

// 환경 변수 확인
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Firebase 초기화 (동적 import)
let storage: any = null;
let app: any = null;

async function initializeFirebase() {
  if (!storage) {
    try {
      const { initializeApp, getApps } = await import('firebase/app');
      const { getStorage } = await import('firebase/storage');
      
      app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
      storage = getStorage(app);
      
      console.log('✅ Firebase 초기화 성공');
    } catch (error) {
      console.error('❌ Firebase 초기화 실패:', error);
      throw error;
    }
  }
  return { app, storage };
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 서버 사이드 업로드 시작...');
    
    // 환경 변수 확인
    if (!firebaseConfig.apiKey || !firebaseConfig.storageBucket) {
      console.error('❌ Firebase 환경 변수 누락');
      return NextResponse.json(
        { error: 'Firebase 환경 변수가 설정되지 않았습니다' },
        { status: 500 }
      );
    }
    
    // Firebase 초기화
    const { storage } = await initializeFirebase();
    
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
    
    // Firebase Storage에 업로드
    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('✅ 서버 사이드 업로드 성공:', downloadURL);
    
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
    console.error('❌ 서버 사이드 업로드 실패:', error);
    return NextResponse.json(
      { 
        error: '업로드 실패', 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Firebase Storage 서버 사이드 업로드 API' });
}
