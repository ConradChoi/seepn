'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Camera, X, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { firebaseApp, firestoreClient } from '@/lib/firebase/client';
import { getAuth, onAuthStateChanged, updateEmail, updateProfile } from 'firebase/auth';
import { getStorage, ref as storageRefFn, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function MyPageProfileEdit() {
  const router = useRouter();

  // Layout states
  const [currentLanguage, setCurrentLanguage] = useState('ko');
  const [userCountry, setUserCountry] = useState('대한민국');
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Sample user data (placeholder)
  const [email, setEmail] = useState('user@example.com');
  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const [name, setName] = useState('홍길동');
  const [nickname, setNickname] = useState('홍길동');
  const [phone, setPhone] = useState('010-1234-5678');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [initialAvatarUrl, setInitialAvatarUrl] = useState<string | null>(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);

  // Agreements
  const [agreeTerms, _] = useState(true);
  const [agreePrivacy, __] = useState(true);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [marketingEmail, setMarketingEmail] = useState(false);
  const [marketingSMS, setMarketingSMS] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<'idle' | 'success' | 'error'>('idle');

  // Load current user profile
  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsLoggedIn(false);
        return;
      }
      setIsLoggedIn(true);
      try {
        setEmail(user.email || '');
        setName(user.displayName || '');
        const userDocRef = doc(firestoreClient, 'users', user.uid);
        const snap = await getDoc(userDocRef);
        const data = (snap.exists() ? (snap.data() as any) : {}) as any;
        if (data.nickname) setNickname(String(data.nickname));
        if (data.fullName) setName(String(data.fullName));
        if (data.phone) setPhone(String(data.phone));
        const loadedPhoto = data?.photoURL || user.photoURL || null;
        setAvatarUrl(loadedPhoto);
        setInitialAvatarUrl(loadedPhoto);
        const agreements = (data.agreements || {}) as any;
        if (typeof agreements.marketing === 'boolean') setAgreeMarketing(agreements.marketing);
        if (agreements.channels) {
          if (typeof agreements.channels.email === 'boolean') setMarketingEmail(agreements.channels.email);
          if (typeof agreements.channels.sms === 'boolean') setMarketingSMS(agreements.channels.sms);
        }
      } catch {
        // ignore; keep defaults
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        setUserCountry(data.country_name || '대한민국');
      } catch (e) {
        setUserCountry('대한민국');
      }
    };
    fetchCountry();
  }, []);

  useEffect(() => {
    if (!agreeMarketing) {
      setMarketingEmail(false);
      setMarketingSMS(false);
    }
  }, [agreeMarketing]);

  const getText = (key: string) => {
    const texts = {
      ko: {
        pageTitle: '회원정보 수정',
        profilePhoto: '프로필 사진',
        uploadPhoto: '사진 업로드',
        removePhoto: '삭제',
        nickname: '닉네임',
        nicknameHint: '한글 포함 최대 10자, 영문/숫자/한글 가능 (문자 시작)',
        email: '이메일(아이디)',
        changeEmail: '이메일 변경하기',
        name: '성명',
        phone: '휴대폰 번호',
        agreements: '약관 동의여부',
        agreeTerms: '이용약관 동의',
        agreePrivacy: '개인정보 수집 및 이용 동의',
        marketing: '마케팅 활용 동의',
        channels: '수신 채널',
        emailChannel: '이메일',
        smsChannel: 'SMS',
        cancel: '취소',
        save: '수정',
        validNickname: '사용 가능한 닉네임입니다.',
        invalidNickname: '닉네임 형식을 확인해주세요.',
        invalidPhone: '휴대폰 번호 형식을 확인해주세요.',
        saved: '회원정보가 수정되었습니다.',
        failed: '수정에 실패했습니다. 다시 시도해주세요.',
      },
      en: {
        pageTitle: 'Edit Profile',
        profilePhoto: 'Profile Photo',
        uploadPhoto: 'Upload Photo',
        removePhoto: 'Remove',
        nickname: 'Nickname',
        nicknameHint: 'Up to 10 chars, Korean/English/numbers (must start with letter/Korean)',
        email: 'Email (ID)',
        changeEmail: 'Change Email',
        name: 'Name',
        phone: 'Mobile Phone',
        agreements: 'Terms Agreements',
        agreeTerms: 'Agree to Terms of Service',
        agreePrivacy: 'Agree to Privacy Policy',
        marketing: 'Marketing Consent',
        channels: 'Channels',
        emailChannel: 'Email',
        smsChannel: 'SMS',
        cancel: 'Cancel',
        save: 'Save',
        validNickname: 'Nickname is available.',
        invalidNickname: 'Please check nickname format.',
        invalidPhone: 'Please check phone number format.',
        saved: 'Profile updated successfully.',
        failed: 'Failed to update. Please try again.',
      },
      ja: {
        pageTitle: '会員情報の編集',
        profilePhoto: 'プロフィール写真',
        uploadPhoto: '写真をアップロード',
        removePhoto: '削除',
        nickname: 'ニックネーム',
        nicknameHint: '最大10文字、韓国語/英数字可（文字で開始）',
        email: 'メール(ID)',
        changeEmail: 'メール変更',
        name: '氏名',
        phone: '携帯電話番号',
        agreements: '規約同意',
        agreeTerms: '利用規約に同意',
        agreePrivacy: 'プライバシーポリシーに同意',
        marketing: 'マーケティング同意',
        channels: '受信チャネル',
        emailChannel: 'メール',
        smsChannel: 'SMS',
        cancel: 'キャンセル',
        save: '保存',
        validNickname: '使用可能なニックネームです。',
        invalidNickname: 'ニックネーム形式を確認してください。',
        invalidPhone: '電話番号形式を確認してください。',
        saved: '会員情報が更新されました。',
        failed: '更新に失敗しました。もう一度お試しください。',
      },
      zh: {
        pageTitle: '修改会员信息',
        profilePhoto: '头像',
        uploadPhoto: '上传照片',
        removePhoto: '删除',
        nickname: '昵称',
        nicknameHint: '最多10个字符，支持韩文/英文/数字（字母或韩文字开头）',
        email: '邮箱(ID)',
        changeEmail: '更改邮箱',
        name: '姓名',
        phone: '手机号',
        agreements: '条款同意',
        agreeTerms: '同意服务条款',
        agreePrivacy: '同意隐私政策',
        marketing: '营销同意',
        channels: '接收渠道',
        emailChannel: '邮件',
        smsChannel: '短信',
        cancel: '取消',
        save: '保存',
        validNickname: '昵称可用。',
        invalidNickname: '请检查昵称格式。',
        invalidPhone: '请检查手机号格式。',
        saved: '会员信息已更新。',
        failed: '更新失败，请重试。',
      },
    } as const;
    return (texts as any)[currentLanguage]?.[key] ?? (texts as any).ko[key];
  };

  // Validation
  const isValidNickname = (value: string) => {
    if (!value) return false;
    if (value.length > 10) return false;
    const re = /^[a-zA-Z가-힣][a-zA-Z0-9가-힣]{0,9}$/;
    return re.test(value);
  };

  const isValidPhone = (value: string) => {
    if (!value) return false;
    const re = /^[0-9\-+\s()]{9,20}$/;
    return re.test(value);
  };

  const nicknameOk = isValidNickname(nickname);
  const phoneOk = isValidPhone(phone);
  const canSubmit = !isSubmitting && nicknameOk && phoneOk && agreeTerms && agreePrivacy;

  // Handlers
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    setAvatarRemoved(false);
  };

  const handleAvatarRemove = () => {
    setAvatarFile(null);
    if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    setAvatarUrl(null);
    setAvatarRemoved(true);
  };

  const handleCancel = () => {
    router.push('/mypage');
  };

  const handleSave = async () => {
    setMessage('idle');
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;
      if (!user) {
        router.replace('/login?redirect=/mypage/profile');
        return;
      }

      // Update email if changed and editing was enabled
      if (isEmailEditing && email && email !== (user.email || '')) {
        try {
          await updateEmail(user, email);
        } catch (e: any) {
          // Most common: auth/requires-recent-login
          setIsSubmitting(false);
          setMessage('error');
          return;
        }
      }

      // Handle avatar upload/remove
      let newPhotoURL: string | null | undefined = undefined;
      const storage = getStorage(firebaseApp);
      if (avatarFile) {
        const fileName = `${Date.now()}_${avatarFile.name}`.replace(/\s+/g, '_');
        const storageRef = storageRefFn(storage, `avatars/${user.uid}/${fileName}`);
        await uploadBytes(storageRef, avatarFile);
        newPhotoURL = await getDownloadURL(storageRef);
        try {
          if (initialAvatarUrl && initialAvatarUrl !== newPhotoURL && !initialAvatarUrl.startsWith('http')) {
            const oldRef = storageRefFn(storage, initialAvatarUrl);
            await deleteObject(oldRef);
          }
        } catch {}
        await updateProfile(user, { photoURL: newPhotoURL });
      } else if (avatarRemoved) {
        newPhotoURL = '';
        try {
          if (initialAvatarUrl && !initialAvatarUrl.startsWith('http')) {
            const oldRef = storageRefFn(storage, initialAvatarUrl);
            await deleteObject(oldRef);
          }
        } catch {}
        await updateProfile(user, { photoURL: newPhotoURL });
      }

      // Persist profile fields in Firestore
      const userDocRef = doc(firestoreClient, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          email,
          fullName: name,
          phone,
          nickname,
          ...(newPhotoURL !== undefined ? { photoURL: newPhotoURL } : {}),
          agreements: {
            terms: true,
            privacy: true,
            marketing: agreeMarketing,
            channels: { email: marketingEmail, sms: marketingSMS },
          },
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      if (typeof newPhotoURL === 'string') {
        setInitialAvatarUrl(newPhotoURL || null);
      }
      setMessage('success');
    } catch (e) {
      setMessage('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        isBannerVisible={isBannerVisible}
        setIsBannerVisible={setIsBannerVisible}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      <main className="flex-1" style={{ paddingTop: isBannerVisible ? '120px' : '80px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{getText('pageTitle')}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 lg:col-span-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{getText('profilePhoto')}</h2>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24">
                  <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-400 text-3xl">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-white border border-gray-200 rounded-full p-2 shadow cursor-pointer hover:bg-gray-50">
                    <Camera className="h-4 w-4 text-gray-600" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                </div>
                <div className="space-x-2">
                  {avatarUrl && (
                    <button type="button" onClick={handleAvatarRemove} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm">
                      {getText('removePhoto')}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Form card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nickname */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getText('nickname')}</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={10}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      nickname.length > 0 && !nicknameOk ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder={getText('nicknameHint')}
                  />
                  <div className="mt-1 text-xs">
                    {nickname.length > 0 && (
                      nicknameOk ? (
                        <span className="text-green-600 inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />{getText('validNickname')}</span>
                      ) : (
                        <span className="text-red-600">{getText('invalidNickname')}</span>
                      )
                    )}
                  </div>
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getText('email')}</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      readOnly={!isEmailEditing}
                      className={`flex-1 px-3 py-2 border rounded-lg ${isEmailEditing ? 'border-blue-300 bg-white' : 'border-gray-300 bg-gray-50 text-gray-600'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setIsEmailEditing((v) => !v)}
                      className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      {getText('changeEmail')}
                    </button>
                  </div>
                </div>

                {/* Name (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getText('name')}</label>
                  <input type="text" value={name} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600" />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{getText('phone')}</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      phone.length > 0 && !phoneOk ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="010-1234-5678"
                  />
                  {phone.length > 0 && !phoneOk && (
                    <div className="mt-1 text-xs text-red-600">{getText('invalidPhone')}</div>
                  )}
                </div>
              </div>

              {/* Agreements */}
              <div className="mt-8">
                <h3 className="text-base font-semibold text-gray-900 mb-3">{getText('agreements')}</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700 opacity-70 cursor-not-allowed" title="변경 불가">
                    <input type="checkbox" className="h-4 w-4" checked={agreeTerms} readOnly disabled />
                    {getText('agreeTerms')}
                  </label>
                  <label className="flex items-center gap-2 text-gray-700 opacity-70 cursor-not-allowed" title="변경 불가">
                    <input type="checkbox" className="h-4 w-4" checked={agreePrivacy} readOnly disabled />
                    {getText('agreePrivacy')}
                  </label>
                </div>

                <div className="mt-6">
                  <label className="flex items-center gap-2 text-gray-700">
                    <input type="checkbox" className="h-4 w-4" checked={agreeMarketing} onChange={(e) => setAgreeMarketing(e.target.checked)} />
                    {getText('marketing')}
                  </label>
                  <div className="mt-3 pl-6">
                    <div className="text-sm text-gray-600 mb-2">{getText('channels')}</div>
                    <div className="flex items-center gap-4">
                      <label className={`flex items-center gap-2 ${!agreeMarketing ? 'opacity-50' : ''}`}>
                        <input type="checkbox" className="h-4 w-4" disabled={!agreeMarketing} checked={marketingEmail} onChange={(e) => setMarketingEmail(e.target.checked)} />
                        {getText('emailChannel')}
                      </label>
                      <label className={`flex items-center gap-2 ${!agreeMarketing ? 'opacity-50' : ''}`}>
                        <input type="checkbox" className="h-4 w-4" disabled={!agreeMarketing} checked={marketingSMS} onChange={(e) => setMarketingSMS(e.target.checked)} />
                        {getText('smsChannel')}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  {getText('cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!canSubmit}
                  className="px-6 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '...' : getText('save')}
                </button>
              </div>

              {message === 'success' && (
                <p className="mt-3 text-center text-green-600 text-sm">{getText('saved')}</p>
              )}
              {message === 'error' && (
                <p className="mt-3 text-center text-red-600 text-sm">{getText('failed')}</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer currentLanguage={currentLanguage} userCountry={userCountry} />
    </div>
  );
}


