import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Calendar as CalendarIcon, 
  FileText, 
  Settings, 
  Plus, 
  ChevronRight, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Bell, 
  ChevronLeft, 
  Target, 
  Users, 
  Eye, 
  MessageSquare, 
  Megaphone, 
  Camera, 
  Gift, 
  Info,
  CheckCircle2,
  Clock,
  Send,
  ArrowRight,
  Download,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';
import { generateMarketingStrategy, generateMarketingImage, generateMarketingVideo } from './services/gemini';

// --- Types ---
type View = 'dashboard' | 'content-studio' | 'calendar' | 'posts' | 'brand-settings';
type Step = 'objective' | 'style' | 'create' | 'schedule';

interface PostObjective {
  id: string;
  label: string;
  description: string;
  icon: any;
  color: string;
}

const OBJECTIVES: PostObjective[] = [
  { id: 'promotion', label: 'Promotion', description: 'Offers & discounts', icon: Megaphone, color: 'text-rose-500 bg-rose-50' },
  { id: 'engagement', label: 'Engagement', description: 'Questions & polls', icon: MessageSquare, color: 'text-blue-500 bg-blue-50' },
  { id: 'awareness', label: 'Awareness', description: 'Brand visibility', icon: Eye, color: 'text-purple-500 bg-purple-50' },
  { id: 'testimonial', label: 'Testimonial', description: 'Customer reviews', icon: Sparkles, color: 'text-amber-500 bg-amber-50' },
  { id: 'tips', label: 'Tips & Tricks', description: 'Helpful advice', icon: Info, color: 'text-emerald-500 bg-emerald-50' },
  { id: 'behind-scenes', label: 'Behind the Scenes', description: 'Your story', icon: Camera, color: 'text-cyan-500 bg-cyan-50' },
  { id: 'seasonal', label: 'Seasonal', description: 'Holidays & events', icon: Gift, color: 'text-pink-500 bg-pink-50' },
  { id: 'announcement', label: 'Announcement', description: 'News & updates', icon: Bell, color: 'text-indigo-500 bg-indigo-50' },
];

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium",
      active 
        ? "bg-indigo-50 text-indigo-600" 
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    )}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

const StatCard = ({ label, value, subtext, icon: Icon, trend }: { label: string, value: string | number, subtext: string, icon: any, trend?: string }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-indigo-200 transition-all">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
        <p className="text-xs text-slate-400 mt-1">{subtext}</p>
        {trend && <p className="text-xs font-bold text-emerald-500 mt-2 flex items-center gap-1">↑ {trend}</p>}
      </div>
      <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl">
        <Icon size={20} />
      </div>
    </div>
  </div>
);

