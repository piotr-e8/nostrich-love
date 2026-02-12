import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search,
  Bell,
  Mail,
  Settings,
  User,
  ChevronLeft,
  Share,
  Link as LinkIcon,
  VolumeX,
  Flag,
  UserX,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  PullToRefresh,
  TabBar,
  BottomNav,
  NoteCard,
  PageTransition,
  ComposeButton,
  StoryRing,
  Toast,
  Sheet,
  type Post,
  type Tab,
  IOS_SPRING,
  IOS_SMOOTH,
} from "./Interactions";

// Mock Data
const MOCK_POSTS: Post[] = [
  {
    id: "1",
    author: {
      name: "Will Casarin",
      handle: "@jb55",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=will",
      isVerified: true,
    },
    content: "Just shipped a new Damus update! Purple members can now customize their app icons. Check it out ⚡️",
    timestamp: "2m",
    stats: { replies: 12, reposts: 45, zaps: 2300, likes: 156 },
  },
  {
    id: "2",
    author: {
      name: "fiatjaf",
      handle: "@fiatjaf",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fiatjaf",
      isVerified: true,
    },
    content: "Nostr is not just a protocol, it's a movement towards user sovereignty. Every day more developers join and build amazing things.",
    timestamp: "15m",
    stats: { replies: 28, reposts: 124, zaps: 5420, likes: 892 },
  },
  {
    id: "3",
    author: {
      name: "Pablo",
      handle: "@pablo",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pablo",
      isVerified: true,
      isPurple: true,
    },
    content: "Working on some exciting new features for Damus. The team is growing and we're moving faster than ever! 🚀",
    timestamp: "32m",
    stats: { replies: 8, reposts: 23, zaps: 1200, likes: 234 },
  },
  {
    id: "4",
    author: {
      name: "ODELL",
      handle: "@odell",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=odell",
      isPurple: true,
    },
    content: "Bitcoin fixes this. Nostr fixes the rest. Stack sats, use nostr, stay free. 🍊💊",
    timestamp: "1h",
    stats: { replies: 156, reposts: 892, zaps: 25000, likes: 3402 },
  },
  {
    id: "5",
    author: {
      name: "Lisa Neigut",
      handle: "@niftynei",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
    },
    content: "Building on Lightning is like having superpowers. The things you can do with instant, global payments are mind-blowing.",
    timestamp: "2h",
    stats: { replies: 34, reposts: 67, zaps: 3400, likes: 456 },
  },
];

