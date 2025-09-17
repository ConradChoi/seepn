'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Menu, User, Globe, X, Play, Pause, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getL1Categories } from '../utils/categories';
import { getL1Areas } from '../utils/areas';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = React.useState(false);
  const [currentLanguage, setCurrentLanguage] = React.useState('ko');
  const [isBannerVisible, setIsBannerVisible] = React.useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = React.useState(0);
  const [isBannerPaused, setIsBannerPaused] = React.useState(false);
  const [userCountry, setUserCountry] = React.useState('대한민국');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [selectedArea, setSelectedArea] = React.useState('');
  const [isMyPageOpen, setIsMyPageOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // 로그인 상태 관리
  const [isMobile, setIsMobile] = React.useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
  const [isAreaModalOpen, setIsAreaModalOpen] = React.useState(false);

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

  // Close language dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.language-dropdown')) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Banner auto-rotation
  React.useEffect(() => {
    if (!isBannerPaused && isMenuOpen) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isBannerPaused, isMenuOpen, banners.length]);

  // Mobile detection
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    setIsLanguageOpen(false);
  };

  const handlePreviousBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  };

  // Get user's country based on IP
  React.useEffect(() => {
    const getUserCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryNames: { [key: string]: string } = {
          'KR': '대한민국',
          'US': '미국',
          'JP': '일본',
          'CN': '중국',
          'GB': '영국',
          'DE': '독일',
          'FR': '프랑스',
          'CA': '캐나다',
          'AU': '호주',
          'IN': '인도',
          'BR': '브라질',
          'RU': '러시아',
          'IT': '이탈리아',
          'ES': '스페인',
          'NL': '네덜란드',
          'SE': '스웨덴',
          'NO': '노르웨이',
          'DK': '덴마크',
          'FI': '핀란드',
          'SG': '싱가포르',
          'TH': '태국',
          'VN': '베트남',
          'ID': '인도네시아',
          'MY': '말레이시아',
          'PH': '필리핀'
        };
        
        const country = countryNames[data.country_code] || data.country_name || '대한민국';
        setUserCountry(country);
      } catch (error) {
        console.log('Failed to get user country:', error);
        // 기본값으로 대한민국 유지
      }
    };

    getUserCountry();
  }, []);

  // 카테고리 데이터 가져오기
  const l1Categories = React.useMemo(() => getL1Categories(currentLanguage), [currentLanguage]);
  
  // 지역 데이터 가져오기
  const l1Areas = React.useMemo(() => getL1Areas(currentLanguage), [currentLanguage]);

  // Language-specific text content
  const getText = (key: string) => {
    const texts = {
      ko: {
        serviceName: '공급사 검색 서비스',
        home: '홈',
        suppliers: '공급사',
        top100: 'TOP100',
        board: '자유 토론방',
        heroTitle: '최적의 공급사를 찾아보세요',
        heroSubtitle: '다양한 산업 분야의 신뢰할 수 있는 공급사들을 검색하고 비교해보세요. 품질과 가격을 모두 만족하는 최적의 파트너를 찾을 수 있습니다.',
        searchTitle: '공급사 검색',
        searchSubtitle: '원하는 조건을 입력하여 공급사를 검색해보세요',
        searchPlaceholder: '제품/서비스명, 공급사명 등 입력하세요',
        searchButton: '검색하기',
        category: '품목',
        location: '지역',
        companySize: '기업 규모',
        allCategories: '전체 품목',
        allLocations: '전체 지역',
        allSizes: '전체 규모',
        popularCategories: '인기 업종',
        accurateSearch: '정확한 검색',
        accurateSearchDesc: '다양한 필터를 통해 원하는 조건에 맞는 공급사를 정확하게 찾을 수 있습니다.',
        reliableInfo: '신뢰할 수 있는 정보',
        reliableInfoDesc: '검증된 공급사 정보와 실시간 업데이트로 신뢰할 수 있는 데이터를 제공합니다.',
        fastConnection: '빠른 연결',
        fastConnectionDesc: '원하는 공급사를 찾으면 바로 연락처 정보를 확인하고 연결할 수 있습니다.',
        footerTagline: '최적의 공급사를 찾는 가장 쉬운 방법',
        services: '서비스',
        customerSupport: '고객지원',
        contact: '연락처',
        supplierSearch: '공급사 검색',
        categoryClassification: '업종별 분류',
        comparisonAnalysis: '비교 분석',
        faq: 'FAQ',
        terms: '이용약관',
        email: '이메일: contact@seepn.com',
        phone: '전화: 02-1234-5678',
        address: '주소: 서울시 강남구',
        copyright: '© 2025 SEEPN. All rights reserved.',
        accessCountry: '접속한 국가',
        ylia: '일리아',
        termsOfService: '이용약관',
        privacyPolicy: '개인정보처리방침',
        partnershipInquiry: '제휴/광고문의',
        supplier: '공급사',
        // 메뉴 관련
        menu: '메뉴',
        notice: '공지사항',
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
        heroTitle: 'Find the Best Suppliers',
        heroSubtitle: 'Search and compare reliable suppliers across various industries. Find the perfect partner that meets both quality and price requirements.',
        searchTitle: 'Supplier Search',
        searchSubtitle: 'Enter your desired conditions to search for suppliers',
        searchPlaceholder: 'Enter product/service name, supplier name, etc.',
        searchButton: 'Search',
        category: 'Product/Service',
        location: 'Location',
        companySize: 'Company Size',
        allCategories: 'All Industries',
        allLocations: 'All Locations',
        allSizes: 'All Sizes',
        popularCategories: 'Popular Industries',
        accurateSearch: 'Accurate Search',
        accurateSearchDesc: 'Find suppliers that match your exact requirements through various filters.',
        reliableInfo: 'Reliable Information',
        reliableInfoDesc: 'Provide verified supplier information and real-time updates for reliable data.',
        fastConnection: 'Fast Connection',
        fastConnectionDesc: 'Find the supplier you want and immediately check contact information and connect.',
        footerTagline: 'The easiest way to find the best suppliers',
        services: 'Services',
        customerSupport: 'Customer Support',
        contact: 'Contact',
        supplierSearch: 'Supplier Search',
        categoryClassification: 'Category Classification',
        comparisonAnalysis: 'Comparison Analysis',
        faq: 'FAQ',
        terms: 'Terms of Service',
        email: 'Email: contact@seepn.com',
        phone: 'Phone: 02-1234-5678',
        address: 'Address: Gangnam-gu, Seoul',
        copyright: '© 2025 SEEPN. All rights reserved.',
        accessCountry: 'Access Country',
        ylia: 'Ylia',
        termsOfService: 'Terms of Service',
        privacyPolicy: 'Privacy Policy',
        partnershipInquiry: 'Partnership/Ad Inquiry',
        supplier: 'Supplier',
        // 메뉴 관련
        menu: 'Menu',
        notice: 'Notice',
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
        heroTitle: '最高のサプライヤーを見つけましょう',
        heroSubtitle: '様々な業界の信頼できるサプライヤーを検索・比較してください。品質と価格の両方を満たす最適なパートナーを見つけることができます。',
        searchTitle: 'サプライヤー検索',
        searchSubtitle: '希望する条件を入力してサプライヤーを検索してください',
        searchPlaceholder: '製品/サービス名、サプライヤー名など入力してください',
        searchButton: '検索',
        category: '製品/サービス',
        location: '地域',
        companySize: '企業規模',
        allCategories: '全業界',
        allLocations: '全地域',
        allSizes: '全規模',
        popularCategories: '人気業界',
        accurateSearch: '正確な検索',
        accurateSearchDesc: '様々なフィルターを通じて希望する条件に合うサプライヤーを正確に見つけることができます。',
        reliableInfo: '信頼できる情報',
        reliableInfoDesc: '検証されたサプライヤー情報とリアルタイム更新で信頼できるデータを提供します。',
        fastConnection: '迅速な接続',
        fastConnectionDesc: '希望するサプライヤーを見つけたら、すぐに連絡先情報を確認して接続できます。',
        footerTagline: '最高のサプライヤーを見つける最も簡単な方法',
        services: 'サービス',
        customerSupport: 'カスタマーサポート',
        contact: 'お問い合わせ',
        supplierSearch: 'サプライヤー検索',
        categoryClassification: '業界別分類',
        comparisonAnalysis: '比較分析',
        faq: 'FAQ',
        terms: '利用規約',
        email: 'メール: contact@seepn.com',
        phone: '電話: 02-1234-5678',
        address: '住所: ソウル市江南区',
        copyright: '© 2025 SEEPN. All rights reserved.',
        accessCountry: 'アクセス国',
        ylia: 'イリア',
        termsOfService: '利用規約',
        privacyPolicy: 'プライバシーポリシー',
        partnershipInquiry: '提携/広告お問い合わせ',
        supplier: 'サプライヤー',
        // 메뉴 관련
        menu: 'メニュー',
        notice: 'お知らせ',
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
        board: '公告板',
        heroTitle: '寻找最佳供应商',
        heroSubtitle: '搜索和比较各个行业的可靠供应商。找到满足质量和价格要求的最佳合作伙伴。',
        searchTitle: '供应商搜索',
        searchSubtitle: '输入您想要的条件来搜索供应商',
        searchPlaceholder: '输入产品/服务名称、供应商名称等',
        searchButton: '搜索',
        category: '产品/服务',
        location: '地区',
        companySize: '企业规模',
        allCategories: '所有行业',
        allLocations: '所有地区',
        allSizes: '所有规模',
        popularCategories: '热门行业',
        accurateSearch: '精确搜索',
        accurateSearchDesc: '通过各种过滤器找到符合您确切要求的供应商。',
        reliableInfo: '可靠信息',
        reliableInfoDesc: '提供经过验证的供应商信息和实时更新，确保数据可靠。',
        fastConnection: '快速连接',
        fastConnectionDesc: '找到您想要的供应商后，立即查看联系信息并进行连接。',
        footerTagline: '寻找最佳供应商的最简单方法',
        services: '服务',
        customerSupport: '客户支持',
        contact: '联系我们',
        supplierSearch: '供应商搜索',
        categoryClassification: '行业分类',
        comparisonAnalysis: '比较分析',
        faq: '常见问题',
        terms: '服务条款',
        email: '邮箱: contact@seepn.com',
        phone: '电话: 02-1234-5678',
        address: '地址: 首尔市江南区',
        copyright: '© 2025 SEEPN. All rights reserved.',
        accessCountry: '访问国家',
        ylia: '一利亚',
        termsOfService: '服务条款',
        privacyPolicy: '隐私政策',
        partnershipInquiry: '合作/广告咨询',
        supplier: '供应商',
        // 메뉴 관련
        menu: '菜单',
        notice: '公告',
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Shared Header */}
      <Header
        isBannerVisible={isBannerVisible}
        setIsBannerVisible={setIsBannerVisible}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

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
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">홍길동님</p>
                  <p className="text-sm text-gray-500">user@example.com</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-3">{getText('loginPrompt')}</p>
                <button 
                  onClick={() => setIsLoggedIn(true)} // 임시 로그인 기능
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
                    onClick={() => {
                      setIsLoggedIn(false);
                      setIsMyPageOpen(false);
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

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center" style={{ paddingTop: isBannerVisible ? '112px' : '64px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            {getText('heroTitle')}
          </h2>
        </div>

        {/* Search Section */}
        <div className="mb-16">
          {/* Search Form */}
          <div className="space-y-6">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    {getText('category')}
                  </label>
                  {/* PC Select */}
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="hidden md:block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">{getText('allCategories')}</option>
                    {l1Categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {/* MO Button opens modal */}
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="md:hidden w-full px-3 py-3 border border-gray-300 rounded-lg bg-white flex items-center justify-between"
                  >
                    <span>
                      {selectedCategory
                        ? (l1Categories.find(c => c.value === selectedCategory)?.label || getText('allCategories'))
                        : getText('allCategories')}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    {getText('location')}
                  </label>
                  {/* PC Select */}
                  <select
                    id="location"
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="hidden md:block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">{getText('allLocations')}</option>
                    {l1Areas.map((area) => (
                      <option key={area.value} value={area.value}>
                        {area.label}
                      </option>
                    ))}
                  </select>
                  {/* MO Button opens modal */}
                  <button
                    type="button"
                    onClick={() => setIsAreaModalOpen(true)}
                    className="md:hidden w-full px-3 py-3 border border-gray-300 rounded-lg bg-white flex items-center justify-between"
                  >
                    <span>
                      {selectedArea
                        ? (l1Areas.find(a => a.value === selectedArea)?.label || getText('allLocations'))
                        : getText('allLocations')}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Main Search */}
              <div>
                <label htmlFor="main-search" className="block text-sm font-medium text-gray-700 mb-2">
                  검색어
                </label>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      id="main-search"
                      className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={getText('searchPlaceholder')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const keyword = (e.currentTarget as HTMLInputElement).value.trim();
                          const params = new URLSearchParams();
                          if (keyword) params.set('q', keyword);
                          if (selectedCategory) params.set('c', selectedCategory);
                          if (selectedArea) params.set('a', selectedArea);
                          const qs = params.toString();
                          router.push(`/suppliers${qs ? `?${qs}` : ''}`);
                        }
                      }}
                    />
                    <button
                      type="button"
                      aria-label="search"
                      onClick={() => {
                        const el = document.getElementById('main-search') as HTMLInputElement | null;
                        const keyword = (el?.value || '').trim();
                        const params = new URLSearchParams();
                        if (keyword) params.set('q', keyword);
                        if (selectedCategory) params.set('c', selectedCategory);
                        if (selectedArea) params.set('a', selectedArea);
                        const qs = params.toString();
                        router.push(`/suppliers${qs ? `?${qs}` : ''}`);
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  </div>
                  {/* Removed separate submit button as per spec; use Enter key or icon */}
                </div>
                
                {/* Popular Search Terms */}
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['비상구', '사무용품', '모바일상품권', '마케팅', 'MKCUBE'].map((term, index) => (
                      <button
                        key={index}
                        className="inline-flex items-center px-3 py-1 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                        onClick={() => {
                          const searchInput = document.getElementById('main-search') as HTMLInputElement;
                          if (searchInput) {
                            searchInput.value = term;
                            searchInput.focus();
                          }
                        }}
                      >
                        #{term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
        </div>
        </div>
      </main>

      {/* Category Modal (MO) */}
      {isMobile && isCategoryModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsCategoryModalOpen(false)}
          />
          <div className="fixed inset-x-4 top-20 bottom-20 bg-white rounded-lg shadow-xl z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{getText('category')}</h3>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                onClick={() => setIsCategoryModalOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <button
                className={`w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg ${selectedCategory === '' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={() => { setSelectedCategory(''); setIsCategoryModalOpen(false); }}
              >
                {getText('allCategories')}
              </button>
              {l1Categories.map((c) => (
                <button
                  key={c.value}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg ${selectedCategory === c.value ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                  onClick={() => { setSelectedCategory(c.value); setIsCategoryModalOpen(false); }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Area Modal (MO) */}
      {isMobile && isAreaModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsAreaModalOpen(false)}
          />
          <div className="fixed inset-x-4 top-20 bottom-20 bg-white rounded-lg shadow-xl z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{getText('location')}</h3>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                onClick={() => setIsAreaModalOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <button
                className={`w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg ${selectedArea === '' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                onClick={() => { setSelectedArea(''); setIsAreaModalOpen(false); }}
              >
                {getText('allLocations')}
              </button>
              {l1Areas.map((a) => (
                <button
                  key={a.value}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg ${selectedArea === a.value ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                  onClick={() => { setSelectedArea(a.value); setIsAreaModalOpen(false); }}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Shared Footer */}
      <Footer currentLanguage={currentLanguage} userCountry={userCountry} />
    </div>
  );
}
