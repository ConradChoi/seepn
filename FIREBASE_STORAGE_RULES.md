# Firebase Storage 규칙 설정

## 🚨 CORS 오류 해결을 위한 임시 규칙

Firebase Console > Storage > Rules에서 다음 규칙을 설정하세요:

### 개발 단계용 (임시)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 개발 단계에서는 모든 접근 허용
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### 프로덕션용 (보안 강화)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 인증된 사용자만 접근
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    
    // 공개 읽기, 인증된 사용자만 쓰기
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // 사용자별 폴더
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🔧 설정 단계

1. **Firebase Console 접속**
   - https://console.firebase.google.com/
   - 프로젝트 선택

2. **Storage 메뉴**
   - 좌측 메뉴에서 "Storage" 클릭
   - "Rules" 탭 선택

3. **규칙 수정**
   - 위의 개발용 규칙으로 교체
   - "게시" 버튼 클릭

4. **테스트**
   - 브라우저에서 `/firebase-test` 페이지 접속
   - 파일 업로드 테스트

## ⚠️ 주의사항

- **개발용 규칙**은 보안상 위험하므로 프로덕션에서는 사용하지 마세요
- 프로덕션 배포 전에는 반드시 인증 기반 규칙으로 변경하세요
- Storage 사용량에 따라 비용이 발생할 수 있습니다

## 🧪 테스트 방법

1. 규칙 설정 후 브라우저 새로고침
2. `/firebase-test` 페이지에서 "전체 테스트 실행"
3. 파일 선택 후 업로드 테스트
4. 성공하면 Firebase Console > Storage > Files에서 업로드된 파일 확인
