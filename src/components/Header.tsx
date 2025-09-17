'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, User, Globe, X, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { firebaseApp, firestoreClient } from '@/lib/firebase/client';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface HeaderProps {
  isBannerVisible: boolean;
  setIsBannerVisible: (visible: boolean) => void;
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;
}

export default function Header({
  isBannerVisible,
  setIsBannerVisible,
  currentLanguage,
  setCurrentLanguage,
  isLoggedIn,
  setIsLoggedIn,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = React.useState(false);
  const [isMyPageOpen, setIsMyPageOpen] = React.useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = React.useState(0);
  const [isBannerPaused, setIsBannerPaused] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState<string>('');
  const [userDisplayName, setUserDisplayName] = React.useState<string>('');
  const [userNickname, setUserNickname] = React.useState<string>('');
  const [userPhotoURL, setUserPhotoURL] = React.useState<string | null>(null);

  const languages = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  const banners = [
    { id: 1, title: '신규 공급사 등록 이벤트', color: 'from-blue-500 to-purple-600' },
    { id: 2, title: '특별 할인 프로모션', color: 'from-green-500 to-teal-600' },
    { id: 3, title: '프리미엄 서비스 소개', color: 'from-orange-500 to-red-600' },
    { id: 4, title: '고객 만족도 조사', color: 'from-pink-500 to-rose-600' },
  ];

  const handleLanguageSelect = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    setIsLanguageOpen(false);
  };

  const handlePreviousBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  };

  // Banner auto-rotation
  React.useEffect(() => {
    if (!isBannerPaused && isMenuOpen) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isBannerPaused, isMenuOpen, banners.length]);

  // Auth state sync
  React.useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserEmail(user.email || '');
        setUserDisplayName(user.displayName || '');
        setUserPhotoURL(user.photoURL || null);
        try {
          const snap = await getDoc(doc(firestoreClient, 'users', user.uid));
          const data = snap.exists() ? snap.data() as any : null;
          setUserNickname(data?.nickname || '');
        } catch {
          setUserNickname('');
        }
      } else {
        setIsLoggedIn(false);
        setUserEmail('');
        setUserDisplayName('');
        setUserNickname('');
        setUserPhotoURL(null);
      }
    });
    return () => unsub();
  }, [setIsLoggedIn]);

  // Language-specific text content
  const getText = (key: string) => {
    const texts = {
      ko: {
        serviceName: '공급사 검색 서비스',
        home: '홈',
        suppliers: '공급사',
        top100: 'TOP100',
        board: '자유 토론방',
        // 메뉴 관련
        menu: '메뉴',
        notice: '공지사항',
        faq: 'FAQ',
        // 마이페이지 관련
        mypage: '마이페이지',
        loginPrompt: '로그인 하세요.',
        login: '로그인',
        logout: '로그아웃',
        editProfile: '회원정보 수정',
        changePassword: '비밀번호 변경',
        favoriteSuppliers: '관심 공급사',
        evaluatedSuppliers: '평가 공급사',
        myPosts: '등록한 게시글',
        oneOnOneInquiry: '1:1문의',
        withdrawal: '회원탈퇴',
        withdrawalConfirm: '정말로 회원탈퇴를 하시겠습니까?',
        withdrawalComplete: '회원탈퇴가 완료되었습니다.'
      },
      en: {
        serviceName: 'Supplier Search Service',
        home: 'Home',
        suppliers: 'Suppliers',
        top100: 'TOP100',
        board: 'Board',
        // 메뉴 관련
        menu: 'Menu',
        notice: 'Notice',
        faq: 'FAQ',
        // 마이페이지 관련
        mypage: 'My Page',
        loginPrompt: 'Please log in.',
        login: 'Login',
        logout: 'Logout',
        editProfile: 'Edit Profile',
        changePassword: 'Change Password',
        favoriteSuppliers: 'Favorite Suppliers',
        evaluatedSuppliers: 'Evaluated Suppliers',
        myPosts: 'My Posts',
        oneOnOneInquiry: '1:1 Inquiry',
        withdrawal: 'Account Deletion',
        withdrawalConfirm: 'Are you sure you want to delete your account?',
        withdrawalComplete: 'Account deletion completed.'
      },
      ja: {
        serviceName: 'サプライヤー検索サービス',
        home: 'ホーム',
        suppliers: 'サプライヤー',
        top100: 'TOP100',
        board: '掲示板',
        // 메뉴 관련
        menu: 'メニュー',
        notice: 'お知らせ',
        faq: 'FAQ',
        // 마이페이지 관련
        mypage: 'マイページ',
        loginPrompt: 'ログインしてください。',
        login: 'ログイン',
        logout: 'ログアウト',
        editProfile: '会員情報修正',
        changePassword: 'パスワード変更',
        favoriteSuppliers: 'お気に入りサプライヤー',
        evaluatedSuppliers: '評価済みサプライヤー',
        myPosts: '投稿した記事',
        oneOnOneInquiry: '1:1お問い合わせ',
        withdrawal: '退会',
        withdrawalConfirm: '本当に退会しますか？',
        withdrawalComplete: '退会が完了しました。'
      },
      zh: {
        serviceName: '供应商搜索服务',
        home: '首页',
        suppliers: '供应商',
        top100: 'TOP100',
        board: '论坛',
        // 메뉴 관련
        menu: '菜单',
        notice: '公告',
        faq: '常见问题',
        // 마이페이지 관련
        mypage: '我的页面',
        loginPrompt: '请登录。',
        login: '登录',
        logout: '退出登录',
        editProfile: '修改会员信息',
        changePassword: '更改密码',
        favoriteSuppliers: '关注供应商',
        evaluatedSuppliers: '评价供应商',
        myPosts: '我的帖子',
        oneOnOneInquiry: '1:1咨询',
        withdrawal: '注销账户',
        withdrawalConfirm: '确定要注销账户吗？',
        withdrawalComplete: '账户注销完成。'
      }
    };
    
    return texts[currentLanguage as keyof typeof texts]?.[key as keyof typeof texts.ko] || texts.ko[key as keyof typeof texts.ko];
  };

  return (
    <>
      {/* Top Banner */}
      {isBannerVisible && (
        <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white z-50 flex items-center" style={{ height: '48px' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center flex-1">
                <span className="text-sm font-medium">🎉 새로운 공급사 등록 이벤트 진행 중! 지금 바로 확인해보세요</span>
              </div>
              <button
                onClick={() => setIsBannerVisible(false)}
                className="p-1 hover:bg-blue-700 rounded transition-colors flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-100 z-40" style={{ top: isBannerVisible ? '48px' : '0px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <h1 className="text-2xl font-bold text-gray-900">SEEPN</h1>
                <span className="hidden md:block ml-2 text-sm text-gray-500">{getText('serviceName')}</span>
              </Link>
            </div>
            
            {/* Menu, User, and Language Icons */}
            <div className="flex items-center space-x-4">
              {/* Menu Icon */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {/* User Icon */}
              <button 
                onClick={() => setIsMyPageOpen(!isMyPageOpen)}
                className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <User className="h-6 w-6" />
              </button>
              
              {/* Language Selector */}
              <div className="relative language-dropdown">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Globe className="h-6 w-6" />
                </button>
                
                {/* Language Dropdown */}
                {isLanguageOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageSelect(language.code)}
                        className={`w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          currentLanguage === language.code ? 'text-blue-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        <span className="mr-3 text-lg">{language.flag}</span>
                        {language.name}
                        {currentLanguage === language.code && (
                          <span className="ml-auto text-blue-600">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Side Menu Overlay */}
      {(isMenuOpen || isMyPageOpen) && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-30"
          onClick={() => {
            setIsMenuOpen(false);
            setIsMyPageOpen(false);
          }}
        />
      )}

      {/* Side Menu */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`} style={{ top: isBannerVisible ? '48px' : '0px' }}>
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{getText('menu')}</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Menu Items */}
          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="flex items-center p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg mr-3">🏠</span>
                  {getText('home')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/suppliers" 
                  className="flex items-center p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg mr-3">🏢</span>
                  {getText('suppliers')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/top100" 
                  className="flex items-center p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg mr-3">🏆</span>
                  {getText('top100')}
                </Link>
              </li>
              <li>
                <Link
                  href="/board"
                  className="flex items-center p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg mr-3">📋</span>
                  {getText('board')}
                </Link>
              </li>
              <li>
                <div className="p-3 pb-4 relative">
                  <div className="bg-gradient-to-r rounded-lg h-20 flex items-center justify-center text-white font-semibold overflow-hidden" 
                       style={{ background: `linear-gradient(to right, ${banners[currentBannerIndex].color.split(' ')[0] === 'from-blue-500' ? '#3b82f6' : banners[currentBannerIndex].color.split(' ')[0] === 'from-green-500' ? '#10b981' : banners[currentBannerIndex].color.split(' ')[0] === 'from-orange-500' ? '#f97316' : '#ec4899'}, ${banners[currentBannerIndex].color.split(' ')[2] === 'to-purple-600' ? '#9333ea' : banners[currentBannerIndex].color.split(' ')[2] === 'to-teal-600' ? '#0d9488' : banners[currentBannerIndex].color.split(' ')[2] === 'to-red-600' ? '#dc2626' : '#e11d48'})` }}>
                    {banners[currentBannerIndex].title}
                  </div>
                  
                  {/* Banner Controls - Outside of banner */}
                  <div className="absolute -bottom-3 right-1 flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviousBanner();
                      }}
                      className="text-gray-600 p-1 hover:text-gray-800 transition-colors"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                    <span className="text-xs text-gray-600 px-1">
                      {currentBannerIndex + 1}/{banners.length}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextBanner();
                      }}
                      className="text-gray-600 p-1 hover:text-gray-800 transition-colors"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsBannerPaused(!isBannerPaused);
                      }}
                      className="text-gray-600 p-1 hover:text-gray-800 transition-colors ml-1"
                    >
                      {isBannerPaused ? (
                        <Play className="h-3 w-3" />
                      ) : (
                        <Pause className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              </li>
              <li>
                <Link
                  href="/notice"
                  className="flex items-center p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg mr-3">📢</span>
                  {getText('notice')}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="flex items-center p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg mr-3">❓</span>
                  {getText('faq')}
                </Link>
              </li>

            </ul>
          </nav>
        </div>
      </div>

      {/* MyPage Side Menu */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
        isMyPageOpen ? 'translate-x-0' : 'translate-x-full'
      }`} style={{ top: isBannerVisible ? '48px' : '0px' }}>
        <div className="flex flex-col h-full">
          {/* MyPage Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{getText('mypage')}</h2>
            <button
              onClick={() => setIsMyPageOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* User Info Section */}
          <div className="p-6 border-b border-gray-200">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full overflow-hidden flex items-center justify-center">
                  {userPhotoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={userPhotoURL} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{userNickname || userDisplayName || '사용자'}</p>
                  <p className="text-sm text-gray-500">{userEmail}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-3">{getText('loginPrompt')}</p>
                <button 
                  onClick={() => { setIsMyPageOpen(false); window.location.href = '/login'; }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  {getText('login')}
                </button>
              </div>
            )}
          </div>
          
          {/* MyPage Menu Items */}
          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/mypage" 
                  className="flex items-center p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMyPageOpen(false)}
                >
                  <span className="text-lg mr-3">👤</span>
                  {getText('mypage')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/mypage/profile" 
                  className="flex items-center p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMyPageOpen(false)}
                >
                  <span className="text-lg mr-3">✏️</span>
                  {getText('editProfile')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/mypage/change-password"
                  className="flex items-center p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMyPageOpen(false)}
                >
                  <span className="text-lg mr-3">🔒</span>
                  {getText('changePassword')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/mypage/favorites" 
                  className="flex items-center p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMyPageOpen(false)}
                >
                  <span className="text-lg mr-3">⭐</span>
                  {getText('favoriteSuppliers')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/mypage/evaluations" 
                  className="flex items-center p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMyPageOpen(false)}
                >
                  <span className="text-lg mr-3">📊</span>
                  {getText('evaluatedSuppliers')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/mypage/posts" 
                  className="flex items-center p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMyPageOpen(false)}
                >
                  <span className="text-lg mr-3">📝</span>
                  {getText('myPosts')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/mypage/inquiries" 
                  className="flex items-center p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMyPageOpen(false)}
                >
                  <span className="text-lg mr-3">💬</span>
                  {getText('oneOnOneInquiry')}
                </Link>
              </li>
              {isLoggedIn && (
                <li className="pt-4 border-t border-gray-200">
                  <button 
                    onClick={async () => {
                      try {
                        await signOut(getAuth(firebaseApp));
                      } finally {
                        setIsLoggedIn(false);
                        setIsMyPageOpen(false);
                      }
                    }}
                    className="flex items-center p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                  >
                    <span className="text-lg mr-3">🚪</span>
                    {getText('logout')}
                  </button>
                  <button 
                    onClick={() => {
                      setIsMyPageOpen(false);
                      window.location.href = '/mypage/withdrawal';
                    }}
                    className="flex items-center p-2 mt-2 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                  >
                    <span className="text-sm mr-2">🗑️</span>
                    {getText('withdrawal')}
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}