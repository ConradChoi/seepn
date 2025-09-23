'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Heart, Star, MessageSquare, ClipboardList, User as UserIcon, CalendarDays } from 'lucide-react';
import { firebaseApp, firestoreClient } from '@/lib/firebase/client';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function MyPageDashboard() {
  const [currentLanguage, setCurrentLanguage] = useState('ko');
  const [userCountry, setUserCountry] = useState('대한민국');
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const router = useRouter();

  // User info from Firebase
  const [visitCount, setVisitCount] = useState(1);
  const [userEmail, setUserEmail] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [userJoinedAt, setUserJoinedAt] = useState<string>('');
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);

  // Sample activity data (placeholder)
  const [activity, setActivity] = useState({
    favoriteSuppliers: 7,
    evaluated: { done: 3, inProgress: 1, scheduled: 1 },
    recentPosts: 4,
    inquiries: { total: 6, answered: 4, pending: 2 },
  });

  useEffect(() => {
    // Country (best-effort)
    const fetchCountry = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        setUserCountry(data.country_name || '대한민국');
      } catch (e) {
        setUserCountry('대한민국');
        console.error('Failed to fetch user country', e);
        throw new Error('Failed to fetch user country');
      }
    };
    fetchCountry();

    // Visit count via localStorage
    try {
      const key = 'mypageVisitCount';
      const prev = Number(localStorage.getItem(key) || '0');
      const next = prev + 1;
      localStorage.setItem(key, String(next));
      setVisitCount(next);
    } catch (e) {
      setVisitCount((v) => v);
    }

    // Auth + user profile
    const auth = getAuth(firebaseApp);
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setIsLoggedIn(false);
        return;
      }
      setIsLoggedIn(true);
      setUserEmail(u.email || '');
      setUserPhotoURL(u.photoURL || null);
      try {
        const snap = await getDoc(doc(firestoreClient, 'users', u.uid));
        const data = snap.exists() ? (snap.data() as any) : null;
        setUserNickname(data?.nickname || u.displayName || '');
        setUserJoinedAt(data?.createdAt || (u.metadata?.creationTime ? new Date(u.metadata.creationTime).toISOString() : ''));
      } catch {
        setUserNickname(u.displayName || '');
        setUserJoinedAt(u.metadata?.creationTime ? new Date(u.metadata.creationTime).toISOString() : '');
      }
    });
    return () => unsub();
  }, []);

  const getText = (key: string) => {
    const texts = {
      ko: {
        pageTitle: '마이페이지',
        userInfo: '사용자 정보',
        nickname: '닉네임',
        joinedAt: '가입일',
        nthVisit: '번째 방문',
        activity: '활동 정보',
        favorites: '관심 공급사 수',
        evaluated: '평가 공급사',
        evaluatedDone: '평가완료',
        evaluatedInProgress: '평가진행',
        evaluatedScheduled: '평가예정',
        recentPosts: '최근 등록글 수',
        inquiry: '1:1 문의',
        inquiryTotal: '총 문의 수',
        inquiryAnswered: '답변완료 수',
        inquiryPending: '답변예정 수',
      },
      en: {
        pageTitle: 'My Page',
        userInfo: 'User Info',
        nickname: 'Nickname',
        joinedAt: 'Joined',
        nthVisit: 'th visit',
        activity: 'Activity',
        favorites: 'Favorite suppliers',
        evaluated: 'Evaluated suppliers',
        evaluatedDone: 'Completed',
        evaluatedInProgress: 'In Progress',
        evaluatedScheduled: 'Scheduled',
        recentPosts: 'Recent posts',
        inquiry: '1:1 Inquiry',
        inquiryTotal: 'Total',
        inquiryAnswered: 'Answered',
        inquiryPending: 'Pending',
      },
      ja: {
        pageTitle: 'マイページ',
        userInfo: 'ユーザー情報',
        nickname: 'ニックネーム',
        joinedAt: '加入日',
        nthVisit: '回目の訪問',
        activity: '活動情報',
        favorites: 'お気に入りサプライヤー数',
        evaluated: '評価サプライヤー',
        evaluatedDone: '評価完了',
        evaluatedInProgress: '評価進行',
        evaluatedScheduled: '評価予定',
        recentPosts: '最近の投稿数',
        inquiry: '1:1 お問い合わせ',
        inquiryTotal: '合計',
        inquiryAnswered: '回答済み',
        inquiryPending: '回答予定',
      },
      zh: {
        pageTitle: '我的页面',
        userInfo: '用户信息',
        nickname: '昵称',
        joinedAt: '加入日期',
        nthVisit: '次访问',
        activity: '活动信息',
        favorites: '关注的供应商数',
        evaluated: '评价的供应商',
        evaluatedDone: '已完成',
        evaluatedInProgress: '进行中',
        evaluatedScheduled: '预定',
        recentPosts: '最近发布数',
        inquiry: '1:1 咨询',
        inquiryTotal: '总数',
        inquiryAnswered: '已答复',
        inquiryPending: '待答复',
      },
    } as const;
    return (texts as any)[currentLanguage]?.[key] ?? (texts as any).ko[key];
  };

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const numberFormat = (n: number) => n.toLocaleString();

  const avatarInitial = userNickname?.[0] || 'U';

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
            {/* User Info Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 lg:col-span-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{getText('userInfo')}</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold overflow-hidden">
                  {userPhotoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={userPhotoURL} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{avatarInitial}</span>
                  )}
                </div>
                <div>
                  <div className="text-gray-900 font-semibold text-lg flex items-center gap-2">
                    <span>{userNickname || '사용자'}</span>
                    <span className="text-sm text-gray-500">{userEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <CalendarDays className="h-4 w-4" />
                    <span>{getText('joinedAt')}: {userJoinedAt ? formatDate(userJoinedAt) : '-'}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {numberFormat(visitCount)}{getText('nthVisit')}
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{getText('activity')}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Favorites */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">{getText('favorites')}</span>
                    <Heart className="h-4 w-4 text-pink-500" />
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push('/mypage/favorites')}
                    className="text-2xl font-bold text-gray-900 hover:text-blue-600"
                    aria-label={getText('favorites')}
                  >
                    {numberFormat(activity.favoriteSuppliers)}
                  </button>
                </div>

                {/* Evaluated suppliers */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">{getText('evaluated')}</span>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">{getText('evaluatedDone')}</div>
                      <button type="button" onClick={() => router.push('/mypage/evaluations?tab=completed')} className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                        {numberFormat(activity.evaluated.done)}
                      </button>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">{getText('evaluatedInProgress')}</div>
                      <button type="button" onClick={() => router.push('/mypage/evaluations?tab=in_progress')} className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                        {numberFormat(activity.evaluated.inProgress)}
                      </button>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">{getText('evaluatedScheduled')}</div>
                      <button type="button" onClick={() => router.push('/mypage/evaluations?tab=scheduled')} className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                        {numberFormat(activity.evaluated.scheduled)}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent posts */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">{getText('recentPosts')}</span>
                    <ClipboardList className="h-4 w-4 text-blue-600" />
                  </div>
                  <button type="button" onClick={() => router.push('/mypage/posts')} className="text-2xl font-bold text-gray-900 hover:text-blue-600">
                    {numberFormat(activity.recentPosts)}
                  </button>
                </div>

                {/* 1:1 Inquiry */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">{getText('inquiry')}</span>
                    <MessageSquare className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">{getText('inquiryTotal')}</div>
                      <button type="button" onClick={() => router.push('/mypage/inquiries?tab=all')} className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                        {numberFormat(activity.inquiries.total)}
                      </button>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">{getText('inquiryAnswered')}</div>
                      <button type="button" onClick={() => router.push('/mypage/inquiries?tab=answered')} className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                        {numberFormat(activity.inquiries.answered)}
                      </button>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">{getText('inquiryPending')}</div>
                      <button type="button" onClick={() => router.push('/mypage/inquiries?tab=pending')} className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                        {numberFormat(activity.inquiries.pending)}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer currentLanguage={currentLanguage} userCountry={userCountry} />
    </div>
  );
}


