# 환경 변수 설정 가이드

## 🔧 필수 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수들을 설정하세요:

```env
# Firebase Configuration
# Firebase Console > 프로젝트 설정 > 일반 > 웹 앱에서 복사
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 📋 Firebase Console에서 값 찾기

### 1. Firebase Console 접속
- [Firebase Console](https://console.firebase.google.com/) 접속
- 프로젝트 선택

### 2. 프로젝트 설정
- 좌측 메뉴에서 ⚙️ (설정) > **프로젝트 설정** 클릭
- **일반** 탭 선택

### 3. 웹 앱 설정
- **내 앱** 섹션에서 웹 앱 찾기
- **</>** 아이콘 클릭 (웹 앱 추가)
- 앱 닉네임 입력 후 **앱 등록**

### 4. 설정 값 복사
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...", // ← NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "your-project.firebaseapp.com", // ← NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "your-project", // ← NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "your-project.appspot.com", // ← NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789", // ← NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abcdef", // ← NEXT_PUBLIC_FIREBASE_APP_ID
  measurementId: "G-XXXXXXXXXX" // ← NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};
```

## 🔍 환경 변수 확인 방법

### 1. 개발 서버에서 확인
```bash
npm run dev
```

### 2. 브라우저 콘솔에서 확인
```javascript
console.log(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
```

### 3. 테스트 페이지에서 확인
- `/firebase-test` 페이지에서 "연결 테스트" 버튼 클릭

## ⚠️ 주의사항

### 1. 보안
- `.env.local` 파일은 `.gitignore`에 포함되어 있어야 합니다
- 프로덕션에서는 환경 변수를 안전하게 관리하세요

### 2. 네이밍
- 모든 환경 변수는 `NEXT_PUBLIC_` 접두사가 필요합니다
- 클라이언트 사이드에서 접근 가능한 변수만 `NEXT_PUBLIC_` 접두사 사용

### 3. 재시작
- 환경 변수 변경 후 개발 서버를 재시작하세요
```bash
# 서버 중지 (Ctrl+C)
npm run dev
```

## 🧪 테스트 방법

### 1. 기본 연결 테스트
```bash
npm run dev
# 브라우저에서 http://localhost:3000/firebase-test 접속
# "연결 테스트" 버튼 클릭
```

### 2. 파일 업로드 테스트
1. 이미지 파일 선택
2. "전체 테스트 실행" 버튼 클릭
3. 모든 테스트가 성공하는지 확인

### 3. 오류 해결
- **"Firebase Storage 클라이언트 연결 실패"**: 환경 변수 확인
- **"업로드 실패"**: Firebase Storage 규칙 확인
- **"권한 오류"**: Firebase Authentication 설정 확인

## 📁 예제 .env.local 파일

```env
# Firebase Configuration (예시 - 실제 값으로 교체 필요)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seepn-4820b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seepn-4820b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seepn-4820b.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🚀 다음 단계

환경 변수 설정이 완료되면:

1. **Firebase Storage 활성화**: Firebase Console에서 Storage 활성화
2. **보안 규칙 설정**: Storage Rules에서 적절한 권한 설정
3. **테스트 실행**: `/firebase-test` 페이지에서 전체 테스트 실행
4. **실제 사용**: 프로젝트에서 Firebase Storage 기능 사용

## 📞 문제 해결

### 일반적인 오류들:

1. **"Firebase App named '[DEFAULT]' already exists"**
   - 브라우저 새로고침 또는 개발 서버 재시작

2. **"Permission denied"**
   - Firebase Storage 규칙 확인
   - Firebase Authentication 설정 확인

3. **"Network error"**
   - 인터넷 연결 확인
   - Firebase 프로젝트 상태 확인

4. **"Invalid API key"**
   - 환경 변수 값 재확인
   - Firebase Console에서 올바른 값 복사
