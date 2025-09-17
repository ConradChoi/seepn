'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { firebaseApp, firestoreClient } from '@/lib/firebase/client';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function SignupPage() {
  const [isBannerVisible, setIsBannerVisible] = React.useState(true);
  const [currentLanguage, setCurrentLanguage] = React.useState<'ko' | 'en' | 'ja' | 'zh'>('ko');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userCountry, setUserCountry] = React.useState('대한민국');

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [showPwd, setShowPwd] = React.useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');

  // Agreements state
  const [isTermsExpanded, setIsTermsExpanded] = React.useState(false);
  const [agreeTos, setAgreeTos] = React.useState(false);
  const [agreePrivacy, setAgreePrivacy] = React.useState(false);
  const [agreeMarketingEmail, setAgreeMarketingEmail] = React.useState(false);
  const [agreeMarketingSms, setAgreeMarketingSms] = React.useState(false);
  const [openPolicy, setOpenPolicy] = React.useState<null | 'tos' | 'privacy' | 'marketing'>(null);

  React.useEffect(() => {
    const getUserCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserCountry(data.country_name || '대한민국');
      } catch (error) {
        setUserCountry('대한민국');
        console.error('Failed to fetch user country', error);
        throw new Error('Failed to fetch user country');
      }
    };
    getUserCountry();
  }, []);

  const getText = (key: string) => {
    const texts = {
      ko: {
        pageTitle: '회원가입',
        email: '이메일',
        password: '비밀번호',
        confirm: '비밀번호 재입력',
        fullName: '성명',
        phone: '휴대폰 번호',
        enterEmail: '이메일을 입력하세요',
        enterPassword: '비밀번호를 입력하세요',
        reenterPassword: '비밀번호를 다시 입력하세요',
        enterFullName: '성명을 입력하세요',
        enterPhone: '휴대폰 번호를 입력하세요 (예: 010-1234-5678)',
        guide1: '- 최소 8자리 최대 20자리',
        guide2: '- 영문 대/소문자, 숫자, 특수문자 사용',
        guide3: '- 연속된 숫자 및 문자는 안됨',
        submit: '가입하기',
        cancel: '취소',
        already: '이미 가입한 회원이라면?',
        login: '로그인',
        required: '모든 항목을 입력해주세요.',
        invalidEmail: '올바른 이메일을 입력해주세요.',
        mismatch: '비밀번호가 일치하지 않습니다.',
        invalidPhone: '올바른 휴대폰 번호 형식을 입력해주세요.',
        success: '가입이 완료되었습니다. 로그인 화면으로 이동합니다.',
        validationPolicy: '비밀번호 정책을 만족하지 않습니다.',
        agreementsTitle: '약관 동의',
        agreeAll: '전체 동의',
        toggleOpen: '열기',
        toggleClose: '닫기',
        tos: '이용약관 동의',
        privacy: '개인정보 수집 및 이용 동의',
        marketing: '마케팅 활용 동의',
        optional: '선택',
        marketingEmail: '이메일',
        marketingSms: 'SMS',
        view: '보기',
        agreeRequired: '필수 약관에 동의해주세요.',
        policyTosTitle: '이용약관',
        policyPrivacyTitle: '개인정보 수집 및 이용',
        policyMarketingTitle: '마케팅 활용',
        close: '닫기'
      },
      en: {
        pageTitle: 'Sign Up',
        email: 'Email',
        password: 'Password',
        confirm: 'Confirm Password',
        fullName: 'Full Name',
        phone: 'Mobile Number',
        enterEmail: 'Enter your email',
        enterPassword: 'Enter your password',
        reenterPassword: 'Re-enter your password',
        enterFullName: 'Enter your name',
        enterPhone: 'Enter mobile number (e.g., 010-1234-5678)',
        guide1: '- 8 to 20 characters',
        guide2: '- Use upper/lower letters, numbers, special chars',
        guide3: '- No sequential letters or digits',
        submit: 'Create Account',
        cancel: 'Cancel',
        already: 'Already have an account?',
        login: 'Log in',
        required: 'Please fill out all fields.',
        invalidEmail: 'Please enter a valid email.',
        mismatch: 'Passwords do not match.',
        invalidPhone: 'Please enter a valid phone number format.',
        success: 'Sign up complete. Redirecting to login.',
        validationPolicy: 'Password does not meet the policy.',
        agreementsTitle: 'Agreements',
        agreeAll: 'Agree to all',
        toggleOpen: 'Open',
        toggleClose: 'Close',
        tos: 'Terms of Service',
        privacy: 'Privacy Collection and Use',
        marketing: 'Marketing Usage',
        optional: 'Optional',
        marketingEmail: 'Email',
        marketingSms: 'SMS',
        view: 'View',
        agreeRequired: 'Please agree to required terms.',
        policyTosTitle: 'Terms of Service',
        policyPrivacyTitle: 'Privacy Collection and Use',
        policyMarketingTitle: 'Marketing Usage',
        close: 'Close'
      }
    } as const;
    return (texts as any)[currentLanguage]?.[key] ?? (texts as any).ko[key];
  };

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePhone = (value: string) => /^(010|011|016|017|018|019)-?\d{3,4}-?\d{4}$/.test(value);

  // Password policy helpers
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
      if (/^[A-Za-z]{3}$/.test(a + b + c)) {
        const ca = toCode(a), cb = toCode(b), cc = toCode(c);
        if (cb - ca === 1 && cc - cb === 1) return true;
      }
      if (/^[0-9]{3}$/.test(a + b + c)) {
        const ca = toCode(a), cb = toCode(b), cc = toCode(c);
        if (cb - ca === 1 && cc - cb === 1) return true;
      }
    }
    return false;
  };
  const isValidPassword = (pwd: string) => pwd.length >= 8 && pwd.length <= 20 && containsRequiredTypes(pwd) && !hasSequentialRun(pwd);

  // Visual guide state
  const ruleLengthOk = password.length >= 8 && password.length <= 20;
  const ruleTypesOk = containsRequiredTypes(password);
  const ruleNoSequentialOk = password.length === 0 ? false : !hasSequentialRun(password);
  const guideClass = (ok: boolean) => (password.length === 0 ? 'text-gray-700' : ok ? 'text-green-600' : 'text-red-600');
  const agreementsValid = agreeTos && agreePrivacy;
  const canSubmit = !!email && !!password && !!confirm && !!fullName && !!phone && isValidPassword(password) && agreementsValid && !isSubmitting;

  const marketingAll = agreeMarketingEmail && agreeMarketingSms;
  const allChecked = agreeTos && agreePrivacy && marketingAll;
  const toggleAll = (checked: boolean) => {
    setAgreeTos(checked);
    setAgreePrivacy(checked);
    setAgreeMarketingEmail(checked);
    setAgreeMarketingSms(checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email || !password || !confirm || !fullName || !phone) {
      setError(getText('required'));
      return;
    }
    if (!agreementsValid) {
      setError(getText('agreeRequired'));
      return;
    }
    if (!validateEmail(email)) {
      setError(getText('invalidEmail'));
      return;
    }
    if (!isValidPassword(password)) {
      setError(getText('validationPolicy'));
      return;
    }
    if (password !== confirm) {
      setError(getText('mismatch'));
      return;
    }
    if (!validatePhone(phone)) {
      setError(getText('invalidPhone'));
      return;
    }
    setIsSubmitting(true);
    try {
      const auth = getAuth(firebaseApp);
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (fullName.trim()) {
        await updateProfile(credential.user, { displayName: fullName.trim() });
      }
      await setDoc(doc(firestoreClient, 'users', credential.user.uid), {
        email: email.trim(),
        fullName: fullName.trim(),
        phone: phone.trim(),
        agreements: {
          tos: agreeTos,
          privacy: agreePrivacy,
          marketingEmail: agreeMarketingEmail,
          marketingSms: agreeMarketingSms,
        },
        createdAt: serverTimestamp(),
        language: currentLanguage,
        country: userCountry,
      }, { merge: true });

      setMessage(getText('success'));
      setTimeout(() => {
        window.location.href = '/login';
      }, 700);
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/email-already-in-use') {
        setError('이미 가입된 이메일입니다.');
      } else if (code === 'auth/invalid-email') {
        setError(getText('invalidEmail'));
      } else if (code === 'auth/weak-password') {
        setError(getText('validationPolicy'));
      } else {
        setError(err?.message || '가입 중 오류가 발생했습니다.');
      }
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

      <main className="flex-1" style={{ paddingTop: isBannerVisible ? '112px' : '64px' }}>
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900">{getText('pageTitle')}</h1>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Agreements */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={(e) => toggleAll(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm font-semibold text-gray-900">{`${getText('agreementsTitle')} ${getText('agreeAll')}`}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsTermsExpanded(!isTermsExpanded)}
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    {isTermsExpanded ? getText('toggleClose') : getText('toggleOpen')}
                  </button>
                </div>
                {isTermsExpanded && (
                  <div className="mt-4 space-y-3">
                    {/* TOS */}
                    <div className="flex items-start justify-between">
                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={agreeTos}
                          onChange={(e) => setAgreeTos(e.target.checked)}
                          className="h-4 w-4 mt-0.5"
                        />
                        <span className="text-sm text-gray-800">{getText('tos')} <span className="ml-1 text-xs text-red-600">(필수)</span></span>
                      </label>
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => setOpenPolicy('tos')}
                      >
                        {getText('view')}
                      </button>
                    </div>
                    {/* Privacy */}
                    <div className="flex items-start justify-between">
                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={agreePrivacy}
                          onChange={(e) => setAgreePrivacy(e.target.checked)}
                          className="h-4 w-4 mt-0.5"
                        />
                        <span className="text-sm text-gray-800">{getText('privacy')} <span className="ml-1 text-xs text-red-600">(필수)</span></span>
                      </label>
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => setOpenPolicy('privacy')}
                      >
                        {getText('view')}
                      </button>
                    </div>
                    {/* Marketing (optional) */}
                    <div>
                      <div className="flex items-start justify-between">
                        <label className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={marketingAll}
                            onChange={(e) => { setAgreeMarketingEmail(e.target.checked); setAgreeMarketingSms(e.target.checked); }}
                            className="h-4 w-4 mt-0.5"
                          />
                          <span className="text-sm text-gray-800">{getText('marketing')} <span className="ml-1 text-xs text-gray-500">({getText('optional')})</span></span>
                        </label>
                        <button
                          type="button"
                          className="text-sm text-blue-600 hover:underline"
                          onClick={() => setOpenPolicy('marketing')}
                        >
                          {getText('view')}
                        </button>
                      </div>
                      <div className="mt-2 pl-7 flex items-center gap-4 text-sm text-gray-800">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="h-4 w-4" checked={agreeMarketingEmail} onChange={(e) => setAgreeMarketingEmail(e.target.checked)} />
                          <span>{getText('marketingEmail')}</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="h-4 w-4" checked={agreeMarketingSms} onChange={(e) => setAgreeMarketingSms(e.target.checked)} />
                          <span>{getText('marketingSms')}</span>
                        </label>
                      </div>
                    </div>
                    {!agreementsValid && (
                      <div className="text-xs text-red-600">{getText('agreeRequired')}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">{getText('email')}</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={getText('enterEmail')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">{getText('password')}</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={getText('enterPassword')}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    aria-label={showPwd ? 'hide password' : 'show password'}
                  >
                    {showPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                 <ul className="mt-2 text-xs space-y-1">
                   <li className={guideClass(ruleLengthOk)}>{getText('guide1')}</li>
                   <li className={guideClass(ruleTypesOk)}>{getText('guide2')}</li>
                   <li className={guideClass(ruleNoSequentialOk)}>{getText('guide3')}</li>
                 </ul>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">{getText('confirm')}</label>
                <div className="relative">
                  <input
                    id="confirm"
                    type={showConfirmPwd ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder={getText('reenterPassword')}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    aria-label={showConfirmPwd ? 'hide password' : 'show password'}
                  >
                    {showConfirmPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {confirm && password !== confirm && (
                  <p className="mt-2 text-sm text-red-600">{getText('mismatch')}</p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">{getText('fullName')}</label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={getText('enterFullName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">{getText('phone')}</label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={getText('enterPhone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}
              {message && <div className="text-sm text-green-600">{message}</div>}

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { window.location.href = '/'; }}
                  className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {getText('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '...' : getText('submit')}
                </button>
              </div>
            </form>
          </div>
          {/* Policy Modal */}
          {openPolicy && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black opacity-40" onClick={() => setOpenPolicy(null)} />
              <div className="relative bg-white rounded-lg shadow-lg w-11/12 max-w-2xl max-h-[80vh] p-5 overflow-auto">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {openPolicy === 'tos' && getText('policyTosTitle')}
                    {openPolicy === 'privacy' && getText('policyPrivacyTitle')}
                    {openPolicy === 'marketing' && getText('policyMarketingTitle')}
                  </h3>
                  <button
                    type="button"
                    className="text-sm text-gray-700 hover:text-gray-900"
                    onClick={() => setOpenPolicy(null)}
                  >
                    {getText('close')}
                  </button>
                </div>
                <div className="text-sm text-gray-700 space-y-3">
                  {openPolicy === 'tos' && (
                    <div className="w-full">
                      <iframe title="terms" src="/terms?embed=1" className="w-full h-[60vh] border-0" />
                    </div>
                  )}
                  {openPolicy === 'privacy' && (
                    <div className="space-y-2">
                      <p>SEEPN은 아래와 같이 개인정보를 수집 및 이용합니다.</p>
                      <p><span className="font-semibold">수집목적</span> : 회원가입 시 본인확인, 마케팅 활용</p>
                      <p><span className="font-semibold">수집항목</span> : 이메일, 비밀번호, 성명, 휴대폰 번호</p>
                      <p><span className="font-semibold">보유기간</span> : 회원탈퇴 시</p>
                      <p><span className="font-semibold">동의 거부 시 안내</span> : 동의를 거부하실 수 있으며, 필수 항목 미동의 시 회원가입이 제한될 수 있습니다.</p>
                    </div>
                  )}
                  {openPolicy === 'marketing' && (
                    <>
                      <p>마케팅 정보 수신 동의 시, 이메일/문자 등을 통해 맞춤형 소식과 혜택을 받아보실 수 있습니다.</p>
                      <p>동의하지 않으셔도 서비스 이용에는 제한이 없습니다. 언제든 동의를 철회할 수 있습니다.</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="mt-6 text-center text-sm text-gray-700">
            <span className="mr-2">{getText('already')}</span>
            <Link href="/login" className="text-blue-600 hover:underline">{getText('login')}</Link>
          </div>
        </div>
      </main>

      <Footer currentLanguage={currentLanguage} userCountry={userCountry} />
    </div>
  );
}


