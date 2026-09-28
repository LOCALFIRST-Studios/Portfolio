import { useCallback, useEffect, useState } from "react";
import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";
import PageTransition from "../components/PageTransition";
import useLenis from "../hooks/useLenis";

export default function RootLayout() {
  const { pathname } = useLocation();
  const isDemo = pathname.startsWith("/demos");
  const [ready, setReady] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("lf-preloader") === "1";
  });

  useLenis();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  const onPreloaderDone = useCallback(() => setReady(true), []);

  return (
    <div className="min-h-dvh bg-bg text-ink">
      {!ready && !isDemo && <Preloader onDone={onPreloaderDone} />}
      <PageTransition />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      {!isDemo && <Navbar />}
      <main id="main">
        <Suspense fallback={<div className="py-32 text-center text-muted">Loading…</div>}>
          <Outlet />
        </Suspense>
      </main>
      {!isDemo && <Footer />}
    </div>
  );
}
