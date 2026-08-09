import React, { useState, useRef, useEffect } from "react";
import {
  Home,
  Search,
  Bell,
  Mail,
  User,
  Heart,
  MessageCircle,
  Repeat,
  Zap,
  MoreHorizontal,
  ArrowLeft,
  RefreshCw,
  Check,
  Plus,
  Settings,
} from "lucide-react";
import { cn } from "../../../lib/utils";

// Types
interface Post {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    isVerified?: boolean;
    isPurple?: boolean;
  };
  content: string;
  timestamp: string;
  stats: {
    replies: number;
    reposts: number;
    zaps: number;
    likes: number;
  };
  isLiked?: boolean;
  isReposted?: boolean;
  isZapped?: boolean;
}

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const SHEET_EXIT_DURATION_MS = 300;

// ============================================
// PULL TO REFRESH COMPONENT
// ============================================
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  isRefreshing?: boolean;
}

export function PullToRefresh({ onRefresh, children, isRefreshing = false }: PullToRefreshProps) {
  const [pullProgress, setPullProgress] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;
    
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;
    
    if (diff > 0 && containerRef.current?.scrollTop === 0) {
      const progress = Math.min(diff / 100, 1);
      setPullProgress(progress);
      e.preventDefault();
    }
  };

  const handleTouchEnd = async () => {
    if (pullProgress >= 1) {
      await onRefresh();
    }
    setIsPulling(false);
    setPullProgress(0);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Refresh Indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center z-10"
        style={{ transform: `translateY(${Math.min(pullProgress * 80, 80)}px)` }}
      >
        <div
          className={cn(
            "w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center",
            isRefreshing && "animate-spin motion-reduce:animate-none"
          )}
          style={
            isRefreshing
              ? undefined
              : { transform: `rotate(${pullProgress * 360}deg)` }
          }
        >
          {isRefreshing ? (
            <RefreshCw className="w-5 h-5 text-purple-600" />
          ) : (
            <div
              className="transition-all duration-200 motion-reduce:transition-none"
              style={{
                opacity: pullProgress > 0.5 ? 1 : 0.3,
                transform: pullProgress >= 1 ? "scale(1.1)" : "scale(1)",
              }}
            >
              <ArrowLeft 
                className="w-5 h-5 text-purple-600 rotate-90" 
              />
            </div>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div
        ref={containerRef}
        className="overflow-y-auto max-h-[600px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateY(${pullProgress * 60}px)`,
          transition: isPulling ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ============================================
// TAB SWITCHING ANIMATION
// ============================================
interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeTabElement = tabRefs.current.get(activeTab);
    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeTab]);

  return (
    <div className="relative border-b border-gray-200 dark:border-gray-800">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.id, el);
            }}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
              "active:scale-95 transition-transform motion-reduce:transition-none motion-reduce:transform-none",
              activeTab === tab.id
                ? "text-purple-600 dark:text-purple-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            )}
          >
            <div className="flex flex-col items-center gap-1">
              {tab.icon}
              <span className="text-[10px]">{tab.label}</span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Animated indicator */}
      <div
        className="absolute bottom-0 h-0.5 bg-purple-600 rounded-full transition-all duration-300 ease-out-quint motion-reduce:transition-none"
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
      />
    </div>
  );
}

// ============================================
// BOTTOM NAVIGATION BAR
// ============================================
interface BottomNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "home", icon: Home, label: "" },
    { id: "search", icon: Search, label: "" },
    { id: "notifications", icon: Bell, label: "" },
    { id: "messages", icon: Mail, label: "" },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-2">
      <div className="flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative p-2 active:scale-95 transition-transform motion-reduce:transition-none motion-reduce:transform-none"
            >
              <div
                className={cn(
                  "transition-all duration-300 motion-reduce:transition-none",
                  isActive ? "scale-110 text-[#6B46C1]" : "text-[#9CA3AF]"
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              
              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full">
                  <div className="w-full h-full bg-purple-600 rounded-full animate-scale-pop motion-reduce:animate-none" />
                </div>
              )}
            </button>
          );
        })}
        
        {/* Profile button */}
        <button
          onClick={() => onTabChange("profile")}
          className="relative p-2 active:scale-95 transition-transform motion-reduce:transition-none motion-reduce:transform-none"
        >
          <div
            className={cn(
              "w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center",
              "transition-transform duration-300 motion-reduce:transition-none",
              activeTab === "profile" &&
                "scale-110 ring-2 ring-purple-600 ring-offset-2 dark:ring-offset-gray-900"
            )}
          >
            <span className="text-white text-xs font-bold">Y</span>
          </div>
        </button>
      </div>
    </div>
  );
}

// ============================================
// NOTE CARD WITH INTERACTIONS
// ============================================
interface NoteCardProps {
  post: Post;
  onLike: (id: string) => void;
  onRepost: (id: string) => void;
  onZap: (id: string) => void;
  onReply: (id: string) => void;
}

