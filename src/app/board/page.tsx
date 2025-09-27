'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Paperclip, Heart, MessageCircle, Eye, Edit, ChevronDown, X } from 'lucide-react';

export default function BoardPage() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState('ko');
  const [userCountry, setUserCountry] = useState('대한민국');
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchTypeModalOpen, setIsSearchTypeModalOpen] = useState(false);
  const [isListCategoryModalOpen, setIsListCategoryModalOpen] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch user country
  useEffect(() => {
    const fetchUserCountry = async () => {
      try {
        const response = await fetch('/api/geo');
        const data = await response.json();
        const countryNames: {[key: string]: string} = {
          'KR': '대한민국',
          'US': '미국',
          'JP': '일본',
          'CN': '중국',
          'GB': '영국',
          'DE': '독일',
          'FR': '프랑스'
        };
        setUserCountry(countryNames[data.country_code] || data.country_name || '대한민국');
      } catch (error) {
        console.error('Failed to fetch user country:', error);
        setUserCountry('대한민국');
      }
    };

    fetchUserCountry();
  }, []);

  // Text translations
  const getText = (key: string) => {
    const texts = {
      ko: {
        pageTitle: '자유 토론방',
        pageDescription: '자유롭게 소통하고 정보를 나누는 공간입니다.',
        searchPlaceholder: '검색어를 입력하세요',
        searchButton: '검색',
        writeButton: '글 쓰기',
        // Search types
        searchAll: '전체',
        searchTitle: '제목',
        searchContent: '내용',
        // Categories
        categoryAll: '전체',
        categoryDaily: '일상글',
        categoryCurious: '궁금해요',
        categoryTogether: '함께해요',
        categoryInform: '알려드려요',
        categoryShare: '나눔해요',
        categoryTell: '들려줘요',
        // Post info
        author: '작성자',
        registrationDate: '등록일시',
        likes: '좋아요',
        comments: '댓글',
        views: '조회수',
        hasAttachment: '첨부파일',
        totalPosts: '총 {count}개 게시글',
        // Sample data
        post1Title: '새로운 공급사를 찾고 있어요',
        post1Content: '안녕하세요. 전자부품 관련 공급사를 찾고 있습니다. 좋은 곳 있으시면 추천 부탁드려요.',
        post2Title: '공급사 평가 기준이 궁금합니다',
        post2Content: 'TOP100에 선정되는 기준이 무엇인지 궁금해요. 어떤 요소들이 고려되나요?',
        post3Title: '함께 전시회 가실 분 계신가요?',
        post3Content: '다음 주 코엑스에서 열리는 산업전시회에 함께 가실 분 찾습니다.',
        post4Title: '새로운 결제 시스템 안내',
        post4Content: '다음 달부터 새로운 결제 시스템이 도입됩니다. 자세한 내용을 안내드립니다.',
        post5Title: '무료 샘플 나눔합니다',
        post5Content: '저희 회사에서 제작한 샘플을 무료로 나눔합니다. 관심 있으신 분 연락주세요.',
        post6Title: '성공적인 거래 후기',
        post6Content: 'SEEPN을 통해 좋은 공급사를 만나 성공적으로 거래했습니다. 경험을 공유드려요.'
      },
      en: {
        pageTitle: 'Free Discussion Board',
        pageDescription: 'A space for free communication and information sharing.',
        searchPlaceholder: 'Enter search term',
        searchButton: 'Search',
        writeButton: 'Write Post',
        // Search types
        searchAll: 'All',
        searchTitle: 'Title',
        searchContent: 'Content',
        // Categories
        categoryAll: 'All',
        categoryDaily: 'Daily',
        categoryCurious: 'Question',
        categoryTogether: 'Together',
        categoryInform: 'Information',
        categoryShare: 'Share',
        categoryTell: 'Story',
        // Post info
        author: 'Author',
        registrationDate: 'Date',
        likes: 'Likes',
        comments: 'Comments',
        views: 'Views',
        hasAttachment: 'Attachment',
        totalPosts: 'Total {count} posts',
        // Sample data
        post1Title: 'Looking for new suppliers',
        post1Content: 'Hello. I am looking for electronic component suppliers. Please recommend if you know any good ones.',
        post2Title: 'Curious about supplier evaluation criteria',
        post2Content: 'I am curious about the criteria for being selected for TOP100. What factors are considered?',
        post3Title: 'Anyone going to the exhibition together?',
        post3Content: 'Looking for someone to go to the industrial exhibition at COEX next week.',
        post4Title: 'New payment system guide',
        post4Content: 'A new payment system will be introduced next month. Here are the details.',
        post5Title: 'Free sample sharing',
        post5Content: 'We are sharing samples made by our company for free. Please contact us if interested.',
        post6Title: 'Successful transaction review',
        post6Content: 'I found a good supplier through SEEPN and had a successful transaction. Sharing my experience.'
      },
      ja: {
        pageTitle: '自由討論掲示板',
        pageDescription: '自由にコミュニケーションし、情報を共有するスペースです。',
        searchPlaceholder: '検索語を入力してください',
        searchButton: '検索',
        writeButton: '投稿する',
        // Search types
        searchAll: '全体',
        searchTitle: 'タイトル',
        searchContent: '内容',
        // Categories
        categoryAll: '全体',
        categoryDaily: '日常',
        categoryCurious: '質問',
        categoryTogether: '一緒に',
        categoryInform: 'お知らせ',
        categoryShare: 'シェア',
        categoryTell: 'ストーリー',
        // Post info
        author: '投稿者',
        registrationDate: '投稿日時',
        likes: 'いいね',
        comments: 'コメント',
        views: '閲覧数',
        hasAttachment: '添付ファイル',
        totalPosts: '合計 {count}件の投稿',
        // Sample data
        post1Title: '新しいサプライヤーを探しています',
        post1Content: 'こんにちは。電子部品関連のサプライヤーを探しています。良いところがあれば推薦お願いします。',
        post2Title: 'サプライヤー評価基準が気になります',
        post2Content: 'TOP100に選定される基準が何か気になります。どのような要素が考慮されますか？',
        post3Title: '一緒に展示会に行く方いませんか？',
        post3Content: '来週COEXで開催される産業展示会に一緒に行く方を探しています。',
        post4Title: '新しい決済システムのご案内',
        post4Content: '来月から新しい決済システムが導入されます。詳細をご案内します。',
        post5Title: '無料サンプルをシェアします',
        post5Content: '弊社で製作したサンプルを無料でシェアします。興味のある方はご連絡ください。',
        post6Title: '成功した取引レビュー',
        post6Content: 'SEEPNを通じて良いサプライヤーに出会い、成功した取引ができました。経験をシェアします。'
      },
      zh: {
        pageTitle: '自由讨论区',
        pageDescription: '自由交流和信息分享的空间。',
        searchPlaceholder: '请输入搜索词',
        searchButton: '搜索',
        writeButton: '写帖子',
        // Search types
        searchAll: '全部',
        searchTitle: '标题',
        searchContent: '内容',
        // Categories
        categoryAll: '全部',
        categoryDaily: '日常',
        categoryCurious: '疑问',
        categoryTogether: '一起',
        categoryInform: '通知',
        categoryShare: '分享',
        categoryTell: '故事',
        // Post info
        author: '作者',
        registrationDate: '发布日期',
        likes: '点赞',
        comments: '评论',
        views: '查看',
        hasAttachment: '附件',
        totalPosts: '共 {count}篇帖子',
        // Sample data
        post1Title: '寻找新的供应商',
        post1Content: '您好。我正在寻找电子元件相关的供应商。如果您知道好的地方，请推荐。',
        post2Title: '好奇供应商评价标准',
        post2Content: '我很好奇被选入TOP100的标准是什么。会考虑哪些因素？',
        post3Title: '有人一起去展览会吗？',
        post3Content: '寻找下周一起去COEX举办的产业展览会的人。',
        post4Title: '新支付系统指南',
        post4Content: '下个月将引入新的支付系统。为您介绍详细内容。',
        post5Title: '免费样品分享',
        post5Content: '我们公司制作的样品免费分享。感兴趣的请联系我们。',
        post6Title: '成功交易评价',
        post6Content: '通过SEEPN找到了好的供应商，成功进行了交易。分享我的经验。'
      }
    };
    
    return texts[currentLanguage as keyof typeof texts]?.[key as keyof typeof texts.ko] || texts.ko[key as keyof typeof texts.ko];
  };

  // Get category info
  const getCategoryInfo = (category: string) => {
    const categoryMap = {
      daily: { label: getText('categoryDaily'), color: 'bg-gray-100 text-gray-800 border-gray-200' },
      curious: { label: getText('categoryCurious'), color: 'bg-blue-100 text-blue-800 border-blue-200' },
      together: { label: getText('categoryTogether'), color: 'bg-green-100 text-green-800 border-green-200' },
      inform: { label: getText('categoryInform'), color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      share: { label: getText('categoryShare'), color: 'bg-purple-100 text-purple-800 border-purple-200' },
      tell: { label: getText('categoryTell'), color: 'bg-pink-100 text-pink-800 border-pink-200' }
    };
    
    return categoryMap[category as keyof typeof categoryMap] || categoryMap.daily;
  };

  // Format date as YYYY-MM-DD for list view
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Validate nickname format
  // const validateNickname = (nickname: string): boolean => {
  //   // Check length (1-10 characters)
  //   if (nickname.length === 0 || nickname.length > 10) {
  //     return false;
  //   }
    
  //   // Check format: Korean, English letters and numbers, must start with letter or Korean
  //   const nicknameRegex = /^[a-zA-Z가-힣][a-zA-Z0-9가-힣]*$/;
  //   return nicknameRegex.test(nickname);
  // };

  // Generate random nickname (Korean + English)
  // const generateNickname = () => {
  //   const englishChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   const koreanChars = '가나다라마바사아자차카타파하거너더러머버서어저처커터퍼허고노도로모보소오조초코토포호구누두루무부수우주추쿠투푸후';
  //   const startChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz가나다라마바사아자차카타파하';
    
  //   let nickname = '';
  //   const length = Math.floor(Math.random() * 6) + 3; // 3-8 characters (한글은 2바이트이므로 조금 짧게)
    
  //   // First character should be a letter or Korean
  //   nickname += startChars.charAt(Math.floor(Math.random() * startChars.length));
    
  //   // Remaining characters can be Korean, English letters or numbers
  //   const allChars = englishChars + koreanChars;
  //   for (let i = 1; i < length; i++) {
  //     nickname += allChars.charAt(Math.floor(Math.random() * allChars.length));
  //   }
    
  //   return nickname;
  // };

  // Sample board posts with Korean + English nicknames
  const samplePosts = [
    {
      id: 1,
      category: 'curious',
      title: getText('post1Title'),
      content: getText('post1Content'),
      author: '기술탐험가7',
      registrationDate: '2025-01-12T14:30:00',
      likes: 12,
      comments: 5,
      views: 156,
      hasAttachment: false
    },
    {
      id: 2,
      category: 'curious',
      title: getText('post2Title'),
      content: getText('post2Content'),
      author: 'NewbieMom2',
      registrationDate: '2025-01-12T11:20:00',
      likes: 8,
      comments: 3,
      views: 89,
      hasAttachment: false
    },
    {
      id: 3,
      category: 'together',
      title: getText('post3Title'),
      content: getText('post3Content'),
      author: '전시회러버',
      registrationDate: '2025-01-11T16:45:00',
      likes: 15,
      comments: 7,
      views: 203,
      hasAttachment: true
    },
    {
      id: 4,
      category: 'inform',
      title: getText('post4Title'),
      content: getText('post4Content'),
      author: 'Admin2025',
      registrationDate: '2025-01-11T09:15:00',
      likes: 25,
      comments: 12,
      views: 445,
      hasAttachment: true
    },
    {
      id: 5,
      category: 'share',
      title: getText('post5Title'),
      content: getText('post5Content'),
      author: '나눔왕1',
      registrationDate: '2025-01-10T13:30:00',
      likes: 18,
      comments: 9,
      views: 267,
      hasAttachment: false
    },
    {
      id: 6,
      category: 'tell',
      title: getText('post6Title'),
      content: getText('post6Content'),
      author: 'StoryTell9',
      registrationDate: '2025-01-10T10:20:00',
      likes: 22,
      comments: 14,
      views: 321,
      hasAttachment: false
    }
  ];

  // Filter posts based on search
  const filteredPosts = samplePosts.filter(post => {
    // Filter by category
    if (selectedCategory && post.category !== selectedCategory) {
      return false;
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      if (searchType === 'title') {
        return post.title.toLowerCase().includes(query);
      } else if (searchType === 'content') {
        return post.content.toLowerCase().includes(query);
      } else {
        return post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query);
      }
    }

    return true;
  });

  // Handle search
  const handleSearch = () => {
    // Search is handled by filteredPosts automatically
    console.log('Search:', selectedCategory, searchType, searchQuery);
  };

  // Handle write button
  const handleWrite = () => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/board/write');
      return;
    }
    router.push('/board/write');
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{getText('pageTitle')}</h1>
            <p className="text-lg text-gray-600">{getText('pageDescription')}</p>
          </div>

          {/* Search Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-2">
              {/* PC select */}
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="hidden sm:block px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">{getText('searchAll')}</option>
                <option value="title">{getText('searchTitle')}</option>
                <option value="content">{getText('searchContent')}</option>
              </select>
              {/* MO trigger */}
              <button
                type="button"
                onClick={() => setIsSearchTypeModalOpen(true)}
                className="sm:hidden w-full px-3 py-2 border border-gray-300 rounded-lg bg-white flex items-center justify-between"
              >
                <span>
                  {searchType === 'title' ? getText('searchTitle') : searchType === 'content' ? getText('searchContent') : getText('searchAll')}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={getText('searchPlaceholder')}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center"
                >
                  <Search className="h-4 w-4 mr-2" />
                  {getText('searchButton')}
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter and Write Button (PC) */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              {/* PC select */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="hidden sm:block px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">{getText('categoryAll')}</option>
                <option value="daily">{getText('categoryDaily')}</option>
                <option value="curious">{getText('categoryCurious')}</option>
                <option value="together">{getText('categoryTogether')}</option>
                <option value="inform">{getText('categoryInform')}</option>
                <option value="share">{getText('categoryShare')}</option>
                <option value="tell">{getText('categoryTell')}</option>
              </select>
              {/* MO trigger */}
              <button
                type="button"
                onClick={() => setIsListCategoryModalOpen(true)}
                className="sm:hidden flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg bg-white flex items-center justify-between"
              >
                <span className="truncate">
                  {selectedCategory === 'daily' ? getText('categoryDaily') :
                   selectedCategory === 'curious' ? getText('categoryCurious') :
                   selectedCategory === 'together' ? getText('categoryTogether') :
                   selectedCategory === 'inform' ? getText('categoryInform') :
                   selectedCategory === 'share' ? getText('categoryShare') :
                   selectedCategory === 'tell' ? getText('categoryTell') : getText('categoryAll')}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              <span className="text-sm text-gray-600 shrink-0 whitespace-nowrap">
                {getText('totalPosts').replace('{count}', filteredPosts.length.toString())}
              </span>
            </div>
            {/* PC Write Button */}
            <button
              onClick={handleWrite}
              className="hidden sm:flex px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              {getText('writeButton')}
            </button>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-gray-300 cursor-pointer transition-all">
                  {/* PC Layout */}
                  <Link href={`/board/${post.id}`} className="hidden sm:block">
                    {/* Header: Category */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getCategoryInfo(post.category).color}`}>
                        {getCategoryInfo(post.category).label}
                      </span>
                    </div>

                    {/* Title + Attachment */}
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors" 
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                        {post.title}
                      </h3>
                      {post.hasAttachment && (
                        <Paperclip className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      )}
                    </div>

                    {/* Author / Date under title */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>{post.author}</span>
                      <span>{formatDate(post.registrationDate)}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.views}</span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Mobile Layout */}
                  <Link href={`/board/${post.id}`} className="block sm:hidden">
                    {/* 1. 구분 */}
                    <div className="mb-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getCategoryInfo(post.category).color}`}>
                        {getCategoryInfo(post.category).label}
                      </span>
                    </div>

                    {/* 2. 제목 + 첨부 */}
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors" 
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                        {post.title}
                      </h3>
                      {post.hasAttachment && (
                        <Paperclip className="h-4 w-4 text-gray-400" />
                      )}
                    </div>

                    {/* 3. 닉네임 등록일 */}
                    <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
                      <span>{post.author}</span>
                      <span>{formatDate(post.registrationDate)}</span>
                    </div>

                    {/* 4. 좋아요수 댓글수 뷰수 */}
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-500">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Search Type Modal (MO) */}
      {isMobile && isSearchTypeModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsSearchTypeModalOpen(false)} />
          <div className="fixed inset-x-4 top-20 bottom-20 bg-white rounded-lg shadow-xl z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{getText('searchButton')}</h3>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg" onClick={() => setIsSearchTypeModalOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {([
                { key: 'all', label: getText('searchAll') },
                { key: 'title', label: getText('searchTitle') },
                { key: 'content', label: getText('searchContent') },
              ] as const).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => { setSearchType(opt.key); setIsSearchTypeModalOpen(false); }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg ${searchType === opt.key ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* List Category Modal (MO) */}
      {isMobile && isListCategoryModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsListCategoryModalOpen(false)} />
          <div className="fixed inset-x-4 top-20 bottom-20 bg-white rounded-lg shadow-xl z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{getText('pageTitle')}</h3>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg" onClick={() => setIsListCategoryModalOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {([
                { key: '', label: getText('categoryAll') },
                { key: 'daily', label: getText('categoryDaily') },
                { key: 'curious', label: getText('categoryCurious') },
                { key: 'together', label: getText('categoryTogether') },
                { key: 'inform', label: getText('categoryInform') },
                { key: 'share', label: getText('categoryShare') },
                { key: 'tell', label: getText('categoryTell') },
              ] as const).map((opt) => (
                <button
                  key={opt.key || 'all'}
                  onClick={() => { setSelectedCategory(opt.key); setIsListCategoryModalOpen(false); }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg ${selectedCategory === opt.key ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Mobile Floating Write Button */}
      <button
        onClick={handleWrite}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all flex items-center justify-center z-50"
      >
        <Edit className="h-6 w-6" />
      </button>

      <Footer currentLanguage={currentLanguage} userCountry={userCountry} />
    </div>
  );
}