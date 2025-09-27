'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase/client';

// 50분 경고, 60분 자동 로그아웃 (밀리초)
const WARNING_MS = 50 * 60 * 1000;
const LOGOUT_MS = 60 * 60 * 1000;

export default function IdleGuard(): React.ReactElement | null {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const channel = useMemo(() => {
    try {
      return new BroadcastChannel('idle-guard');
    } catch {
      return null;
    }
  }, []);

  const clearTimers = useCallback(() => {
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  }, []);

  const scheduleTimersFrom = useCallback((baseTimeMs: number) => {
    clearTimers();
    const now = Date.now();
    const elapsed = now - baseTimeMs;
    const warnIn = Math.max(0, WARNING_MS - elapsed);
    const logoutIn = Math.max(0, LOGOUT_MS - elapsed);

    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
    }, warnIn);

    logoutTimerRef.current = setTimeout(async () => {
      try {
        const auth = getAuth(firebaseApp);
        await signOut(auth);
      } catch {
        // ignore
      } finally {
        setShowWarning(false);
        router.replace('/login');
        channel?.postMessage({ type: 'logout' });
      }
    }, logoutIn);
  }, [channel, clearTimers, router]);

  const broadcastReset = useCallback(() => {
    channel?.postMessage({ type: 'reset', at: Date.now() });
  }, [channel]);

  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    setShowWarning(false);
    scheduleTimersFrom(lastActivityRef.current);
    broadcastReset();
  }, [broadcastReset, scheduleTimersFrom]);

  useEffect(() => {
    // 초기 타이머 설정
    scheduleTimersFrom(lastActivityRef.current);

    const onAnyActivity = () => resetActivity();

    const events: (keyof DocumentEventMap | keyof WindowEventMap)[] = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'visibilitychange',
    ];

    events.forEach((evt) => {
      // @ts-expect-error union of window/document listeners
      (window.addEventListener as any)(evt, onAnyActivity, { passive: true });
      // 일부 이벤트는 document에도 바인딩
      // @ts-expect-error document events
      (document.addEventListener as any)(evt, onAnyActivity, { passive: true });
    });

    const onMessage = (e: MessageEvent) => {
      const data = e?.data as { type?: string; at?: number } | undefined;
      if (!data) return;
      if (data.type === 'reset' && typeof data.at === 'number') {
        lastActivityRef.current = data.at;
        setShowWarning(false);
        scheduleTimersFrom(data.at);
      }
      if (data.type === 'logout') {
        setShowWarning(false);
        router.replace('/login');
      }
    };

    channel?.addEventListener('message', onMessage);

    return () => {
      clearTimers();
      events.forEach((evt) => {
        // @ts-expect-error union of window/document listeners
        (window.removeEventListener as any)(evt, onAnyActivity);
        // @ts-expect-error document events
        (document.removeEventListener as any)(evt, onAnyActivity);
      });
      channel?.removeEventListener('message', onMessage);
      try { channel?.close(); } catch { /* noop */ }
    };
  }, [channel, clearTimers, resetActivity, router, scheduleTimersFrom]);

  const handleStaySignedIn = useCallback(() => {
    resetActivity();
  }, [resetActivity]);

  const handleLogoutNow = useCallback(async () => {
    try {
      const auth = getAuth(firebaseApp);
      await signOut(auth);
    } catch {
      // ignore
    } finally {
      setShowWarning(false);
      router.replace('/login');
      channel?.postMessage({ type: 'logout' });
    }
  }, [channel, router]);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleStaySignedIn} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-[90%] p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">자동 로그아웃 예정</h2>
        <p className="text-sm text-gray-600 mb-4">
          10분 후 자동 로그아웃됩니다. 계속 이용하시려면 아래 버튼을 눌러주세요.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleLogoutNow}
            className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
            type="button"
          >
            지금 로그아웃
          </button>
          <button
            onClick={handleStaySignedIn}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            type="button"
          >
            계속 이용하기
          </button>
        </div>
      </div>
    </div>
  );
}


