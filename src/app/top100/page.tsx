'use client'

import React, { useMemo } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getL1Categories, getL2Categories, getL3Categories } from '../../utils/categories';
import { getL1Areas, getL2Areas } from '../../utils/areas';
import { Filter, X, Star, Heart, ExternalLink, MapPin, ThumbsUp, ChevronDown, ChevronLeft } from 'lucide-react';

export default function Top100Page() {
  const [isBannerVisible, setIsBannerVisible] = React.useState(true);
  const [currentLanguage, setCurrentLanguage] = React.useState('ko');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userCountry, setUserCountry] = React.useState('');
  // const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  // const [isMyPageOpen, setIsMyPageOpen] = React.useState(false);
  
  // Search states
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [selectedArea, setSelectedArea] = React.useState('');
  const [isMobile, setIsMobile] = React.useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = React.useState(false);
  const [modalStep, setModalStep] = React.useState<'root' | 'catL1' | 'catL2' | 'catL3' | 'areaL1' | 'areaL2'>('root');
  // Removed viewMode state - TOP100 only uses list view
  // const [favoriteSuppliers, setFavoriteSuppliers] = React.useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = React.useState<'all' | 'likes' | 'rating' | 'reviews' | 'md' | 'ai'>('all');

  // Banner data
  const banners = [
    { id: 1, image: '/api/placeholder/800/80', alt: 'Banner 1' },
    { id: 2, image: '/api/placeholder/800/80', alt: 'Banner 2' },
    { id: 3, image: '/api/placeholder/800/80', alt: 'Banner 3' }
  ];
  const [currentBannerIndex, setCurrentBannerIndex] = React.useState(0);
  const [isBannerPaused, setIsBannerPaused] = React.useState(false);
  const [isTabModalOpen, setIsTabModalOpen] = React.useState(false);

  // Get category and area data
  const l1Categories = React.useMemo(() => {
    try {
      return getL1Categories(currentLanguage);
    } catch (error) {
      console.error('Error loading L1 categories:', error);
      return [];
    }
  }, [currentLanguage]);

  const l1Areas = React.useMemo(() => {
    try {
      return getL1Areas(currentLanguage);
    } catch (error) {
      console.error('Error loading L1 areas:', error);
      return [];
    }
  }, [currentLanguage]);

  // Category depths (MO modal)
  const [selectedL1Category, setSelectedL1Category] = React.useState('');
  const [selectedL2Category, setSelectedL2Category] = React.useState('all');
  const [selectedL3Category, setSelectedL3Category] = React.useState('all');
  // const l2Categories = React.useMemo(() => {
  //   try {
  //     return selectedL1Category ? getL2Categories(selectedL1Category, currentLanguage) : [];
  //   } catch (error) {
  //     console.error('Error loading L2 categories:', error);
  //     return [];
  //   }
  // }, [selectedL1Category, currentLanguage]);
  // const l3Categories = React.useMemo(() => {
  //   try {
  //     return selectedL2Category && selectedL2Category !== 'all' ? getL3Categories(selectedL1Category, selectedL2Category, currentLanguage) : [];
  //   } catch (error) {
  //     console.error('Error loading L3 categories:', error);
  //     return [];
  //   }
  // }, [selectedL1Category, selectedL2Category, currentLanguage]);

  // Area depths (MO modal)
  const [selectedL1Area, setSelectedL1Area] = React.useState('');
  const [selectedL2Area, setSelectedL2Area] = React.useState('all');
  console.info('selectedL2Area', selectedL2Area);
  // const l2Areas = React.useMemo(() => {
  //   try {
  //     return selectedL1Area ? getL2Areas(selectedL1Area, currentLanguage) : [];
  //   } catch (error) {
  //     console.error('Error loading L2 areas:', error);
  //     return [];
  //   }
  // }, [selectedL1Area, currentLanguage]);

  // Helpers for displaying selected labels in MO modal root
  const getL1Label = React.useCallback(() => {
    if (!selectedL1Category) return '';
    return l1Categories.find((c) => c.value === selectedL1Category)?.label || '';
  }, [selectedL1Category, l1Categories]);

  // const getL2Label = React.useCallback(() => {
  //   if (!selectedL1Category || selectedL2Category === 'all') return '';
  //   return l2Categories.find((c) => c.value === selectedL2Category)?.label || '';
  // }, [selectedL1Category, selectedL2Category, l2Categories]);

  // const getL3Label = React.useCallback(() => {
  //   if (!selectedL1Category || selectedL2Category === 'all' || selectedL3Category === 'all') return '';
  //   return l3Categories.find((c) => c.value === selectedL3Category)?.label || '';
  // }, [selectedL1Category, selectedL2Category, selectedL3Category, l3Categories]);

  const getAreaL1Label = React.useCallback(() => {
    if (!selectedL1Area) return '';
    return l1Areas.find((a) => a.value === selectedL1Area)?.label || '';
  }, [selectedL1Area, l1Areas]);

  // const getAreaL2Label = React.useCallback(() => {
  //   if (!selectedL1Area || selectedL2Area === 'all') return '';
  //   return l2Areas.find((a) => a.value === selectedL2Area)?.label || '';
  // }, [selectedL1Area, selectedL2Area, l2Areas]);

  // Get user's country based on IP
  React.useEffect(() => {
    const getUserCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserCountry(data.country_name || 'Unknown');
      } catch (error) {
        console.error('Failed to get user country:', error);
        setUserCountry('Unknown');
      }
    };
    getUserCountry();
  }, []);

  // Mobile detection
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Search handlers
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      setSelectedCategory(e.target.value || '');
      setSelectedL1Category(e.target.value || '');
      setSelectedL2Category('all');
      setSelectedL3Category('all');
    } catch (error) {
      console.error('Error changing category:', error);
    }
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      setSelectedArea(e.target.value || '');
      setSelectedL1Area(e.target.value || '');
      setSelectedL2Area('all');
    } catch (error) {
      console.error('Error changing area:', error);
    }
  };

  const handleReset = () => {
    try {
      setSelectedCategory('');
      setSelectedArea('');
      setSelectedL1Category('');
      setSelectedL2Category('all');
      setSelectedL3Category('all');
      setSelectedL1Area('');
      setSelectedL2Area('all');
    } catch (error) {
      console.error('Error resetting filters:', error);
    }
  };

  const handleSearch = () => {
    try {
      // TODO: Implement search logic
      console.log('Search with:', { selectedCategory, selectedArea });
    } catch (error) {
      console.error('Error performing search:', error);
    }
  };

  // Toggle favorite supplier
  // const toggleFavorite = (supplierId: number) => {
  //   setFavoriteSuppliers(prev => {
  //     const newSet = new Set(prev);
  //     if (newSet.has(supplierId)) {
  //       newSet.delete(supplierId);
  //     } else {
  //       newSet.add(supplierId);
  //     }
  //     return newSet;
  //   });
  // };

  // Sample TOP100 suppliers data
  const sampleTop100Suppliers = useMemo(() =>[
    {
      id: 1,
      rank: 1,
      name: '(주)글로벌테크',
      category: '정보통신',
      categoryDepth3: '시스템 개발',
      location: '서울특별시 강남구',
      description: '글로벌 IT 솔루션 전문 기업으로 다양한 소프트웨어 개발 서비스를 제공합니다.',
      rating: 4.9,
      likes: 1250,
      reviews: 189,
      warnings: 0,
      aiScore: 98,
      tags: ['소프트웨어', 'IT컨설팅', '시스템개발'],
      website: 'https://www.globaltech.co.kr',
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      rank: 2,
      name: '프리미엄 제조',
      category: '생산 관리',
      categoryDepth3: '정밀 부품 제조',
      location: '경기도 수원시',
      description: '정밀 부품 제조 전문 업체로 최고 품질의 제품을 공급합니다.',
      rating: 5.0,
      likes: 980,
      reviews: 156,
      warnings: 1,
      aiScore: 92,
      tags: ['정밀부품', '제조', '품질관리'],
      website: 'https://www.premiummfg.co.kr',
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      rank: 3,
      name: '마케팅엑셀런스',
      category: '마케팅',
      categoryDepth3: '디지털 마케팅',
      location: '서울특별시 서초구',
      description: '디지털 마케팅 전문 에이전시로 브랜드 성장을 이끌어갑니다.',
      rating: 4.8,
      likes: 1800,
      reviews: 203,
      warnings: 0,
      aiScore: 94,
      tags: ['디지털마케팅', '브랜딩', 'SNS마케팅'],
      website: 'https://www.marketingexcellence.co.kr',
      image: '/api/placeholder/300/200'
    },
    {
      id: 4,
      rank: 4,
      name: '스마트로지스틱스',
      category: '물류 관리',
      categoryDepth3: '종합 물류 서비스',
      location: '인천광역시 연수구',
      description: '스마트 물류 시스템으로 최적화된 서비스를 제공하는 전문 기업입니다.',
      rating: 4.7,
      likes: 1600,
      reviews: 320,
      warnings: 2,
      aiScore: 88,
      tags: ['물류', '배송', '창고관리'],
      image: '/api/placeholder/300/200'
    },
    {
      id: 5,
      rank: 5,
      name: '그린빌딩솔루션',
      category: '건물 관리',
      categoryDepth3: '친환경 건물 관리',
      location: '부산광역시 해운대구',
      description: '친환경 건물 관리 서비스의 선두주자로 지속가능한 솔루션을 제공합니다.',
      rating: 4.95,
      likes: 720,
      reviews: 98,
      warnings: 0,
      aiScore: 96,
      tags: ['건물관리', '친환경', '시설관리'],
      website: 'https://www.greenbuilding.co.kr',
      image: '/api/placeholder/300/200'
    },
    {
      id: 6,
      rank: 6,
      name: '이노베이션오피스',
      category: '사무 보조 서비스',
      categoryDepth3: '스마트 오피스 솔루션',
      location: '대구광역시 중구',
      description: '혁신적인 스마트 오피스 솔루션과 사무 지원 서비스를 제공합니다.',
      rating: 4.5,
      likes: 640,
      reviews: 76,
      warnings: 1,
      aiScore: 86,
      tags: ['사무지원', '스마트오피스', '업무효율'],
      website: 'https://www.innovationoffice.co.kr',
      image: '/api/placeholder/300/200'
    }
  ], []);

  // Resolve selected labels for filtering
  const selectedCategoryLabel = React.useMemo(() => {
    if (!selectedCategory) return '';
    return l1Categories.find(c => c.value === selectedCategory)?.label || '';
  }, [selectedCategory, l1Categories]);
  const selectedAreaLabel = React.useMemo(() => {
    if (!selectedArea) return '';
    return l1Areas.find(a => a.value === selectedArea)?.label || '';
  }, [selectedArea, l1Areas]);

  // Apply search filters (category L1 and area L1)
  const filteredSuppliers = React.useMemo(() => {
    return sampleTop100Suppliers.filter((s) => {
      // Category filter
      if (selectedCategoryLabel) {
        const catMatch = s.category === selectedCategoryLabel || s.categoryDepth3?.toLowerCase().includes(selectedCategoryLabel.toLowerCase());
        if (!catMatch) return false;
      }
      // Area filter
      if (selectedAreaLabel) {
        const areaMatch = s.location?.toLowerCase().includes(selectedAreaLabel.toLowerCase());
        if (!areaMatch) return false;
      }
      return true;
    });
  }, [sampleTop100Suppliers, selectedCategoryLabel, selectedAreaLabel]);

  // Helpers for scoring (mock where data is unavailable)
  const getFavoritesCount = (s: { id: number }) => (s.id % 50) + 5;
  const getRecentLikes = (s: { likes: number }) => s.likes; // No date data; using likes as recent proxy
  const calculateOverallScore = (s: { rating: number; reviews: number; likes: number; id: number }) =>
    (s.rating * 0.4) + (s.reviews * 0.25) + (getRecentLikes(s) * 0.2) + (getFavoritesCount(s) * 0.15);
  const mdPicks: number[] = [3, 1, 5, 2, 4, 6]; // Admin-configurable order (sample)

  // Internationalization function
  const getText = (key: string) => {
    const translations: { [key: string]: { [key: string]: string } } = {
      ko: {
        serviceName: '공급사 검색 서비스',
        pageTitle: 'TOP 100',
        leftTitle: '검색',
        rightTitle: 'TOP 100 공급사',
        noResults: '결과가 없습니다.',
        // Search filters
        category: '품목',
        region: '지역',
        allCategories: '전체',
        allRegions: '전체',
        selectCategory: '품목을 선택하세요',
        selectRegion: '지역을 선택하세요',
        resetButton: '초기화',
        searchButton: '검색',
        // Mobile search modal
        searchFilter: '검색',
        closeFilter: '필터 닫기',
        // Results display
        resultsTitle: 'TOP 100 공급사',
        totalResults: '총 {count}개 공급사',
        viewDetail: '상세보기',
        rank: '순위',
        // Tab menu
        tabAll: '종합 TOP 100',
        tabLikes: '좋아요',
        tabRating: '별점',
        tabReviews: '리뷰',
        tabMD: 'MD 추천',
        tabAI: 'AI 추천',
        likes: '좋아요',
        reviewsCount: '리뷰',
        warnings: '경고',
        aiScore: 'AI 점수',
        // Header menu items
        home: '홈',
        suppliers: '공급사',
        top100: 'TOP100',
        board: '자유 토론방',
        banner: '배너',
        notice: '공지사항',
        faq: 'FAQ',
        inquiry: '문의하기',
        // MyPage items
        mypage: '마이페이지',
        loginPrompt: '로그인이 필요합니다',
        login: '로그인',
        logout: '로그아웃',
        editProfile: '회원정보 수정',
        changePassword: '비밀번호 변경',
        favoriteSuppliers: '관심 공급사',
        evaluatedSuppliers: '평가 공급사',
        myPosts: '등록한 게시글',
        oneOnOneInquiry: '1:1문의',
        withdrawal: '회원탈퇴',
        withdrawalConfirm: '정말로 탈퇴하시겠습니까?',
        withdrawalComplete: '회원탈퇴가 완료되었습니다.',
        // Footer
        terms: '이용약관',
        privacy: '개인정보처리방침',
        partnership: '제휴/광고문의',
        suppliersFooter: '공급사',
        copyright: '© 2025 SEEPN. All rights reserved.'
      },
      en: {
        serviceName: 'Supplier Search Service',
        pageTitle: 'TOP 100',
        leftTitle: 'Search',
        rightTitle: 'TOP 100 Suppliers',
        noResults: 'No results found.',
        // Search filters
        category: 'Category',
        region: 'Region',
        allCategories: 'All',
        allRegions: 'All',
        selectCategory: 'Select Category',
        selectRegion: 'Select Region',
        resetButton: 'Reset',
        searchButton: 'Search',
        // Mobile search modal
        searchFilter: 'Search Filter',
        closeFilter: 'Close Filter',
        // Results display
        resultsTitle: 'TOP 100 Suppliers',
        totalResults: 'Total {count} Suppliers',
        viewDetail: 'View Details',
        rank: 'Rank',
        // Tab menu
        tabAll: 'Overall TOP 100',
        tabLikes: 'Likes',
        tabRating: 'Rating',
        tabReviews: 'Reviews',
        tabMD: 'MD Picks',
        tabAI: 'AI Picks',
        likes: 'Likes',
        reviewsCount: 'Reviews',
        warnings: 'Warnings',
        aiScore: 'AI Score',
        // Header menu items
        home: 'Home',
        suppliers: 'Suppliers',
        top100: 'TOP100',
        board: 'Board',
        banner: 'Banner',
        notice: 'Notice',
        faq: 'FAQ',
        inquiry: 'Inquiry',
        // MyPage items
        mypage: 'My Page',
        loginPrompt: 'Login required',
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
        withdrawalComplete: 'Account deletion completed.',
        // Footer
        terms: 'Terms of Service',
        privacy: 'Privacy Policy',
        partnership: 'Partnership/Ad Inquiry',
        suppliersFooter: 'Suppliers',
        copyright: '© 2025 SEEPN. All rights reserved.'
      },
      ja: {
        serviceName: 'サプライヤー検索サービス',
        pageTitle: 'TOP 100',
        leftTitle: '検索',
        rightTitle: 'TOP 100 サプライヤー',
        noResults: '結果がありません。',
        // Search filters
        category: 'カテゴリー',
        region: '地域',
        allCategories: '全て',
        allRegions: '全て',
        selectCategory: 'カテゴリーを選択',
        selectRegion: '地域を選択',
        resetButton: 'リセット',
        searchButton: '検索',
        // Mobile search modal
        searchFilter: '検索フィルター',
        closeFilter: 'フィルターを閉じる',
        // Results display
        resultsTitle: 'TOP 100 サプライヤー',
        totalResults: '合計 {count} サプライヤー',
        viewDetail: '詳細を見る',
        rank: 'ランク',
        // Tab menu
        tabAll: '総合 TOP 100',
        tabLikes: 'いいね',
        tabRating: '評価',
        tabReviews: 'レビュー',
        tabMD: 'MDおすすめ',
        tabAI: 'AIおすすめ',
        likes: 'いいね',
        reviewsCount: 'レビュー',
        warnings: '警告',
        aiScore: 'AIスコア',
        // Header menu items
        home: 'ホーム',
        suppliers: 'サプライヤー',
        top100: 'TOP100',
        board: '掲示板',
        banner: 'バナー',
        notice: 'お知らせ',
        faq: 'FAQ',
        inquiry: 'お問い合わせ',
        // MyPage items
        mypage: 'マイページ',
        loginPrompt: 'ログインが必要です',
        login: 'ログイン',
        logout: 'ログアウト',
        editProfile: '会員情報修正',
        changePassword: 'パスワード変更',
        favoriteSuppliers: 'お気に入りサプライヤー',
        evaluatedSuppliers: '評価済みサプライヤー',
        myPosts: '登録した投稿',
        oneOnOneInquiry: '1:1お問い合わせ',
        withdrawal: '退会',
        withdrawalConfirm: '本当に退会しますか？',
        withdrawalComplete: '退会が完了しました。',
        // Footer
        terms: '利用規約',
        privacy: 'プライバシーポリシー',
        partnership: '提携/広告お問い合わせ',
        suppliersFooter: 'サプライヤー',
        copyright: '© 2025 SEEPN. All rights reserved.'
      },
      zh: {
        serviceName: '供应商搜索服务',
        pageTitle: 'TOP 100',
        leftTitle: '搜索',
        rightTitle: 'TOP 100 供应商',
        noResults: '没有结果。',
        // Search filters
        category: '品类',
        region: '地区',
        allCategories: '全部',
        allRegions: '全部',
        selectCategory: '选择品类',
        selectRegion: '选择地区',
        resetButton: '重置',
        searchButton: '搜索',
        // Mobile search modal
        searchFilter: '搜索筛选',
        closeFilter: '关闭筛选',
        // Results display
        resultsTitle: 'TOP 100 供应商',
        totalResults: '共 {count} 个供应商',
        viewDetail: '查看详情',
        rank: '排名',
        // Tab menu
        tabAll: '综合 TOP 100',
        tabLikes: '点赞',
        tabRating: '评分',
        tabReviews: '评论',
        tabMD: 'MD 推荐',
        tabAI: 'AI 推荐',
        likes: '点赞',
        reviewsCount: '评论',
        warnings: '警告',
        aiScore: 'AI得分',
        // Header menu items
        home: '首页',
        suppliers: '供应商',
        top100: 'TOP100',
        board: '公告板',
        banner: '横幅',
        notice: '公告',
        faq: 'FAQ',
        inquiry: '咨询',
        // MyPage items
        mypage: '我的页面',
        loginPrompt: '需要登录',
        login: '登录',
        logout: '退出',
        editProfile: '修改会员信息',
        changePassword: '修改密码',
        favoriteSuppliers: '关注的供应商',
        evaluatedSuppliers: '评价的供应商',
        myPosts: '我的帖子',
        oneOnOneInquiry: '1:1咨询',
        withdrawal: '注销账户',
        withdrawalConfirm: '确定要注销账户吗？',
        withdrawalComplete: '账户注销完成。',
        // Footer
        terms: '使用条款',
        privacy: '隐私政策',
        partnership: '合作/广告咨询',
        suppliersFooter: '供应商',
        copyright: '© 2025 SEEPN. All rights reserved.'
      }
    };
    return translations[currentLanguage]?.[key] || key;
  };

  // Sort suppliers based on active tab (after filtering)
  const sortedSuppliers = React.useMemo(() => {
    const suppliers = [...filteredSuppliers];
    
    switch (activeTab) {
      case 'likes':
        // 좋아요: 최근 3개월치 반영 (데이터 부재로 likes 사용)
        return suppliers.sort((a, b) => getRecentLikes(b) - getRecentLikes(a));
      case 'rating':
        // 별점: 평균 + 리뷰수 보정 (리뷰 5건 미만은 제외)
        return suppliers
          .filter((s) => s.reviews >= 5)
          .sort((a, b) => (b.rating + b.reviews * 0.01) - (a.rating + a.reviews * 0.01));
      case 'reviews':
        // 리뷰: 총 수 + 최신 리뷰 가중치 (데이터 부재로 reviews만 사용)
        return suppliers.sort((a, b) => b.reviews - a.reviews);
      case 'md':
        // MD 추천: 운영자 설정 순서 우선 (없는 항목은 뒤에)
        const indexOf = (id: number) => {
          const idx = mdPicks.indexOf(id);
          return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
        };
        return suppliers.sort((a, b) => indexOf(a.id) - indexOf(b.id));
      case 'ai':
        // AI 추천: 개인화 데이터 부재로 임시 점수 (rating*10 + likes*0.02)
        return suppliers.sort((a, b) => (b.rating * 10 + b.likes * 0.02) - (a.rating * 10 + a.likes * 0.02));
      case 'all':
      default:
        // 종합 TOP100: (별점×0.4) + (리뷰수×0.25) + (좋아요수×0.2) + (관심수×0.15)
        return suppliers.sort((a, b) => calculateOverallScore(b) - calculateOverallScore(a));
    }
  }, [activeTab, filteredSuppliers, mdPicks, calculateOverallScore]);

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
      {/* Main Content */}
      <main className="flex-1" style={{ paddingTop: isBannerVisible ? '112px' : '64px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{getText('pageTitle')}</h1>
          </div>

          {/* Content Layout: Left (30%) + Right (70%) on PC, Full width on Mobile */}
          <div className="flex gap-8">
            {/* Left Area - Search Section (30%) - Hidden on Mobile */}
            <div className="hidden md:block w-[30%]">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">{getText('leftTitle')}</h2>
            
                {/* Search Form */}
                <div className="space-y-4">
                  {/* Category Select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getText('category')}
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">{getText('allCategories')}</option>
                      {l1Categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Area Select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getText('region')}
                    </label>
                    <select
                      value={selectedArea}
                      onChange={handleAreaChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">{getText('allRegions')}</option>
                      {l1Areas.map((area) => (
                        <option key={area.value} value={area.value}>
                          {area.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={handleReset}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      {getText('resetButton')}
                    </button>
                    <button
                      onClick={handleSearch}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      {getText('searchButton')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          
            {/* Right Area - Content Section (70%) */}
            <div className="w-full md:w-[70%]">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">{getText('resultsTitle')}</h2>
                </div>

                {/* Tab Menu */}
                <div className="mb-6">
                  {/* PC Tab Menu */}
                  <div className="hidden md:block border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                      {[
                        { key: 'all', label: getText('tabAll') },
                        { key: 'likes', label: getText('tabLikes') },
                        { key: 'rating', label: getText('tabRating') },
                        { key: 'reviews', label: getText('tabReviews') },
                        { key: 'md', label: getText('tabMD') },
                        { key: 'ai', label: getText('tabAI') }
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key as typeof activeTab)}
                          className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === tab.key
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>
                  
                  {/* Mobile Tab Menu as layer popup trigger */}
                  <div className="block md:hidden">
                    <button
                      type="button"
                      onClick={() => setIsTabModalOpen(true)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white flex items-center justify-between"
                    >
                      <span>
                        {(
                          [
                            { key: 'all', label: getText('tabAll') },
                            { key: 'likes', label: getText('tabLikes') },
                            { key: 'rating', label: getText('tabRating') },
                            { key: 'reviews', label: getText('tabReviews') },
                            { key: 'md', label: getText('tabMD') },
                            { key: 'ai', label: getText('tabAI') }
                          ] as const
                        ).find(t => t.key === activeTab)?.label}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                {/* Mobile Tab Selection Modal */}
                {isMobile && isTabModalOpen && (
                  <>
                    <div
                      className="fixed inset-0 bg-black bg-opacity-50 z-50"
                      onClick={() => setIsTabModalOpen(false)}
                    />
                    <div className="fixed inset-x-4 top-28 bottom-28 bg-white rounded-lg shadow-xl z-50 flex flex-col">
                      <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">정렬 기준</h3>
                        <button
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                          onClick={() => setIsTabModalOpen(false)}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {([
                          { key: 'all', label: getText('tabAll') },
                          { key: 'likes', label: getText('tabLikes') },
                          { key: 'rating', label: getText('tabRating') },
                          { key: 'reviews', label: getText('tabReviews') },
                          { key: 'md', label: getText('tabMD') },
                          { key: 'ai', label: getText('tabAI') }
                        ] as const).map((tab) => (
                          <button
                            key={tab.key}
                            onClick={() => {
                              setActiveTab(tab.key as typeof activeTab);
                              setIsTabModalOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg ${
                              activeTab === tab.key ? 'text-blue-600 font-medium' : 'text-gray-700'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Results Content - List View Only */}
                {sortedSuppliers.length > 0 ? (
                  <div className="space-y-4">
                    {sortedSuppliers.map((supplier) => (
                      <div key={supplier.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          {/* Company Icon - PC Only */}
                          <div className="hidden md:flex w-16 h-16 bg-gray-200 rounded-lg items-center justify-center flex-shrink-0">
                            <div className="text-gray-400 text-2xl">🏢</div>
                          </div>
                          
                          {/* Company Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2 flex-1">
                                <h3 className="font-semibold text-gray-900 text-lg truncate">{supplier.name}</h3>
                                {supplier.website && (
                                  <a
                                    href={supplier.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                    title="홈페이지 방문"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                )}
                              </div>
                            <div className="flex items-center gap-2 ml-4" />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                              <div className="flex items-center text-sm text-gray-600">
                                {supplier.categoryDepth3}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mr-2" />
                                {supplier.location}
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {supplier.description}
                            </p>
                            
                            {/* Tags (match suppliers page position) */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {supplier.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* Stats above detail button: rating, favorites, likes */}
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1 text-yellow-600">
                                <Star className="h-4 w-4 fill-current" />
                                <span>{supplier.rating}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4 text-red-500" />
                                <span>{(supplier.id % 50) + 5}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4 text-blue-500" />
                                <span>{supplier.likes}</span>
                              </div>
                            </div>
                            
                            {/* Detail Button */}
                            <div className="flex justify-end">
                              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                                {getText('viewDetail')}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">검색한 공급사가 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Floating Search Button */}
      {isMobile && (
        <button
          onClick={() => { setModalStep('root'); setIsSearchModalOpen(true); }}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors z-40"
        >
          <Filter className="h-6 w-6" />
        </button>
      )}

      {/* Mobile Search Modal */}
      {isSearchModalOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => { setIsSearchModalOpen(false); setModalStep('root'); }}
          />
          
          {/* Modal */}
          <div className="fixed inset-x-4 top-20 bottom-20 bg-white rounded-lg shadow-xl z-50 flex flex-col">
            {/* Modal Header (with back on steps) */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              {modalStep !== 'root' ? (
                <button onClick={() => setModalStep('root')} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg" aria-label="back">
                  <ChevronLeft className="h-5 w-5" />
                </button>
              ) : (
                <div className="w-9" />
              )}
              <h2 className="text-lg font-semibold text-gray-900 flex-1 text-center">{getText('searchFilter')}</h2>
              <button onClick={() => { setIsSearchModalOpen(false); setModalStep('root'); }} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg" aria-label="close">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {modalStep === 'root' && (
                <div className="p-4 space-y-4">
                  {/* Category trigger (L1 only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{getText('category')}</label>
                    <div className="grid grid-cols-1 gap-2">
                      <button type="button" onClick={() => setModalStep('catL1')} className="relative w-full px-3 py-3 border border-gray-300 rounded-lg text-left text-gray-700 bg-white flex items-center justify-between">
                        <span className="truncate">{getL1Label() || getText('allCategories')}</span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  {/* Region trigger (L1 only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{getText('region')}</label>
                    <div className="grid grid-cols-1 gap-2">
                      <button type="button" onClick={() => setModalStep('areaL1')} className="relative w-full px-3 py-3 border border-gray-300 rounded-lg text-left text-gray-700 bg-white flex items-center justify-between">
                        <span className="truncate">{getAreaL1Label() || getText('allRegions')}</span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Category steps */}
              {modalStep === 'catL1' && (
                <div className="p-4 space-y-2">
                  <button className={`w-full text-left py-2 px-3 hover:bg-gray-100 rounded-lg ${selectedL1Category === '' ? 'text-blue-600 font-medium' : 'text-gray-700'}`} onClick={() => { setSelectedL1Category(''); setSelectedCategory(''); setSelectedL2Category('all'); setSelectedL3Category('all'); setModalStep('root'); }}>{getText('allCategories')}</button>
                  {l1Categories.map((c) => (
                    <button key={c.value} className={`w-full text-left py-2 px-3 hover:bg-gray-100 rounded-lg ${selectedL1Category === c.value ? 'text-blue-600 font-medium' : 'text-gray-700'}`} onClick={() => { setSelectedL1Category(c.value); setSelectedCategory(c.value); setSelectedL2Category('all'); setSelectedL3Category('all'); setModalStep('root'); }}>{c.label}</button>
                  ))}
                </div>
              )}
              {/* Area steps */}
              {modalStep === 'areaL1' && (
                <div className="p-4 space-y-2">
                  <button className={`w-full text-left py-2 px-3 hover:bg-gray-100 rounded-lg ${selectedL1Area === '' ? 'text-blue-600 font-medium' : 'text-gray-700'}`} onClick={() => { setSelectedL1Area(''); setSelectedArea(''); setSelectedL2Area('all'); setModalStep('root'); }}>{getText('allRegions')}</button>
                  {l1Areas.map((a) => (
                    <button key={a.value} className={`w-full text-left py-2 px-3 hover:bg-gray-100 rounded-lg ${selectedL1Area === a.value ? 'text-blue-600 font-medium' : 'text-gray-700'}`} onClick={() => { setSelectedL1Area(a.value); setSelectedArea(a.value); setSelectedL2Area('all'); setModalStep('root'); }}>{a.label}</button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Modal Footer (root only) */}
            {modalStep === 'root' && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <button onClick={handleReset} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors">{getText('resetButton')}</button>
                  <button onClick={() => setIsSearchModalOpen(false)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">{getText('searchButton')}</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      
      <Footer userCountry={userCountry} currentLanguage={''} />
    </div>
  );
}