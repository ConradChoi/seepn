'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoginTexts } from '@/app/types';
import { useRouter } from 'next/navigation';
import { firebaseApp } from '@/lib/firebase/client';
import { EmailAuthProvider, getAuth, onAuthStateChanged, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<'ko' | 'en' | 'ja' | 'zh'>('ko');
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<'idle' | 'success' | 'error'>('idle');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showNewPwdConfirm, setShowNewPwdConfirm] = useState(false);

  // Guard and auth state
  React.useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        router.replace('/login?redirect=/mypage/change-password');
      }
    });
    return () => unsub();
  }, [router]);

  const getText = (key: keyof LoginTexts) => {
    const texts: Record<'ko' | 'en' | 'ja' | 'zh', LoginTexts> = {
      ko: {
        pageTitle: '비밀번호 변경',
        currentPassword: '현재 비밀번호 입력',
        newPassword: '새 비밀번호 입력',
        newPasswordConfirm: '새 비밀번호 재입력',
        change: '변경',
        guideTitle: '비밀번호 설정 안내',
        guide1: '- 최소 8자리 최대 20자리',
        guide2: '- 영문 대/소문자, 숫자, 특수문자 사용',
        guide3: '- 연속된 숫자 및 문자는 안됨',
        validationRequired: '모든 항목을 입력해 주세요.',
        validationPolicy: '비밀번호 정책을 만족하지 않습니다.',
        validationMismatch: '새 비밀번호가 일치하지 않습니다.',
        success: '비밀번호가 변경되었습니다.',
        error: '비밀번호 변경에 실패했습니다. 다시 시도해 주세요.'
      },
      en: {
        pageTitle: 'Change Password',
        currentPassword: 'Current password',
        newPassword: 'New password',
        newPasswordConfirm: 'Confirm new password',
        change: 'Change',
        guideTitle: 'Password policy',
        guide1: '- 8 to 20 characters',
        guide2: '- Use upper/lower letters, numbers, special chars',
        guide3: '- No sequential letters or digits',
        show: 'Show',
        hide: 'Hide',
        validationRequired: 'Please fill in all fields.',
        validationPolicy: 'Password does not meet the policy.',
        validationMismatch: 'New passwords do not match.',
        success: 'Password changed successfully.',
        error: 'Failed to change password. Please try again.'
      },
      ja: {
        pageTitle: 'パスワード変更',
        currentPassword: '現在のパスワード',
        newPassword: '新しいパスワード',
        newPasswordConfirm: '新しいパスワード（確認）',
        change: '変更',
        guideTitle: 'パスワード設定のご案内',
        guide1: '- 最小8文字、最大20文字',
        guide2: '- 英大文字/小文字、数字、記号を使用',
        guide3: '- 連続する数字や文字は不可',
        show: '表示',
        hide: '非表示',
        validationRequired: '全ての項目を入力してください。',
        validationPolicy: 'パスワードポリシーを満たしていません。',
        validationMismatch: '新しいパスワードが一致しません。',
        success: 'パスワードが変更されました。',
        error: '変更に失敗しました。もう一度お試しください。'
      },
      zh: {
        pageTitle: '修改密码',
        currentPassword: '当前密码',
        newPassword: '新密码',
        newPasswordConfirm: '确认新密码',
        change: '修改',
        guideTitle: '密码设置指南',
        guide1: '- 最少8位，最多20位',
        guide2: '- 使用大小写字母、数字、特殊字符',
        guide3: '- 不允许连续数字或字母',
        show: '显示',
        hide: '隐藏',
        validationRequired: '请填写所有项目。',
        validationPolicy: '不符合密码策略。',
        validationMismatch: '两次输入的新密码不一致。',
        success: '密码已修改。',
        error: '修改失败，请重试。'
      }
    };
    return texts[currentLanguage]?.[key] ?? texts.ko[key];

  };

  const containsRequiredTypes = (pwd: string): boolean => {
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasDigit = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    return hasLower && hasUpper && hasDigit && hasSpecial;
  };

  const hasSequentialRun = (pwd: string): boolean => {
    if (pwd.length < 3) return false;
    const toCode = (c: string) => c.charCodeAt(0);
    for (let i = 0; i <= pwd.length - 3; i++) {
      const a = pwd[i], b = pwd[i + 1], c = pwd[i + 2];
      // letters sequence (abc or ABC)
      if (/^[A-Za-z]{3}$/.test(a + b + c)) {
        const ca = toCode(a), cb = toCode(b), cc = toCode(c);
        if (cb - ca === 1 && cc - cb === 1) return true;
      }
      // digits sequence (123)
      if (/^[0-9]{3}$/.test(a + b + c)) {
        const ca = toCode(a), cb = toCode(b), cc = toCode(c);
        if (cb - ca === 1 && cc - cb === 1) return true;
      }
    }
    return false;
  };

  const isValidNewPassword = (pwd: string): boolean => {
    if (pwd.length < 8 || pwd.length > 20) return false;
    if (!containsRequiredTypes(pwd)) return false;
    if (hasSequentialRun(pwd)) return false;
    return true;
  };

  // For visual guide
  const ruleLengthOk = newPassword.length >= 8 && newPassword.length <= 20;
  const ruleTypesOk = containsRequiredTypes(newPassword);
  const ruleNoSequentialOk = !hasSequentialRun(newPassword) && newPassword.length > 0 ? true : (newPassword.length === 0 ? false : true);
  const guideClass = (ok: boolean) =>
    newPassword.length === 0 ? 'text-gray-700' : ok ? 'text-green-600' : 'text-red-600';

  const canSubmit =
    currentPassword.trim().length > 0 &&
    newPassword.trim().length > 0 &&
    newPasswordConfirm.trim().length > 0 &&
    isValidNewPassword(newPassword) &&
    newPassword === newPasswordConfirm &&
    !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('idle');

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      alert(getText('validationRequired'));
      return;
    }
    if (!isValidNewPassword(newPassword)) {
      alert(getText('validationPolicy'));
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      alert(getText('validationMismatch'));
      return;
    }

    setIsSubmitting(true);
    try {
      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;
      if (!user || !user.email) {
        setIsSubmitting(false);
        router.replace('/login?redirect=/mypage/change-password');
        return;
      }

      // Reauthenticate with current password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update to new password
      await updatePassword(user, newPassword);

      setMessage('success');
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
    } catch (err: any) {
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
        setCurrentLanguage={(lang: string) => setCurrentLanguage(lang as 'ko' | 'en' | 'ja' | 'zh')}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      <main className="flex-1" style={{ paddingTop: isBannerVisible ? '120px' : '80px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{getText('pageTitle')}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getText('currentPassword')}
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPwd ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                    >
                      {showCurrentPwd ? (getText('hide') || '가리기') : (getText('show') || '보기')}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getText('newPassword')}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPwd ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                    >
                      {showNewPwd ? (getText('hide') || '가리기') : (getText('show') || '보기')}
                    </button>
                  </div>
                  {!isValidNewPassword(newPassword) && newPassword.length > 0 && (
                    <p className="mt-2 text-sm text-red-600">{getText('validationPolicy')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getText('newPasswordConfirm')}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPwdConfirm ? 'text' : 'password'}
                      value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPwdConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                    >
                      {showNewPwdConfirm ? (getText('hide') || '가리기') : (getText('show') || '보기')}
                    </button>
                  </div>
                  {newPasswordConfirm.length > 0 && newPassword !== newPasswordConfirm && (
                    <p className="mt-2 text-sm text-red-600">{getText('validationMismatch')}</p>
                  )}
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? '...' : getText('change')}
                  </button>
                </div>

                {message === 'success' && (
                  <p className="text-center text-green-600 text-sm">{getText('success')}</p>
                )}
                {message === 'error' && (
                  <p className="text-center text-red-600 text-sm">{getText('error')}</p>
                )}
              </form>
            </div>

            {/* Guide */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 h-fit">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{getText('guideTitle')}</h2>
              <ul className="space-y-2 text-sm">
                <li className={guideClass(ruleLengthOk)}>{getText('guide1')}</li>
                <li className={guideClass(ruleTypesOk)}>{getText('guide2')}</li>
                <li className={guideClass(ruleNoSequentialOk)}>{getText('guide3')}</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer currentLanguage={currentLanguage} userCountry={'대한민국'} />
    </div>
  );
}


