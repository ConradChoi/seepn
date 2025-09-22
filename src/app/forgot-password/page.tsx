'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoginTexts } from '../types';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isBannerVisible, setIsBannerVisible] = React.useState(true);
  const [currentLanguage, setCurrentLanguage] = React.useState<'ko' | 'en' | 'ja' | 'zh'>('ko');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userCountry, setUserCountry] = React.useState('대한민국');

  const [email, setEmail] = React.useState('');
  const [sentCode, setSentCode] = React.useState('');
  const [inputCode, setInputCode] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [expiresAt, setExpiresAt] = React.useState<number | null>(null);
  const [remainingSec, setRemainingSec] = React.useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

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

  const getText = (key: keyof LoginTexts) => {
    const texts: Record<'ko' | 'en' | 'ja' | 'zh', LoginTexts> = {
      ko: {
        pageTitle: '비밀번호 찾기',
        email: '가입한 이메일 입력',
        code: '인증번호 입력',
        sendCode: '인증번호 전송',
        verifying: '검증 중...',
        verify: '인증번호 확인',
        sent: '인증번호를 이메일로 전송했습니다.',
        invalidEmail: '올바른 이메일을 입력하세요.',
        enterCode: '전송된 인증번호 6자리를 입력하세요.',
        incorrectCode: '입력한 인증번호가 다릅니다.',
        proceed: '검증이 완료되었습니다. 비밀번호 재설정 화면으로 이동합니다.',
        expired: '입력시간이 초과하였습니다. 인증번호 재발급 후 진행해주세요.',
        resend: '인증번호 재발급',
        timeLeft: '남은 시간',
      },
      en: {
        pageTitle: 'Find Password',
        email: 'Enter your registered email',
        code: 'Enter verification code',
        sendCode: 'Send Code',
        verifying: 'Verifying...',
        verify: 'Verify Code',
        sent: 'Verification code sent to your email.',
        invalidEmail: 'Please enter a valid email.',
        enterCode: 'Enter the 6-digit code you received.',
        incorrectCode: 'Incorrect verification code.',
        proceed: 'Verification completed. Redirecting to reset page.',
        expired: 'The code has expired. Please request a new code.',
        resend: 'Resend Code',
        timeLeft: 'Time left',
      },
      ja: {
        pageTitle: 'パスワードを探す',
        email: '登録したメールアドレスを入力してください',
        code: '認証コードを入力してください',
        sendCode: 'コードを送信',
        verifying: '検証中...',
        verify: 'コードを確認',
        sent: '認証コードをメールに送信しました。',
        invalidEmail: '有効なメールアドレスを入力してください。',
        enterCode: '受信した6桁のコードを入力してください。',
        incorrectCode: '認証コードが正しくありません。',
        proceed: '検証が完了しました。リセットページに移動します。',
        expired: 'コードの有効期限が切れました。再発行してください。',
        resend: 'コードを再送',
        timeLeft: '残り時間',
      },
      zh: {
        pageTitle: '找回密码',
        email: '请输入注册邮箱',
        code: '输入验证码',
        sendCode: '发送验证码',
        verifying: '验证中...',
        verify: '验证验证码',
        sent: '验证码已发送到您的邮箱。',
        invalidEmail: '请输入有效的邮箱地址。',
        enterCode: '请输入收到的6位验证码。',
        incorrectCode: '验证码不正确。',
        proceed: '验证完成。正在跳转到重置页面。',
        expired: '验证码已过期，请重新获取。',
        resend: '重新发送验证码',
        timeLeft: '剩余时间',
      }
    } as const;
    return texts[currentLanguage]?.[key] ?? texts.ko[key];
    // return (texts as any)[currentLanguage]?.[key] ?? (texts as any).ko[key];
  };

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current as unknown as number);
      timerRef.current = null;
    }
  };

  const startTimer = (expireEpochMs: number) => {
    clearTimer();
    const update = () => {
      const sec = Math.max(0, Math.floor((expireEpochMs - Date.now()) / 1000));
      setRemainingSec(sec);
      if (sec === 0) {
        clearTimer();
      }
    };
    update();
    timerRef.current = setInterval(update, 1000);
  };

  const handleSendCode = async () => {
    setMessage('');
    if (!email || !validateEmail(email)) {
      setMessage(getText('invalidEmail') ?? '');
      return;
    }
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 600));
    // Mock 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code ?? '');
    const expireAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    setExpiresAt(expireAt);
    startTimer(expireAt);
    setMessage(getText('sent') ?? '');
    setIsSending(false);
  };

  const handleVerify = async () => {
    setMessage('');
    if (!inputCode || inputCode.length !== 6) {
      setMessage(getText('enterCode') ?? '');
      return;
    }
    if (!expiresAt || Date.now() > expiresAt) {
      setMessage(getText('expired') ?? '');
      return;
    }
    setIsVerifying(true);
    await new Promise((r) => setTimeout(r, 500));
    if (inputCode !== sentCode) {
      setMessage(getText('incorrectCode') ?? '');
      setIsVerifying(false);
      return;
    }
    setMessage(getText('proceed') ?? '');
    clearTimer();
    setTimeout(() => {
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    }, 700);
  };

  React.useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

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

          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{getText('email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={isSending || !validateEmail(email)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {getText('sendCode')}
                </button>
              </div>
            </div>

            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{getText('code')}</label>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent tracking-widest"
              />
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={isVerifying || inputCode.length !== 6 || !sentCode}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isVerifying ? getText('verifying') : getText('verify')}
                </button>
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={isSending || !validateEmail(email)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {getText('resend')}
                </button>
                {expiresAt && (
                  <span className="ml-auto text-sm text-gray-600">
                    {getText('timeLeft')}: {String(Math.floor(remainingSec / 60)).padStart(2, '0')}:{String(remainingSec % 60).padStart(2, '0')}
                  </span>
                )}
              </div>
            </div>

            {message && <div className="text-sm text-gray-700">{message}</div>}
          </div>
        </div>
      </main>

      <Footer currentLanguage={currentLanguage} userCountry={userCountry} />
    </div>
  );
}


