import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
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

// iOS Spring Configurations
const IOS_SPRING = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 1,
};

const IOS_SMOOTH = {
  type: "spring",
  stiffness: 300,
  damping: 25,
};

const TAP_SCALE = 0.92;

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

  const refreshIndicatorY = useTransform(
    () => Math.min(pullProgress * 80, 80)
  );

  const refreshIndicatorRotate = useTransform(
    () => pullProgress * 360
  );

  return (
    <div className="relative overflow-hidden">
      {/* Refresh Indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center z-10"
        style={{ y: refreshIndicatorY }}
      >
        <motion.div
          className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center"
          style={{ rotate: refreshIndicatorRotate }}
          animate={isRefreshing ? { rotate: 360 } : {}}
          transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : IOS_SPRING}
        >
          {isRefreshing ? (
            <RefreshCw className="w-5 h-5 text-purple-600" />
          ) : (
            <motion.div
              animate={{ 
                opacity: pullProgress > 0.5 ? 1 : 0.3,
                scale: pullProgress >= 1 ? 1.1 : 1 
              }}
            >
              <ArrowLeft 
                className="w-5 h-5 text-purple-600 rotate-90" 
              />
            </motion.div>
          )}
        </motion.div>
      </motion.div>

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
          <motion.button
            key={tab.id}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.id, el);
            }}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 py-3 px-4 text-sm font-medium transition-colors relative",
              activeTab === tab.id
                ? "text-purple-600 dark:text-purple-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            )}
            whileTap={{ scale: TAP_SCALE }}
            transition={IOS_SPRING}
          >
            <div className="flex flex-col items-center gap-1">
              {tab.icon}
              <span className="text-[10px]">{tab.label}</span>
            </div>
          </motion.button>
        ))}
      </div>
      
      {/* Animated indicator */}
      <motion.div
        className="absolute bottom-0 h-0.5 bg-purple-600 rounded-full"
        initial={false}
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
        transition={IOS_SMOOTH}
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
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative p-2"
              whileTap={{ scale: TAP_SCALE }}
              transition={IOS_SPRING}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  color: isActive ? "#6B46C1" : "#9CA3AF",
                }}
                transition={IOS_SMOOTH}
              >
                <Icon className="w-6 h-6" />
              </motion.div>
              
              {/* Active indicator dot */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={IOS_SPRING}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
        
        {/* Profile button */}
        <motion.button
          onClick={() => onTabChange("profile")}
          className="relative p-2"
          whileTap={{ scale: TAP_SCALE }}
          transition={IOS_SPRING}
        >
          <motion.div
            animate={{
              scale: activeTab === "profile" ? 1.1 : 1,
            }}
            transition={IOS_SMOOTH}
            className={cn(
              "w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center",
              activeTab === "profile" && "ring-2 ring-purple-600 ring-offset-2 dark:ring-offset-gray-900"
            )}
          >
            <span className="text-white text-xs font-bold">Y</span>
          </motion.div>
        </motion.button>
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
  const x = useMotionValue(0);

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
    <motion.div
      className="border-b border-gray-200 dark:border-gray-800 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={IOS_SMOOTH}
      whileTap={{ scale: 0.99 }}
      style={{ x }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <motion.div 
          className="flex-shrink-0"
          whileTap={{ scale: 0.9 }}
          transition={IOS_SPRING}
        >
          <div 
            className="w-10 h-10 rounded-full bg-cover bg-center"
            style={{ backgroundImage: `url(${post.author.avatar})` }}
          />
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-gray-900 dark:text-white truncate">
              {post.author.name}
            </span>
            {post.author.isVerified && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={IOS_SPRING}
              >
                <Check className="w-4 h-4 text-purple-600 fill-purple-600" />
              </motion.div>
            )}
            {post.author.isPurple && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, ...IOS_SPRING }}
                className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center"
              >
                <Zap className="w-2.5 h-2.5 text-white fill-white" />
              </motion.div>
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
            <motion.button
              onClick={() => onReply(post.id)}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors group"
              whileTap={{ scale: TAP_SCALE }}
              transition={IOS_SPRING}
            >
              <motion.div 
                className="p-2 rounded-full group-hover:bg-blue-500/10"
                whileHover={{ scale: 1.1 }}
              >
                <MessageCircle className="w-4 h-4" />
              </motion.div>
              <span className="text-xs">{post.stats.replies}</span>
            </motion.button>

            {/* Repost */}
            <motion.button
              onClick={handleRepost}
              className={cn(
                "flex items-center gap-2 transition-colors group",
                isReposted ? "text-green-500" : "text-gray-500 hover:text-green-500"
              )}
              whileTap={{ scale: TAP_SCALE }}
              transition={IOS_SPRING}
            >
              <motion.div 
                className={cn(
                  "p-2 rounded-full",
                  isReposted ? "bg-green-500/10" : "group-hover:bg-green-500/10"
                )}
                animate={isReposted ? { rotate: 360 } : {}}
                transition={{ duration: 0.5 }}
              >
                <Repeat className="w-4 h-4" />
              </motion.div>
              <span className="text-xs">
                {post.stats.reposts + (isReposted ? 1 : 0)}
              </span>
            </motion.button>

            {/* Zap */}
            <motion.button
              onClick={handleZap}
              className={cn(
                "flex items-center gap-2 transition-colors group relative",
                isZapped ? "text-yellow-500" : "text-gray-500 hover:text-yellow-500"
              )}
              whileTap={{ scale: TAP_SCALE }}
              transition={IOS_SPRING}
            >
              <AnimatePresence>
                {showZapAnimation && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0, y: -20 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Zap className="w-4 h-4 fill-yellow-500" />
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div 
                className={cn(
                  "p-2 rounded-full",
                  isZapped ? "bg-yellow-500/10" : "group-hover:bg-yellow-500/10"
                )}
                animate={isZapped ? { scale: [1, 1.3, 1] } : {}}
                transition={IOS_SPRING}
              >
                <Zap className={cn("w-4 h-4", isZapped && "fill-yellow-500")} />
              </motion.div>
              <span className="text-xs">
                {post.stats.zaps + (isZapped ? 21 : 0)}
              </span>
            </motion.button>

            {/* Like */}
            <motion.button
              onClick={handleLike}
              className={cn(
                "flex items-center gap-2 transition-colors group",
                isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              )}
              whileTap={{ scale: TAP_SCALE }}
              transition={IOS_SPRING}
            >
              <motion.div 
                className={cn(
                  "p-2 rounded-full",
                  isLiked ? "bg-red-500/10" : "group-hover:bg-red-500/10"
                )}
                animate={isLiked ? { 
                  scale: [1, 1.4, 1],
                } : {}}
                transition={IOS_SPRING}
              >
                <motion.div
                  animate={isLiked ? {
                    scale: [1, 1.2, 1],
                  } : {}}
                  transition={IOS_SPRING}
                >
                  <Heart 
                    className={cn("w-4 h-4", isLiked && "fill-red-500")} 
                  />
                </motion.div>
              </motion.div>
              <span className="text-xs">
                {post.stats.likes + (isLiked ? 1 : 0)}
              </span>
            </motion.button>

            {/* More */}
            <motion.button
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              whileTap={{ scale: TAP_SCALE }}
              transition={IOS_SPRING}
            >
              <MoreHorizontal className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
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
  const variants = {
    initial: {
      x: direction === "right" ? "100%" : direction === "left" ? "-100%" : 0,
      y: direction === "up" ? "100%" : direction === "down" ? "-100%" : 0,
      opacity: 0,
    },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
    },
    exit: {
      x: direction === "right" ? "-30%" : direction === "left" ? "30%" : 0,
      y: direction === "up" ? "-30%" : direction === "down" ? "30%" : 0,
      opacity: 0,
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 35,
            mass: 0.8,
          }}
          className="absolute inset-0 bg-white dark:bg-black"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
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
    <motion.button
      onClick={onClick}
      className="absolute bottom-20 right-4 w-14 h-14 bg-purple-600 rounded-full shadow-lg flex items-center justify-center"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={IOS_SPRING}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
    >
      <Plus className="w-6 h-6 text-white" />
    </motion.button>
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
    <motion.button
      onClick={onClick}
      className={cn("relative rounded-full", sizes[size])}
      whileTap={{ scale: 0.9 }}
      transition={IOS_SPRING}
    >
      {/* Animated ring */}
      {isActive && (
        <motion.div
          className="absolute -inset-1 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
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
    </motion.button>
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={IOS_SPRING}
          className={cn(
            "fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full shadow-lg z-50",
            colors[type]
          )}
        >
          <span className="text-white text-sm font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
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
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 35,
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) {
                onClose();
              }
            }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl z-50 max-h-[80vh]"
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export type { Post, Tab };
export { IOS_SPRING, IOS_SMOOTH, TAP_SCALE };