const ActionCard = ({ title, description, icon: Icon, color, onClick }: { title: string, description: string, icon: any, color: string, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 text-left hover:border-indigo-300 hover:shadow-sm transition-all group"
  >
    <div className={cn("p-3 rounded-xl w-fit transition-transform group-hover:scale-110", color)}>
      <Icon size={24} />
    </div>
    <div>
      <h4 className="font-bold text-slate-900">{title}</h4>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
    </div>
  </button>
);

const LoginPage = ({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
    const body = isSignUp ? { email, password, name } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] shadow-2xl shadow-slate-200 w-full max-w-md p-10 space-y-8"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Sparkles size={32} fill="currentColor" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">AI Marketing Studio</h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-[280px] mx-auto">
              Generate content, manage campaigns, and boost your social presence
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-lg text-center">
              {error}
            </div>
          )}
          
          {isSignUp && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Your name"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Enter your password"
            />
          </div>

          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-blue-100 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>

          <div className="text-center">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [activeView, setActiveView] = useState<View>('dashboard');

  useEffect(() => {
    // Check session on mount
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };
  const [currentStep, setCurrentStep] = useState<Step>('objective');
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const handleCreatePost = () => {
    setActiveView('content-studio');
    setCurrentStep('objective');
  };

  if (!user) {
    return <LoginPage onLoginSuccess={(u) => setUser(u)} />;
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Sparkles size={18} fill="currentColor" />
          </div>
          <h1 className="font-bold text-lg tracking-tight">Marketing Copilot</h1>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeView === 'dashboard'} 
            onClick={() => setActiveView('dashboard')} 
          />
          <SidebarItem 
            icon={Sparkles} 
            label="Content Studio" 
            active={activeView === 'content-studio'} 
            onClick={() => setActiveView('content-studio')} 
          />
          <SidebarItem 
            icon={CalendarIcon} 
            label="Calendar" 
            active={activeView === 'calendar'} 
            onClick={() => setActiveView('calendar')} 
          />
          <SidebarItem 
            icon={FileText} 
            label="Posts" 
            active={activeView === 'posts'} 
            onClick={() => setActiveView('posts')} 
          />
          <SidebarItem 
            icon={Settings} 
            label="Brand Settings" 
            active={activeView === 'brand-settings'} 
            onClick={() => setActiveView('brand-settings')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors text-left group relative">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase">
                {user.name?.substring(0, 2) || 'US'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user.name || 'User'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-rose-500"
              >
                <MoreHorizontal size={14} />
              </button>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-7xl mx-auto space-y-10"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                    <p className="text-slate-500 mt-1">Thursday, February 26, 2026</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                      <Plus size={16} />
                      Add Business
                    </button>
                    <button 
                      onClick={handleCreatePost}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200"
                    >
                      <Sparkles size={16} />
                      Create Post
                    </button>
                  </div>
                </div>

                {/* Action Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <ActionCard 
                    title="Create Post" 
                    description="Generate AI-powered content" 
                    icon={Sparkles} 
                    color="bg-indigo-600 text-white"
                    onClick={handleCreatePost}
                  />
                  <ActionCard 
                    title="Plan Content" 
                    description="Schedule your week" 
                    icon={CalendarIcon} 
                    color="bg-emerald-500 text-white"
                    onClick={() => setActiveView('calendar')}
                  />
                  <ActionCard 
                    title="Edit Drafts" 
                    description="Review saved posts" 
                    icon={FileText} 
                    color="bg-orange-500 text-white"
                    onClick={() => setActiveView('posts')}
                  />
                  <ActionCard 
                    title="Brand Settings" 
                    description="Update your profile" 
                    icon={Settings} 
                    color="bg-slate-700 text-white"
                    onClick={() => setActiveView('brand-settings')}
                  />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Total Posts" value="0" subtext="All time" icon={FileText} />
                  <StatCard label="Scheduled" value="0" subtext="Ready to publish" icon={Clock} />
                  <StatCard label="Published" value="0" subtext="This month" icon={CheckCircle2} />
                  <StatCard label="Engagement" value="0" subtext="Likes & comments" icon={Users} trend="12%" />
                </div>

                {/* Bottom Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <section>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Upcoming Posts</h3>
                        <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                          View all <ArrowRight size={14} />
                        </button>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                          <CalendarIcon size={32} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">No upcoming posts scheduled</p>
                          <p className="text-sm text-slate-400 mt-1">Create your first post to get started</p>
                        </div>
                        <button onClick={handleCreatePost} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold">Create Post</button>
                      </div>
                    </section>

                    <section>
                      <h3 className="font-bold text-lg mb-4">Needs Approval</h3>
                      <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                          <CheckCircle2 size={32} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">All caught up!</p>
                          <p className="text-sm text-slate-400 mt-1">No posts awaiting approval</p>
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-8">
                    <section className="bg-white border border-slate-200 rounded-2xl p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold">February 2026</h3>
                        <div className="flex gap-2">
                          <button className="p-1 text-slate-400 hover:text-slate-900"><ChevronLeft size={16} /></button>
                          <button className="p-1 text-slate-400 hover:text-slate-900"><ChevronRight size={16} /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-2 text-center">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                          <span key={d} className="text-[10px] font-bold text-slate-400 uppercase">{d}</span>
                        ))}
                        {Array.from({ length: 28 }).map((_, i) => (
                          <button 
                            key={i} 
                            className={cn(
                              "h-8 w-8 flex items-center justify-center text-xs rounded-lg transition-colors",
                              i + 1 === 26 ? "bg-indigo-600 text-white font-bold" : "text-slate-600 hover:bg-slate-50"
                            )}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    </section>

                    <section className="bg-white border border-slate-200 rounded-2xl p-6">
                      <h3 className="font-bold mb-4">Recent Activity</h3>
                      <p className="text-sm text-slate-400 text-center py-8">No recent activity</p>
                    </section>
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'content-studio' && (
              <motion.div
                key="content-studio"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-6xl mx-auto"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">AI Content Studio</h2>
                    <p className="text-slate-500 text-sm">Create stunning social media posts in minutes</p>
                  </div>
                  <button className="ml-auto px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">
                    <Plus size={16} className="inline mr-2" /> Add Business
                  </button>
                </div>

                {/* Stepper */}
                <div className="flex items-center justify-center gap-4 mb-12">
                  {[
                    { id: 'objective', label: 'Objective', num: 1 },
                    { id: 'style', label: 'Style', num: 2 },
                    { id: 'create', label: 'Create', num: 3 },
                    { id: 'schedule', label: 'Schedule', num: 4 }
                  ].map((s, i) => (
                    <React.Fragment key={s.id}>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                          currentStep === s.id ? "bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-200" : "bg-slate-100 text-slate-400"
                        )}>
                          {s.num}
                        </div>
                        <span className={cn(
                          "text-sm font-bold",
                          currentStep === s.id ? "text-slate-900" : "text-slate-400"
                        )}>{s.label}</span>
                      </div>
                      {i < 3 && <div className="w-12 h-px bg-slate-200" />}
                    </React.Fragment>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-8">
                    {currentStep === 'objective' && (
                      <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-8">
                        <div>
                          <h3 className="text-lg font-bold">What's your goal?</h3>
                          <p className="text-slate-500 text-sm">Choose the primary objective for this post</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {OBJECTIVES.map((obj) => (
                            <button
                              key={obj.id}
                              onClick={() => setSelectedObjective(obj.id)}
                              className={cn(
                                "p-4 rounded-2xl border transition-all text-left flex flex-col gap-3",
                                selectedObjective === obj.id 
                                  ? "border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600" 
                                  : "border-slate-100 bg-white hover:border-slate-300"
                              )}
                            >
                              <div className={cn("p-2 rounded-lg w-fit", obj.color)}>
                                <obj.icon size={20} />
                              </div>
                              <div>
                                <p className="font-bold text-sm">{obj.label}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{obj.description}</p>
                              </div>
                            </button>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Topic or Offer (optional)</label>
                          <input 
                            type="text" 
                            placeholder="e.g., 20% off all services this weekend"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button 
                            onClick={() => setCurrentStep('style')}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                          >
                            Continue <ArrowRight size={18} />
                          </button>
                        </div>
                      </div>
                    )}

                    {currentStep === 'style' && (
                      <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-8">
                        <div>
                          <h3 className="text-lg font-bold">Describe your vision</h3>
                          <p className="text-slate-500 text-sm">Provide details for the AI to generate your content</p>
                        </div>

                        <textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Describe the visual style, colors, and mood..."
                          className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all resize-none"
                        />

                        <div className="flex justify-between">
                          <button onClick={() => setCurrentStep('objective')} className="px-6 py-3 text-slate-500 font-bold">Back</button>
                          <button 
                            onClick={async () => {
                              setIsGenerating(true);
                              setCurrentStep('create');
                              try {
                                const url = await generateMarketingImage(prompt);
                                setGeneratedUrl(url);
                              } catch (e) {
                                console.error(e);
                              } finally {
                                setIsGenerating(false);
                              }
                            }}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                          >
                            Generate Content
                          </button>
                        </div>
                      </div>
                    )}

                    {currentStep === 'create' && (
                      <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold">Review & Refine</h3>
                            <p className="text-slate-500 text-sm">Make adjustments to your generated post</p>
                          </div>
                          <button onClick={() => setGeneratedUrl(null)} className="text-sm font-bold text-indigo-600">Regenerate</button>
                        </div>

                        {isGenerating ? (
                          <div className="aspect-square bg-slate-50 rounded-2xl flex flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-200">
                            <div className="relative">
                              <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={24} />
                            </div>
                            <p className="font-bold text-slate-900">AI is crafting your post...</p>
                            <p className="text-sm text-slate-400">This usually takes about 10-20 seconds</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                              {generatedUrl && <img src={generatedUrl} alt="Generated" className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex justify-between">
                              <button onClick={() => setCurrentStep('style')} className="px-6 py-3 text-slate-500 font-bold">Back</button>
                              <button onClick={() => setCurrentStep('schedule')} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                                Next: Schedule
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Preview Sidebar */}
                  <div className="space-y-6">
                    <h3 className="font-bold text-center">Preview</h3>
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl max-w-sm mx-auto">
                      <div className="p-4 flex items-center gap-3 border-b border-slate-50">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                          YB
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold">Your Business</p>
                          <p className="text-[10px] text-slate-400">Sponsored</p>
                        </div>
                        <MoreHorizontal size={20} className="text-slate-400" />
                      </div>
                      <div className="aspect-square bg-slate-50 flex items-center justify-center relative">
                        {generatedUrl ? (
                          <img src={generatedUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <p className="text-sm text-slate-300 font-medium">Image preview</p>
                        )}
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-slate-700">
                            <Users size={22} className="cursor-pointer" />
                            <MessageSquare size={22} className="cursor-pointer" />
                            <Send size={22} className="cursor-pointer" />
                          </div>
                          <FileText size={22} className="cursor-pointer" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-bold mr-2">yourbusiness</span>
                            {prompt || "Your caption will appear here..."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'calendar' && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-7xl mx-auto space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">Content Calendar</h2>
                    <p className="text-slate-500 mt-1">Plan and schedule your posts</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                      <Plus size={16} />
                      Add Business
                    </button>
                    <button 
                      onClick={handleCreatePost}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200"
                    >
                      <Sparkles size={16} />
                      New Post
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-bold text-lg">February 2026</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                          <button className="p-2 hover:bg-slate-50 border-r border-slate-200"><ChevronLeft size={18} /></button>
                          <button className="p-2 hover:bg-slate-50"><ChevronRight size={18} /></button>
                        </div>
                        <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold">Today</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 border-b border-slate-100">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7">
                      {Array.from({ length: 35 }).map((_, i) => (
                        <div key={i} className={cn(
                          "h-32 p-3 border-r border-b border-slate-100 hover:bg-slate-50/50 transition-colors relative group",
                          i % 7 === 6 ? "border-r-0" : ""
                        )}>
                          <span className={cn(
                            "text-sm font-medium",
                            i + 1 === 26 ? "bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full" : "text-slate-400"
                          )}>
                            {(i % 31) + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="p-6 bg-slate-50 flex flex-wrap gap-6 border-t border-slate-100">
                      {[
                        { label: 'Draft', color: 'bg-slate-400' },
                        { label: 'Pending Approval', color: 'bg-amber-400' },
                        { label: 'Approved', color: 'bg-emerald-400' },
                        { label: 'Scheduled', color: 'bg-indigo-400' },
                        { label: 'Published', color: 'bg-emerald-600' },
                        { label: 'Failed', color: 'bg-rose-500' }
                      ].map(l => (
                        <div key={l.label} className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", l.color)} />
                          <span className="text-xs font-medium text-slate-500">{l.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 text-left">
                    <h3 className="font-bold">Select a date</h3>
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                      <p className="text-sm text-slate-400">Click on a date to view scheduled posts</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'posts' && (
              <motion.div
                key="posts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-7xl mx-auto space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">Posts</h2>
                    <p className="text-slate-500 mt-1">Manage all your content</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                      <Plus size={16} />
                      Add Business
                    </button>
                    <button 
                      onClick={handleCreatePost}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200"
                    >
                      <Sparkles size={16} />
                      New Post
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search posts..." 
                      className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                    />
                  </div>
                  <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900">
                    <Filter size={20} />
                  </button>
                  <div className="relative">
                    <select className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-600 outline-none cursor-pointer">
                      <option>All Status</option>
                      <option>Draft</option>
                      <option>Scheduled</option>
                      <option>Published</option>
                    </select>
                    <ChevronRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-20 flex flex-col items-center justify-center text-center gap-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                    <CalendarIcon size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">No posts found</h3>
                    <p className="text-slate-400 mt-1">Create your first post to get started</p>
                  </div>
                  <button 
                    onClick={handleCreatePost}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
                  >
                    <Sparkles size={18} />
                    Create Post
                  </button>
                </div>
              </motion.div>
            )}

            {activeView === 'brand-settings' && (
              <motion.div
                key="brand-settings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-7xl mx-auto space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">Brand Settings</h2>
                    <p className="text-slate-500 mt-1">Manage your business profiles</p>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    <Plus size={16} />
                    Add Business
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-20 flex flex-col items-center justify-center text-center gap-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                    <Settings size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">No businesses yet</h3>
                    <p className="text-slate-400 mt-1">Add your first business to start creating content</p>
                  </div>
                  <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2">
                    <Plus size={18} />
                    Add Business
                  </button>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 space-y-4 text-left">
                  <h4 className="font-bold text-indigo-900">Connect Social Accounts</h4>
                  <p className="text-sm text-indigo-700 leading-relaxed max-w-2xl">
                    Connect your Instagram and Facebook accounts to enable auto-publishing. This requires a Meta Business account with appropriate permissions.
                  </p>
                  <p className="text-xs text-indigo-400">Note: Social media integration requires additional setup. Contact support for assistance.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