const STORIES = [
  { id: "1", name: "Your Story", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=you", isActive: true },
  { id: "2", name: "Will", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=will", isActive: true },
  { id: "3", name: "Pablo", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=pablo", isActive: false },
  { id: "4", name: "fiatjaf", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=fiatjaf", isActive: true },
  { id: "5", name: "ODELL", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=odell", isActive: false },
];

const TABS: Tab[] = [
  { id: "following", label: "Following", icon: <User className="w-4 h-4" /> },
  { id: "global", label: "Global", icon: <Home className="w-4 h-4" /> },
];

// ============================================
// COMPOSE MODAL
// ============================================
function ComposeModal({ isOpen, onClose, onPost }: { isOpen: boolean; onClose: () => void; onPost: (content: string) => void }) {
  const [content, setContent] = useState("");

  const handlePost = () => {
    if (content.trim()) {
      onPost(content);
      setContent("");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%", scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: "100%", scale: 0.95 }}
            transition={IOS_SMOOTH}
            className="bg-white dark:bg-gray-900 w-full sm:w-[400px] sm:rounded-2xl rounded-t-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <motion.button
                onClick={onClose}
                className="text-purple-600 font-semibold"
                whileTap={{ scale: 0.9 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handlePost}
                disabled={!content.trim()}
                className={cn(
                  "px-4 py-1.5 rounded-full font-semibold text-sm",
                  content.trim()
                    ? "bg-purple-600 text-white"
                    : "bg-purple-300 text-white cursor-not-allowed"
                )}
                whileTap={content.trim() ? { scale: 0.95 } : {}}
              >
                Post
              </motion.button>
            </div>

            {/* Input */}
            <div className="p-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="flex-1 bg-transparent border-none resize-none outline-none text-gray-900 dark:text-white text-lg min-h-[120px]"
                  autoFocus
                />
              </div>

              {/* Character count */}
              <div className="flex justify-end mt-4">
                <span className={cn(
                  "text-sm",
                  content.length > 280 ? "text-red-500" : "text-gray-400"
                )}>
                  {content.length}/280
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// PROFILE MODAL
// ============================================
function ProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const menuItems = [
    { icon: Share, label: "Share Profile" },
    { icon: LinkIcon, label: "Copy Link" },
    { icon: VolumeX, label: "Mute", destructive: false },
    { icon: UserX, label: "Block", destructive: false },
    { icon: Flag, label: "Report", destructive: true },
  ];

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="Profile Options">
      <div className="space-y-1">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, ...IOS_SPRING }}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-xl text-left",
              item.destructive
                ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
            whileTap={{ scale: 0.98 }}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </Sheet>
  );
}

// ============================================
// HOME TIMELINE
// ============================================
function HomeTimeline({ 
  activeTab, 
  onTabChange,
  posts,
  onLike,
  onRepost,
  onZap,
  onReply,
}: { 
  activeTab: string;
  onTabChange: (tab: string) => void;
  posts: Post[];
  onLike: (id: string) => void;
  onRepost: (id: string) => void;
  onZap: (id: string) => void;
  onReply: (id: string) => void;
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [postsState, setPostsState] = useState(posts);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <motion.button 
            className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"
            whileTap={{ scale: 0.9 }}
            transition={IOS_SPRING}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={IOS_SPRING}
          >
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-purple-600 fill-current">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </motion.div>
          <motion.button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            whileTap={{ scale: 0.9 }}
            transition={IOS_SPRING}
          >
            <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </motion.button>
        </div>

        {/* Tab Bar */}
        <TabBar tabs={TABS} activeTab={activeTab} onTabChange={onTabChange} />
      </div>

      {/* Stories Row */}
      <div className="flex gap-4 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-gray-200 dark:border-gray-800">
        {STORIES.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, ...IOS_SPRING }}
            className="flex flex-col items-center gap-1"
          >
            <StoryRing
              image={story.image}
              isActive={story.isActive}
              size="md"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
              {story.name}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Posts Feed */}
      <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing}>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          <AnimatePresence mode="popLayout">
            {postsState.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05, ...IOS_SMOOTH }}
              >
                <NoteCard
                  post={post}
                  onLike={onLike}
                  onRepost={onRepost}
                  onZap={onZap}
                  onReply={onReply}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </PullToRefresh>
    </div>
  );
}

// ============================================
// MAIN SIMULATOR
// ============================================
export function DamusInteractiveSimulator() {
  const [activeTab, setActiveTab] = useState("home");
  const [feedTab, setFeedTab] = useState("following");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; isVisible: boolean; type: "success" | "error" | "info" }>({ 
    message: "", 
    isVisible: false, 
    type: "info" 
  });
  const [posts, setPosts] = useState(MOCK_POSTS);

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, isVisible: true, type });
    setTimeout(() => setToast((prev) => ({ ...prev, isVisible: false })), 2000);
  };

  const handleLike = useCallback((id: string) => {
    showToast("Liked! ❤️", "success");
  }, []);

  const handleRepost = useCallback((id: string) => {
    showToast("Reposted! 🔄", "success");
  }, []);

  const handleZap = useCallback((id: string) => {
    showToast("Zapped! ⚡️", "success");
  }, []);

  const handleReply = useCallback((id: string) => {
    showToast("Reply feature coming soon! 💬", "info");
  }, []);

  const handleNewPost = useCallback((content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        name: "You",
        handle: "@you",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
      },
      content,
      timestamp: "now",
      stats: { replies: 0, reposts: 0, zaps: 0, likes: 0 },
    };
    setPosts((prev) => [newPost, ...prev]);
    showToast("Posted! 🚀", "success");
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="relative w-full max-w-md mx-auto h-[700px] bg-black rounded-[3rem] overflow-hidden border-[12px] border-gray-800 shadow-2xl">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50" />

      {/* Main Content */}
      <div className="h-full flex flex-col bg-white dark:bg-black">
        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <HomeTimeline
                  activeTab={feedTab}
                  onTabChange={setFeedTab}
                  posts={posts}
                  onLike={handleLike}
                  onRepost={handleRepost}
                  onZap={handleZap}
                  onReply={handleReply}
                />
              </motion.div>
            )}

            {activeTab === "search" && (
              <motion.div
                key="search"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={IOS_SMOOTH}
                className="h-full flex items-center justify-center bg-white dark:bg-black"
              >
                <div className="text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Search coming soon...</p>
                </div>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={IOS_SMOOTH}
                className="h-full flex items-center justify-center bg-white dark:bg-black"
              >
                <div className="text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
                </div>
              </motion.div>
            )}

            {activeTab === "messages" && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={IOS_SMOOTH}
                className="h-full flex items-center justify-center bg-white dark:bg-black"
              >
                <div className="text-center">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Messages coming soon...</p>
                </div>
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={IOS_SMOOTH}
                className="h-full bg-white dark:bg-black overflow-y-auto"
              >
                {/* Profile Header */}
                <div className="relative">
                  {/* Banner */}
                  <div className="h-32 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400" />
                  
                  {/* Profile Info */}
                  <div className="px-4 pb-4">
                    <div className="flex justify-between items-end -mt-12 mb-3">
                      <motion.div
                        className="w-24 h-24 rounded-full border-4 border-white dark:border-black bg-gradient-to-br from-purple-400 to-pink-400"
                        whileTap={{ scale: 0.95 }}
                        transition={IOS_SPRING}
                      />
                      <div className="flex gap-2">
                        <motion.button
                          className="px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-full font-semibold text-sm"
                          whileTap={{ scale: 0.95 }}
                          transition={IOS_SPRING}
                        >
                          Edit Profile
                        </motion.button>
                        <motion.button
                          onClick={() => setIsProfileOpen(true)}
                          className="p-2 border border-gray-300 dark:border-gray-700 rounded-full"
                          whileTap={{ scale: 0.9 }}
                          transition={IOS_SPRING}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    <h2 className="font-bold text-xl text-gray-900 dark:text-white">You</h2>
                    <p className="text-gray-500">@you</p>
                    
                    <p className="mt-3 text-gray-900 dark:text-gray-100">
                      Nostr enthusiast ⚡️ Building the future of social media
                    </p>

                    <div className="flex gap-4 mt-3 text-gray-500 text-sm">
                      <span><strong className="text-gray-900 dark:text-white">142</strong> Following</span>
                      <span><strong className="text-gray-900 dark:text-white">89</strong> Followers</span>
                    </div>
                  </div>
                </div>

                {/* Profile Tabs */}
                <TabBar
                  tabs={[
                    { id: "posts", label: "Posts", icon: <Home className="w-4 h-4" /> },
                    { id: "replies", label: "Replies", icon: <MessageCircle className="w-4 h-4" /> },
                    { id: "likes", label: "Likes", icon: <Heart className="w-4 h-4" /> },
                  ]}
                  activeTab="posts"
                  onTabChange={() => {}}
                />

                {/* User Posts */}
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {posts.filter((_, i) => i < 2).map((post) => (
                    <NoteCard
                      key={post.id}
                      post={{
                        ...post,
                        author: {
                          name: "You",
                          handle: "@you",
                          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
                        },
                      }}
                      onLike={handleLike}
                      onRepost={handleRepost}
                      onZap={handleZap}
                      onReply={handleReply}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        {activeTab !== "profile" && (
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        )}
      </div>

      {/* Compose Button */}
      {activeTab === "home" && (
        <div className="absolute bottom-20 right-4 z-20">
          <ComposeButton onClick={() => setIsComposeOpen(true)} />
        </div>
      )}

      {/* Modals */}
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onPost={handleNewPost}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Toast */}
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        type={toast.type}
      />

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full z-50" />
    </div>
  );
}

export default DamusInteractiveSimulator;