export function NoteCard({ post, onLike, onRepost, onZap, onReply }: NoteCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isReposted, setIsReposted] = useState(post.isReposted || false);
  const [isZapped, setIsZapped] = useState(post.isZapped || false);
  const [showZapAnimation, setShowZapAnimation] = useState(false);
  // Drives the zap burst: mounts small and opaque, then flips on the next
  // frame and CSS transitions it up and out (double-rAF idiom).
  const [zapBurstEntered, setZapBurstEntered] = useState(false);
  useEffect(() => {
    if (!showZapAnimation) {
      setZapBurstEntered(false);
      return;
    }
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setZapBurstEntered(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [showZapAnimation]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(post.id);
  };

  const handleRepost = () => {
    setIsReposted(!isReposted);
    onRepost(post.id);
  };

  const handleZap = () => {
    setIsZapped(true);
    setShowZapAnimation(true);
    onZap(post.id);
    setTimeout(() => setShowZapAnimation(false), 1000);
  };

  return (
    <div
      className={cn(
        "border-b border-gray-200 dark:border-gray-800 p-4",
        "animate-slide-up motion-reduce:animate-none"
      )}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 active:scale-90 transition-transform motion-reduce:transition-none motion-reduce:transform-none">
          <div 
            className="w-10 h-10 rounded-full bg-cover bg-center"
            style={{ backgroundImage: `url(${post.author.avatar})` }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-gray-900 dark:text-white truncate">
              {post.author.name}
            </span>
            {post.author.isVerified && (
              <div className="animate-spin-in motion-reduce:animate-none">
                <Check className="w-4 h-4 text-purple-600 fill-purple-600" />
              </div>
            )}
            {post.author.isPurple && (
              <div
                className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center animate-scale-pop motion-reduce:animate-none"
                style={{ animationDelay: "100ms" }}
              >
                <Zap className="w-2.5 h-2.5 text-white fill-white" />
              </div>
            )}
            <span className="text-gray-500 text-sm truncate">{post.author.handle}</span>
            <span className="text-gray-400 text-sm">·</span>
            <span className="text-gray-500 text-sm">{post.timestamp}</span>
          </div>

          {/* Text */}
          <p className="text-gray-900 dark:text-gray-100 text-[15px] leading-relaxed mb-3">
            {post.content}
          </p>

          {/* Action Bar */}
          <div className="flex items-center justify-between max-w-md">
            {/* Reply */}
            <button
              onClick={() => onReply(post.id)}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors group active:scale-95 motion-reduce:transform-none"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-500/10 hover:scale-110 transition-transform motion-reduce:transition-none motion-reduce:transform-none">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-xs">{post.stats.replies}</span>
            </button>

            {/* Repost */}
            <button
              onClick={handleRepost}
              className={cn(
                "flex items-center gap-2 transition-colors group active:scale-95 motion-reduce:transform-none",
                isReposted ? "text-green-500" : "text-gray-500 hover:text-green-500"
              )}
            >
              <div 
                className={cn(
                  "p-2 rounded-full transition-transform duration-500 motion-reduce:transition-none",
                  isReposted
                    ? "bg-green-500/10 rotate-[360deg]"
                    : "group-hover:bg-green-500/10"
                )}
              >
                <Repeat className="w-4 h-4" />
              </div>
              <span className="text-xs">
                {post.stats.reposts + (isReposted ? 1 : 0)}
              </span>
            </button>

            {/* Zap */}
            <button
              onClick={handleZap}
              className={cn(
                "flex items-center gap-2 transition-colors group relative active:scale-95 motion-reduce:transform-none",
                isZapped ? "text-yellow-500" : "text-gray-500 hover:text-yellow-500"
              )}
            >
              {showZapAnimation && (
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center pointer-events-none",
                    "transition-all duration-500 motion-reduce:transition-none",
                    zapBurstEntered
                      ? "scale-[2] opacity-0 -translate-y-5"
                      : "scale-50 opacity-100"
                  )}
                >
                  <Zap className="w-4 h-4 fill-yellow-500" />
                </div>
              )}
              <div 
                className={cn(
                  "p-2 rounded-full",
                  isZapped ? "bg-yellow-500/10" : "group-hover:bg-yellow-500/10",
                  showZapAnimation && "animate-scale-pop motion-reduce:animate-none"
                )}
              >
                <Zap className={cn("w-4 h-4", isZapped && "fill-yellow-500")} />
              </div>
              <span className="text-xs">
                {post.stats.zaps + (isZapped ? 21 : 0)}
              </span>
            </button>

            {/* Like */}
            <button
              onClick={handleLike}
              className={cn(
                "flex items-center gap-2 transition-colors group active:scale-95 motion-reduce:transform-none",
                isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              )}
            >
              <div 
                className={cn(
                  "p-2 rounded-full",
                  isLiked
                    ? "bg-red-500/10 animate-scale-pop motion-reduce:animate-none"
                    : "group-hover:bg-red-500/10"
                )}
              >
                <Heart 
                  className={cn("w-4 h-4", isLiked && "fill-red-500")} 
                />
              </div>
              <span className="text-xs">
                {post.stats.likes + (isLiked ? 1 : 0)}
              </span>
            </button>

            {/* More */}
            <button
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full active:scale-95 transition-transform motion-reduce:transition-none motion-reduce:transform-none"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PAGE TRANSITIONS
// ============================================
interface PageTransitionProps {
  children: React.ReactNode;
  isActive: boolean;
  direction?: "left" | "right" | "up" | "down";
}

export function PageTransition({ children, isActive, direction = "right" }: PageTransitionProps) {
  const enterClass = {
    right: "animate-slide-in-right",
    left: "animate-slide-in-left",
    up: "animate-slide-up",
    down: "animate-slide-down",
  }[direction];

  if (!isActive) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 bg-white dark:bg-black",
        enterClass,
        "motion-reduce:animate-none"
      )}
    >
      {children}
    </div>
  );
}

