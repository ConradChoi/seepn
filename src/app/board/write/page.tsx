'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, Upload, X, Bold, Italic, Underline, List, ListOrdered, Link2, ChevronDown } from 'lucide-react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase/client';
// import { getStorage, ref as storageRefFn, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestoreClient } from '@/lib/firebase/client';

type PostCategory = 'daily' | 'curious' | 'together' | 'inform' | 'share' | 'tell';

export default function BoardWritePage() {
  const router = useRouter();

  // Language and UI states
  const [currentLanguage, setCurrentLanguage] = useState('ko');
  const [userCountry, setUserCountry] = useState('KR');
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  // Form states
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('daily');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Array<{name: string, size: string, file?: File}>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Editor states
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  // File constraints
  const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20MB
  const ALLOWED_EXTS = ['pdf', 'hwp', 'hwpx', 'jpg', 'jpeg', 'gif', 'png'];
  const ALLOWED_MIME_REGEXES = [
    /^image\/(jpeg|jpg|png|gif)$/i,
    /^application\/pdf$/i,
    // Some browsers don't set specific HWP/HWXP mime types reliably -> validate by extension as fallback
  ];

  const getFileExt = (name: string) => (name.includes('.') ? name.split('.').pop()?.toLowerCase() || '' : '');
  const isAllowedFile = (file: File): { ok: boolean; reason?: string } => {
    if (file.size > MAX_FILE_BYTES) return { ok: false, reason: '파일 크기는 최대 20MB 까지 가능합니다.' };
    const ext = getFileExt(file.name);
    const mimeOk = ALLOWED_MIME_REGEXES.some((r) => r.test(file.type));
    const extOk = ALLOWED_EXTS.includes(ext);
    if (!(mimeOk || extOk)) return { ok: false, reason: '허용되지 않은 파일 형식입니다. (pdf, hwp, hwpx, jpg, jpeg, gif, png)' };
    return { ok: true };
  };

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync auth state and guard after check
  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(firebaseApp), (user) => {
      setIsLoggedIn(!!user);
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (authChecked && !isLoggedIn) {
      router.replace('/login?redirect=/board/write');
    }
  }, [authChecked, isLoggedIn, router]);

  // Fetch user country
  useEffect(() => {
    const fetchUserCountry = async () => {
      try {
        const response = await fetch('/api/geo');
        const data = await response.json();
        setUserCountry(data.country_name || 'Unknown');
      } catch (error) {
        console.error('Failed to fetch user country:', error);
        setUserCountry('Unknown');
      }
    };

    fetchUserCountry();
  }, []);

  // Translations
  const getText = (key: string) => {
    const translations = {
      ko: {
        writePost: '글쓰기',
        backToList: '목록으로',
        category: '구분',
        title: '제목',
        content: '내용',
        attachments: '첨부파일',
        cancel: '취소',
        register: '등록',
        registering: '등록 중...',
        titlePlaceholder: '제목을 입력하세요',
        contentPlaceholder: '내용을 입력하세요',
        fileUploadText: '파일을 드래그하거나 클릭하여 업로드하세요',
        categoryDaily: '일상글',
        categoryCurious: '궁금해요',
        categoryTogether: '함께해요',
        categoryInform: '알려드려요',
        categoryShare: '나눔해요',
        categoryTell: '들려줘요',
      },
      en: {
        writePost: 'Write Post',
        backToList: 'Back to List',
        category: 'Category',
        title: 'Title',
        content: 'Content',
        attachments: 'Attachments',
        cancel: 'Cancel',
        register: 'Register',
        registering: 'Registering...',
        titlePlaceholder: 'Enter title',
        contentPlaceholder: 'Enter content',
        fileUploadText: 'Drag files here or click to upload',
        categoryDaily: 'Daily',
        categoryCurious: 'Curious',
        categoryTogether: 'Together',
        categoryInform: 'Inform',
        categoryShare: 'Share',
        categoryTell: 'Tell',
      },
      ja: {
        writePost: '投稿作成',
        backToList: 'リストに戻る',
        category: 'カテゴリー',
        title: 'タイトル',
        content: '内容',
        attachments: '添付ファイル',
        cancel: 'キャンセル',
        register: '登録',
        registering: '登録中...',
        titlePlaceholder: 'タイトルを入力してください',
        contentPlaceholder: '内容を入力してください',
        fileUploadText: 'ファイルをドラッグするかクリックしてアップロード',
        categoryDaily: '日常',
        categoryCurious: '質問',
        categoryTogether: '一緒に',
        categoryInform: 'お知らせ',
        categoryShare: 'シェア',
        categoryTell: '教えて',
      },
      zh: {
        writePost: '写帖子',
        backToList: '返回列表',
        category: '分类',
        title: '标题',
        content: '内容',
        attachments: '附件',
        cancel: '取消',
        register: '注册',
        registering: '注册中...',
        titlePlaceholder: '请输入标题',
        contentPlaceholder: '请输入内容',
        fileUploadText: '拖拽文件或点击上传',
        categoryDaily: '日常',
        categoryCurious: '疑问',
        categoryTogether: '一起',
        categoryInform: '通知',
        categoryShare: '分享',
        categoryTell: '告诉',
      }
    };

    return translations[currentLanguage as keyof typeof translations]?.[key as keyof typeof translations.ko] || key;
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const allowed = isAllowedFile(file);
      if (!allowed.ok) {
        alert(`${file.name}: ${allowed.reason}`);
        return;
      }
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      const newAttachment = {
        name: file.name,
        size: `${sizeInMB}MB`,
        file: file
      };
      
      setAttachments(prev => [...prev, newAttachment]);
    });
    
    // Reset input
    e.target.value = '';
  };

  // Handle file drag and drop
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    
    if (files.length > 0) {
      files.forEach(file => {
        const allowed = isAllowedFile(file);
        if (!allowed.ok) {
          alert(`${file.name}: ${allowed.reason}`);
          return;
        }
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
        const newAttachment = {
          name: file.name,
          size: `${sizeInMB}MB`,
          file: file
        };
        
        setAttachments(prev => [...prev, newAttachment]);
      });
    }
  };

  // Handle file remove
  const handleFileRemove = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Editor functions
  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleEditorInput = () => {
    if (isComposing) return;
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleEditorFocus = () => {
    setIsEditorFocused(true);
  };

  const handleEditorBlur = () => {
    setIsEditorFocused(false);
  };

  // Let browser handle Enter/Shift+Enter naturally to reduce surprises

  // Update editor when content changes externally (avoid caret reset on every input)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  // Handle cancel
  const handleCancel = () => {
    router.push('/board');
  };

  // Handle register
  const handleRegister = async () => {
    // Get plain text content for validation
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const plainTextContent = tempDiv.textContent || tempDiv.innerText || '';
    
    if (!title.trim() || !plainTextContent.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;
      if (!user) {
        router.replace('/login?redirect=/board/write');
        return;
      }
      // Refresh auth token to avoid 401 on Storage preflight
      try { await user.getIdToken(true); } catch {}

      // Upload attachments to local storage (avoiding Firebase Storage CORS issues)
      const uploadedUrls: string[] = [];
      for (const att of attachments) {
        if (!att.file) continue;
        
        try {
          const safeName = `${Date.now()}_${att.file.name}`.replace(/\s+/g, '_');
          const filePath = `board/${user.uid}/${safeName}`;
          
          const formData = new FormData();
          formData.append('file', att.file);
          formData.append('path', filePath);
          
          const response = await fetch('/api/upload-local', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
          }
          
          const result = await response.json();
          if (result.success && result.downloadURL) {
            uploadedUrls.push(result.downloadURL);
          } else {
            console.error('Upload failed:', result.error);
          }
        } catch (error) {
          console.error('Failed to upload file:', error);
          // Continue with other files even if one fails
        }
      }

      // Create Firestore post document
      const docRef = await addDoc(collection(firestoreClient, 'posts'), {
        authorUid: user.uid,
        authorEmail: user.email || null,
        category: selectedCategory,
        title: title.trim(),
        contentHtml: content,
        attachments: uploadedUrls,
        likes: 0,
        commentsCount: 0,
        views: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      alert('글이 등록되었습니다.');
      router.push(`/board`);
    } catch (error) {
      console.error('Failed to register post:', error);
      alert('글 등록에 실패했습니다.');
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/board')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {getText('backToList')}
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">{getText('writePost')}</h1>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <div className="space-y-6">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  {getText('category')}
                </label>
                {/* PC select */}
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as PostCategory)}
                  className="hidden sm:block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
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
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="sm:hidden w-full px-3 py-2 border border-gray-300 rounded-lg bg-white flex items-center justify-between"
                >
                  <span className="truncate">
                    {selectedCategory === 'daily' ? getText('categoryDaily') :
                     selectedCategory === 'curious' ? getText('categoryCurious') :
                     selectedCategory === 'together' ? getText('categoryTogether') :
                     selectedCategory === 'inform' ? getText('categoryInform') :
                     selectedCategory === 'share' ? getText('categoryShare') : getText('categoryTell')}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  {getText('title')}
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={getText('titlePlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Content */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getText('content')}
                </label>
                
                {/* Editor Toolbar */}
                <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => executeCommand('bold')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="굵게"
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('italic')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="기울임"
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('underline')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="밑줄"
                  >
                    <Underline className="h-4 w-4" />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  <button
                    type="button"
                    onClick={() => executeCommand('insertUnorderedList')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="글머리 기호"
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('insertOrderedList')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="번호 매기기"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt('링크 URL을 입력하세요:');
                      if (url) executeCommand('createLink', url);
                    }}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="링크"
                  >
                    <Link2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Editor Content */}
                <div
                  ref={editorRef}
                  contentEditable
                  dir="ltr"
                  onInput={handleEditorInput}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => {
                    setIsComposing(false);
                    if (editorRef.current) setContent(editorRef.current.innerHTML);
                  }}
                  onFocus={handleEditorFocus}
                  onBlur={handleEditorBlur}
                  className={`w-full min-h-[300px] px-3 py-2 border-x border-b border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                    isEditorFocused ? 'ring-2 ring-blue-500 border-transparent' : ''
                  }`}
                  style={{ 
                    maxHeight: '500px', 
                    overflowY: 'auto',
                    lineHeight: '1.5',
                    direction: 'ltr',
                    unicodeBidi: 'normal',
                    textAlign: 'left',
                    writingMode: 'horizontal-tb',
                    textOrientation: 'mixed',
                    whiteSpace: 'pre-wrap',
                  }}
                  suppressContentEditableWarning={true}
                />
                
                {/* Placeholder */}
                {!content && (
                  <div 
                    className="absolute text-gray-500 pointer-events-none"
                    style={{ 
                      top: '74px', 
                      left: '12px',
                      fontSize: '14px'
                    }}
                  >
                    {getText('contentPlaceholder')}
                  </div>
                )}
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getText('attachments')}
                </label>
                
                {/* Existing attachments */}
                {attachments.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Upload className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{attachment.name}</span>
                          <span className="text-xs text-gray-500">({attachment.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFileRemove(index)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* File upload area */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500 cursor-pointer hover:border-blue-500 transition-colors"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept=".pdf,.hwp,.hwpx,.jpg,.jpeg,.gif,.png"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm">{getText('fileUploadText')}</p>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  최대 20MB, 허용 확장자: pdf, hwp, hwpx, jpg, jpeg, gif, png
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {getText('cancel')}
            </button>
            <button
              onClick={handleRegister}
              disabled={isSubmitting || !title.trim() || (() => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;
                const plainTextContent = tempDiv.textContent || tempDiv.innerText || '';
                return !plainTextContent.trim();
              })()}
              className="flex items-center gap-2 px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? getText('registering') : getText('register')}
            </button>
          </div>
        </div>
      </main>
      {/* Category Modal (MO) */}
      {isMobile && isCategoryModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsCategoryModalOpen(false)} />
          <div className="fixed inset-x-4 top-20 bottom-20 bg-white rounded-lg shadow-xl z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{getText('category')}</h3>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg" onClick={() => setIsCategoryModalOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {([
                { key: 'daily', label: getText('categoryDaily') },
                { key: 'curious', label: getText('categoryCurious') },
                { key: 'together', label: getText('categoryTogether') },
                { key: 'inform', label: getText('categoryInform') },
                { key: 'share', label: getText('categoryShare') },
                { key: 'tell', label: getText('categoryTell') },
              ] as const).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => { setSelectedCategory(opt.key as PostCategory); setIsCategoryModalOpen(false); }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg ${selectedCategory === opt.key ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      <Footer currentLanguage={currentLanguage} userCountry={userCountry} />
    </div>
  );
}