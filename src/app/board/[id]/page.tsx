'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, Paperclip, Heart, MessageCircle, Eye, Edit, Trash2, Send } from 'lucide-react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase/client';

export default function BoardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = parseInt(params.id as string);
  
  const [currentLanguage, setCurrentLanguage] = useState('ko');
  const [userCountry, setUserCountry] = useState('대한민국');
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentUserId] = useState(1); // 현재 로그인한 사용자 ID (예시)
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  // Firebase authentication check
  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const wasLoggedIn = isLoggedIn;
      const isNowLoggedIn = !!user;
      
      setIsLoggedIn(isNowLoggedIn);
      setAuthChecked(true);
      
      // 로그아웃 감지: 이전에 로그인되어 있었는데 지금 로그아웃된 경우
      if (wasLoggedIn && !isNowLoggedIn && authChecked) {
        console.log('User logged out, redirecting to login page');
        router.push('/login');
      }
    });
    
    return () => unsubscribe();
  }, [isLoggedIn, authChecked, router]);

  // Mobile detection
  useEffect(() => {
    console.log('isMobile', isMobile);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]);

  // Fetch user country
  useEffect(() => {
    const fetchUserCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
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
        backToList: '목록으로',
        edit: '수정',
        delete: '삭제',
        like: '좋아요',
        comments: '댓글',
        views: '조회수',
        attachments: '첨부파일',
        commentPlaceholder: '댓글을 입력하세요 (최대 200자)',
        writeComment: '댓글 작성',
        editComment: '댓글 수정',
        cancel: '취소',
        save: '저장',
        deleteConfirm: '정말 삭제하시겠습니까?',
        // Categories
        categoryDaily: '일상글',
        categoryCurious: '궁금해요',
        categoryTogether: '함께해요',
        categoryInform: '알려드려요',
        categoryShare: '나눔해요',
        categoryTell: '들려줘요',
        // Sample content
        post1Title: '새로운 공급사를 찾고 있어요',
        post1Content: '안녕하세요. 전자부품 관련 공급사를 찾고 있습니다.\n\n현재 저희 회사에서는 다음과 같은 부품들이 필요합니다:\n- 저항 (1kΩ, 10kΩ)\n- 캐패시터 (100μF, 470μF)\n- LED (빨강, 파랑, 초록)\n\n품질이 좋고 가격이 합리적인 곳이 있다면 추천 부탁드립니다.\n감사합니다.',
        comment1: '저희 회사에서 거래하는 곳이 있는데 품질 괜찮습니다. 개인 메시지로 연락드릴게요.',
        comment2: 'A업체 추천드려요. 가격도 저렴하고 배송도 빨라요.',
        comment3: '전자부품 전문 업체 리스트 공유드릴 수 있어요. 필요하시면 댓글 남겨주세요.'
      },
      en: {
        backToList: 'Back to List',
        edit: 'Edit',
        delete: 'Delete',
        like: 'Like',
        comments: 'Comments',
        views: 'Views',
        attachments: 'Attachments',
        commentPlaceholder: 'Write a comment (max 200 characters)',
        writeComment: 'Write Comment',
        editComment: 'Edit Comment',
        cancel: 'Cancel',
        save: 'Save',
        deleteConfirm: 'Are you sure you want to delete?',
        // Categories
        categoryDaily: 'Daily',
        categoryCurious: 'Question',
        categoryTogether: 'Together',
        categoryInform: 'Information',
        categoryShare: 'Share',
        categoryTell: 'Story',
        // Sample content
        post1Title: 'Looking for new suppliers',
        post1Content: 'Hello. I am looking for electronic component suppliers.\n\nWe currently need the following parts:\n- Resistors (1kΩ, 10kΩ)\n- Capacitors (100μF, 470μF)\n- LEDs (red, blue, green)\n\nPlease recommend if you know places with good quality and reasonable prices.\nThank you.',
        comment1: 'We have a supplier that we deal with and the quality is good. I will contact you via private message.',
        comment2: 'I recommend Company A. The price is cheap and delivery is fast.',
        comment3: 'I can share a list of electronic component specialists. Please leave a comment if you need it.'
      },
      ja: {
        backToList: 'リストに戻る',
        edit: '編集',
        delete: '削除',
        like: 'いいね',
        comments: 'コメント',
        views: '閲覧数',
        attachments: '添付ファイル',
        commentPlaceholder: 'コメントを入力してください（最大200文字）',
        writeComment: 'コメント作成',
        editComment: 'コメント編集',
        cancel: 'キャンセル',
        save: '保存',
        deleteConfirm: '本当に削除しますか？',
        // Categories
        categoryDaily: '日常',
        categoryCurious: '質問',
        categoryTogether: '一緒に',
        categoryInform: 'お知らせ',
        categoryShare: 'シェア',
        categoryTell: 'ストーリー',
        // Sample content
        post1Title: '新しいサプライヤーを探しています',
        post1Content: 'こんにちは。電子部品関連のサプライヤーを探しています。\n\n現在、以下の部品が必要です：\n- 抵抗器（1kΩ、10kΩ）\n- コンデンサ（100μF、470μF）\n- LED（赤、青、緑）\n\n品質が良く価格が合理的な場所があれば推薦お願いします。\nありがとうございます。',
        comment1: '弊社で取引している所がありますが、品質は良いです。個人メッセージで連絡します。',
        comment2: 'A会社をお勧めします。価格も安くて配送も早いです。',
        comment3: '電子部品専門業者のリストを共有できます。必要でしたらコメントを残してください。'
      },
      zh: {
        backToList: '返回列表',
        edit: '编辑',
        delete: '删除',
        like: '点赞',
        comments: '评论',
        views: '查看',
        attachments: '附件',
        commentPlaceholder: '请输入评论（最多200字）',
        writeComment: '写评论',
        editComment: '编辑评论',
        cancel: '取消',
        save: '保存',
        deleteConfirm: '确定要删除吗？',
        // Categories
        categoryDaily: '日常',
        categoryCurious: '疑问',
        categoryTogether: '一起',
        categoryInform: '通知',
        categoryShare: '分享',
        categoryTell: '故事',
        // Sample content
        post1Title: '寻找新的供应商',
        post1Content: '您好。我正在寻找电子元件相关的供应商。\n\n目前我们需要以下零件：\n- 电阻器（1kΩ、10kΩ）\n- 电容器（100μF、470μF）\n- LED（红色、蓝色、绿色）\n\n如果您知道质量好价格合理的地方，请推荐。\n谢谢。',
        comment1: '我们公司有合作的地方，质量不错。我会私信联系您。',
        comment2: '推荐A公司。价格便宜，配送也快。',
        comment3: '可以分享电子元件专业公司列表。如需要请留言。'
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

  // Format date: YYYY-MM-DD hh:mm:ss
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
  };

  // Sample post data (in real app, this would come from API)
  const post = {
    id: postId,
    category: 'curious',
    title: getText('post1Title'),
    content: getText('post1Content'),
    author: '기술탐험가7',
    authorId: 1,
    registrationDate: '2025-01-12T14:30:00',
    likes: 15,
    comments: 3,
    views: 167,
    hasAttachment: true,
    attachments: [
      { name: 'parts_list.xlsx', size: '2.3MB' },
      { name: 'reference_image.jpg', size: '1.1MB' }
    ]
  };

  // Sample comments data with replies
  const [comments, setComments] = useState([
    {
      id: 1,
      content: getText('comment1'),
      author: 'PartsPro2',
      authorId: 2,
      registrationDate: '2025-01-12T15:45:00',
      replies: [
        {
          id: 101,
          content: '감사합니다! 연락 기다리겠습니다.',
          author: '기술탐험가7',
          authorId: 1,
          registrationDate: '2025-01-12T16:00:00',
          parentId: 1
        }
      ]
    },
    {
      id: 2,
      content: getText('comment2'),
      author: '공급사마스터',
      authorId: 3,
      registrationDate: '2025-01-12T16:20:00',
      replies: []
    },
    {
      id: 3,
      content: getText('comment3'),
      author: 'ElectroHelper',
      authorId: 1, // Same as current user
      registrationDate: '2025-01-12T17:10:00',
      replies: []
    }
  ]);

  // Initialize like status
  useEffect(() => {
    setLikeCount(post.likes);
    // In real app, check if current user liked this post
    setIsLiked(false);
  }, [post.likes]);

  // Handle like toggle
  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
    }
  };

  // Handle post edit
  const handleEdit = () => {
    // Navigate to edit page
    router.push(`/board/${postId}/edit`);
  };

  // Handle post delete
  const handleDelete = () => {
    if (confirm(getText('deleteConfirm'))) {
      // Delete post logic
      console.log('Delete post:', postId);
      router.push('/board');
    }
  };

  // Handle comment submit
  const handleCommentSubmit = () => {
    if (newComment.trim() && newComment.length <= 200) {
      const comment = {
        id: Date.now(),
        content: newComment,
        author: '기술탐험가7', // Current user nickname
        authorId: currentUserId,
        registrationDate: new Date().toISOString(),
        replies: []
      };
      setComments(prev => [...prev, comment]);
      setNewComment('');
    }
  };

  // Handle comment edit
  const handleCommentEdit = (commentId: number) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      setEditingCommentId(commentId);
      setEditingCommentText(comment.content);
    }
  };

  // Handle comment edit save
  const handleCommentEditSave = () => {
    if (editingCommentText.trim() && editingCommentText.length <= 200) {
      setComments(prev => prev.map(comment => 
        comment.id === editingCommentId 
          ? { ...comment, content: editingCommentText }
          : comment
      ));
      setEditingCommentId(null);
      setEditingCommentText('');
    }
  };

  // Handle comment delete
  const handleCommentDelete = (commentId: number) => {
    if (confirm(getText('deleteConfirm'))) {
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    }
  };

  // Handle reply start
  const handleReplyStart = (commentId: number) => {
    setReplyingToCommentId(commentId);
    setReplyText('');
  };

  // Handle reply cancel
  const handleReplyCancel = () => {
    setReplyingToCommentId(null);
    setReplyText('');
  };

  // Handle reply submit
  const handleReplySubmit = (parentCommentId: number) => {
    if (replyText.trim() && replyText.length <= 200) {
      const reply = {
        id: Date.now(),
        content: replyText,
        author: '기술탐험가7', // Current user nickname
        authorId: currentUserId,
        registrationDate: new Date().toISOString(),
        parentId: parentCommentId
      };
      
      setComments(prev => prev.map(comment => 
        comment.id === parentCommentId 
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      ));
      
      setReplyingToCommentId(null);
      setReplyText('');
    }
  };

  // Handle reply delete
  const handleReplyDelete = (parentCommentId: number, replyId: number) => {
    if (confirm(getText('deleteConfirm'))) {
      setComments(prev => prev.map(comment => 
        comment.id === parentCommentId 
          ? { ...comment, replies: comment.replies.filter(reply => reply.id !== replyId) }
          : comment
      ));
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/board')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {getText('backToList')}
            </button>
          </div>

          {/* Post Detail */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 mb-8">
            {/* Category */}
            <div className="mb-4">
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getCategoryInfo(post.category).color}`}>
                {getCategoryInfo(post.category).label}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="font-medium">{post.author}</span>
                <span>{formatDate(post.registrationDate)}</span>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1 transition-colors ${
                    isLiked ? 'text-red-500' : 'hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{likeCount}</span>
                </button>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{comments.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views}</span>
                </div>
              </div>
            </div>

            {/* Attachments */}
            {post.hasAttachment && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{getText('attachments')}</h3>
                <div className="space-y-2">
                  {post.attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Paperclip className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">({file.size})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="prose max-w-none mb-8">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </div>
            </div>

            {/* Action Buttons */}
            {post.authorId === currentUserId && (
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  {getText('delete')}
                </button>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  {getText('edit')}
                </button>
              </div>
            )}
          </div>

          {/* Comment Input */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={getText('commentPlaceholder')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                maxLength={200}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">{newComment.length}/200</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewComment('')}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {getText('cancel')}
                  </button>
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!newComment.trim() || newComment.length > 200}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    {getText('writeComment')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {getText('comments')} ({comments.reduce((total, comment) => total + 1 + comment.replies.length, 0)})
            </h3>
            
            {comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    {/* Main Comment */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        {editingCommentId === comment.id ? (
                          <div>
                            <textarea
                              value={editingCommentText}
                              onChange={(e) => setEditingCommentText(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              rows={2}
                              maxLength={200}
                            />
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500">{editingCommentText.length}/200</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingCommentId(null);
                                    setEditingCommentText('');
                                  }}
                                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                  {getText('cancel')}
                                </button>
                                <button
                                  onClick={handleCommentEditSave}
                                  disabled={!editingCommentText.trim() || editingCommentText.length > 200}
                                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
                                >
                                  {getText('save')}
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-700 mb-2">{comment.content}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="font-medium">{comment.author}</span>
                              <span>{formatDate(comment.registrationDate)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {editingCommentId !== comment.id && (
                        <div className="flex gap-2">
                          {comment.authorId === currentUserId ? (
                            <>
                              <button
                                onClick={() => handleCommentEdit(comment.id)}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleCommentDelete(comment.id)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleReplyStart(comment.id)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Reply Input */}
                    {replyingToCommentId === comment.id && (
                      <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-200">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={getText('commentPlaceholder')}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={2}
                          maxLength={200}
                        />
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">{replyText.length}/200</span>
                          <div className="flex gap-2">
                            <button
                              onClick={handleReplyCancel}
                              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              {getText('cancel')}
                            </button>
                            <button
                              onClick={() => handleReplySubmit(comment.id)}
                              disabled={!replyText.trim() || replyText.length > 200}
                              className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                              <Send className="h-3 w-3" />
                              {getText('writeComment')}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-200 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <p className="text-gray-700 mb-2">{reply.content}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="font-medium">{reply.author}</span>
                                <span>{formatDate(reply.registrationDate)}</span>
                              </div>
                            </div>
                            
                            {reply.authorId === currentUserId && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleReplyDelete(comment.id, reply.id)}
                                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">아직 댓글이 없습니다.</p>
            )}
          </div>
        </div>
      </main>

      <Footer currentLanguage={currentLanguage} userCountry={userCountry} />
    </div>
  );
}