// ============================================
// COMPOSE BUTTON
// ============================================
interface ComposeButtonProps {
  onClick: () => void;
}

export function ComposeButton({ onClick }: ComposeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute bottom-20 end-4 w-14 h-14 bg-purple-600 rounded-full shadow-lg flex items-center justify-center",
        // Backwards fill so the enter animation's final transform releases
        // control back to the hover/active scale classes once it finishes.
        "animate-spin-in [animation-fill-mode:backwards] motion-reduce:animate-none",
        "hover:scale-110 active:scale-90 transition-transform motion-reduce:transition-none motion-reduce:transform-none"
      )}
    >
      <Plus className="w-6 h-6 text-white" />
    </button>
  );
}

// ============================================
// STORY/STATUS RING
// ============================================
interface StoryRingProps {
  image: string;
  isActive?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

export function StoryRing({ image, isActive = false, onClick, size = "md" }: StoryRingProps) {
  const sizes = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-16 h-16",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative rounded-full active:scale-90 transition-transform motion-reduce:transition-none motion-reduce:transform-none",
        sizes[size]
      )}
    >
      {/* Animated ring */}
      {isActive && (
        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 animate-spin [animation-duration:3s] motion-reduce:animate-none" />
      )}
      
      {/* Static ring */}
      <div className={cn(
        "absolute -inset-1 rounded-full",
        isActive 
          ? "bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400" 
          : "bg-gray-300 dark:bg-gray-700"
      )} />
      
      {/* Image container */}
      <div className="absolute inset-0 rounded-full bg-white dark:bg-gray-900 p-[2px]">
        <div 
          className="w-full h-full rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
      </div>
    </button>
  );
}

// ============================================
// TOAST NOTIFICATION
// ============================================
interface ToastProps {
  message: string;
  isVisible: boolean;
  type?: "success" | "error" | "info";
}

export function Toast({ message, isVisible, type = "info" }: ToastProps) {
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-purple-600",
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div
        className={cn(
          "px-4 py-2 rounded-full shadow-lg animate-slide-down motion-reduce:animate-none",
          colors[type]
        )}
      >
        <span className="text-white text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}

// ============================================
// SHEET/BOTTOM SHEET
// ============================================
interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Sheet({ isOpen, onClose, children, title }: SheetProps) {
  // Timed-exit modal state (double-rAF mount idiom)
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setEntered(false);
      return;
    }
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [isOpen]);

  useEffect(
    () => () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    },
    [],
  );

  const handleClose = () => {
    if (exiting) return;
    setExiting(true);
    exitTimer.current = setTimeout(() => {
      setExiting(false);
      onClose();
    }, SHEET_EXIT_DURATION_MS);
  };

  const isShown = entered && !exiting;

  if (!isOpen) return null;

  return (
    <>
          {/* Backdrop */}
          <div
            onClick={handleClose}
            className={cn(
              "fixed inset-0 bg-black/50 z-40",
              "transition-opacity duration-300 motion-reduce:transition-none",
              isShown ? "opacity-100" : "opacity-0"
            )}
          />
          
          {/* Sheet */}
          <div
            className={cn(
              "fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl z-50 max-h-[80vh]",
              "transition-transform duration-300 ease-out-quint motion-reduce:transition-none",
              isShown ? "translate-y-0" : "translate-y-full"
            )}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>
            
            {/* Title */}
            {title && (
              <div className="px-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-center">{title}</h3>
              </div>
            )}
            
            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {children}
            </div>
          </div>
    </>
  );
}

export type { Post, Tab };
