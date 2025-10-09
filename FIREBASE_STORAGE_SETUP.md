# Firebase Storage 설정 가이드

## 1. Firebase Console 설정

### 1.1 Storage 활성화
1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. 프로젝트 선택
3. 왼쪽 메뉴에서 "Storage" 클릭
4. "시작하기" 버튼 클릭
5. 보안 규칙 설정 (개발 단계에서는 테스트 모드 선택)

### 1.2 Storage 보안 규칙 설정
Firebase Console > Storage > Rules에서 다음 규칙 설정:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 인증된 사용자만 읽기/쓰기 허용
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    
    // 공개 읽기, 인증된 사용자만 쓰기
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // 사용자별 폴더 (본인만 접근 가능)
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 2. 환경 변수 설정

`.env.local` 파일에 다음 환경 변수들을 설정하세요:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 3. 사용 방법

### 3.1 기본 파일 업로드
```tsx
import { useFileUpload } from '@/lib/firebase/useFileUpload';

function MyComponent() {
  const { upload, isUploading, error, downloadURL } = useFileUpload({
    maxSizeInMB: 10,
    allowedTypes: ['image/jpeg', 'image/png'],
    onSuccess: (url) => console.log('업로드 성공:', url),
    onError: (error) => console.error('업로드 실패:', error)
  });

  const handleFileUpload = (file: File) => {
    upload(file, 'uploads/myfile.jpg');
  };

  return (
    <div>
      {isUploading && <p>업로드 중...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {downloadURL && <img src={downloadURL} alt="업로드된 이미지" />}
    </div>
  );
}
```

### 3.2 FileUpload 컴포넌트 사용
```tsx
import FileUpload from '@/components/FileUpload';

function MyComponent() {
  return (
    <FileUpload
      folder="profile"
      userId="user123"
      maxSizeInMB={5}
      allowedTypes={['image/jpeg', 'image/png']}
      onUploadSuccess={(url) => console.log('업로드 성공:', url)}
      onUploadError={(error) => console.error('업로드 실패:', error)}
    />
  );
}
```

### 3.3 직접 Storage 함수 사용
```tsx
import { uploadFile, deleteFile, getFileURL } from '@/lib/firebase/storage';

// 파일 업로드
const { downloadURL } = await uploadFile(file, 'path/to/file.jpg');

// 파일 삭제
await deleteFile('path/to/file.jpg');

// 파일 URL 가져오기
const url = await getFileURL('path/to/file.jpg');
```

## 4. 파일 구조 예시

```
Firebase Storage
├── public/           # 공개 파일들
│   ├── images/
│   └── documents/
├── users/            # 사용자별 파일들
│   ├── user123/
│   │   ├── profile/
│   │   └── posts/
│   └── user456/
└── uploads/          # 임시 업로드 파일들
    └── temp/
```

## 5. 보안 고려사항

1. **파일 크기 제한**: 클라이언트와 서버 모두에서 파일 크기 제한
2. **파일 타입 검증**: 허용된 파일 타입만 업로드 가능하도록 설정
3. **사용자 인증**: 인증된 사용자만 파일 업로드 가능
4. **경로 보안**: 사용자가 다른 사용자의 파일에 접근하지 못하도록 경로 제한
5. **바이러스 스캔**: 프로덕션에서는 업로드된 파일에 대한 바이러스 스캔 고려

## 6. 성능 최적화

1. **이미지 리사이징**: 클라이언트에서 업로드 전 이미지 크기 조정
2. **썸네일 생성**: 큰 이미지의 썸네일 버전 생성
3. **CDN 사용**: Firebase Storage는 자동으로 CDN을 통해 전송
4. **압축**: 이미지 파일 압축 후 업로드

## 7. 예제 페이지

`/example-upload` 페이지에서 다양한 업로드 예제를 확인할 수 있습니다.
