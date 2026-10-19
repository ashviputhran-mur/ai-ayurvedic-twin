import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  RefreshCw, 
  ShieldCheck, 
  Activity, 
  LayoutDashboard, 
  User, 
  Settings, 
  Bell,
  Search,
  ChevronRight,
  BrainCircuit,
  ShoppingBag,
  Lock,
  LogOut
} from 'lucide-react';
import { analyzeSkin, SkinAnalysisResult } from './services/geminiService';
import { DigitalTwin } from './components/DigitalTwin';
import { DoshaChart } from './components/DoshaChart';
import { Recommendations } from './components/Recommendations';
import { Forecast } from './components/Forecast';
import { DoctorConsultancy } from './components/DoctorConsultancy';
import { AdminDashboard } from './components/AdminDashboard';
import { ProductCatalog } from './components/ProductCatalog';
import { cn } from './lib/utils';
import { auth, db } from './firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SkinAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        } else {
          const defaultRole = firebaseUser.email === 'ashviputhran@gmail.com' ? 'admin' : 'customer';
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            email: firebaseUser.email,
            role: defaultRole,
            displayName: firebaseUser.displayName
          });
          setUserRole(defaultRole);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    handleAnalyze();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setActiveTab('dashboard');
  };

  const handleAnalyze = async (image?: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeSkin(image || selectedImage || undefined);
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
        setLoading(false);
      }, 1500);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        handleAnalyze(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAF7] text-[#1A1A1A] font-sans selection:bg-[#C5A059]/30 flex overflow-x-hidden">
      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-0 bottom-0 w-[240px] bg-[#1E2D24] text-white flex flex-col py-8 px-6 z-50 border-r border-[#E5E7EB]">
        <div className="flex items-center gap-3 font-bold text-xl tracking-tight mb-12">
          <div className="w-8 h-8 rounded-lg bg-[#C5A059] flex items-center justify-center text-[#1E2D24]">
            <ShieldCheck size={20} />
          </div>
          AyurTwin AI
        </div>
        
        <div className="flex-1 flex flex-col gap-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'shop', icon: ShoppingBag, label: 'AyurShop' },
            { id: 'activity', icon: Activity, label: 'Insights' },
            { id: 'consultancy', icon: BrainCircuit, label: 'Consultancy' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "sidebar-item",
                activeTab === item.id && "active"
              )}
            >
              <item.icon size={20} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}

          {userRole === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={cn(
                "sidebar-item",
                activeTab === 'admin' && "active"
              )}
            >
              <Lock size={20} />
              <span className="text-sm">Admin Panel</span>
            </button>
          )}
        </div>

        <div className="mt-auto pt-8 border-t border-white/10">
          {user ? (
            <div className="space-y-4 px-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#C5A059] flex items-center justify-center text-[10px] font-bold text-[#1E2D24]">
                  {user.displayName?.[0] || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{user.displayName}</div>
                  <div className="text-[10px] text-white/50 uppercase tracking-widest">{userRole}</div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="w-full accent-button text-xs py-3"
            >
              Connect Identity
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="ml-[240px] flex-1 min-h-screen relative">
        {/* Header */}
        <header className="h-24 border-b border-[#E5E7EB] flex items-center justify-between px-12 sticky top-0 bg-[#F9FAF7]/80 backdrop-blur-md z-40">
          <div>
            <h1 className="text-2xl font-semibold text-[#1E2D24]">
              {activeTab === 'dashboard' ? 'Predictive Health Dashboard' : 
               activeTab === 'shop' ? 'Ayurvedic Marketplace' : 
               activeTab === 'admin' ? 'Inventory Control' : 'System Insights'}
            </h1>
            <p className="text-sm text-[#6B7280]">
              {activeTab === 'dashboard' ? `Real-time Ayurvedic Biometric Twin for ${user?.displayName || 'Guest'}` : 
               activeTab === 'shop' ? 'Curated remedies based on your twin analysis' : 
               activeTab === 'admin' ? 'Manage product stock and ingredients' : 'Deep biological metrics'}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <div className="font-semibold text-sm">System Status: Optimized</div>
              <div className="text-xs text-[#4C6B5F]">Twin Synchronized</div>
            </div>
            <button 
              onClick={() => document.getElementById('skin-upload')?.click()}
              className="accent-button flex items-center gap-2"
              disabled={isAnalyzing}
            >
              <Camera size={16} />
              {isAnalyzing ? "Analyzing..." : "Upload Skin Photo"}
            </button>
            <input 
              id="skin-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <button 
              onClick={() => handleAnalyze()}
              className="p-3 rounded-xl bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#C5A059] transition-all"
              disabled={isAnalyzing}
            >
              <RefreshCw size={16} className={isAnalyzing ? "animate-spin" : ""} />
            </button>
          </div>
        </header>

        <div className="p-10 max-w-[1400px] mx-auto">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[60vh] flex flex-col items-center justify-center text-center"
              >
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-[#C5A059]/20 rounded-full" />
                  <motion.div
                    className="absolute inset-0 border-4 border-t-[#C5A059] rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <h2 className="text-xl font-bold text-[#1E2D24]">Synchronizing Biometric Data</h2>
                <p className="text-[#6B7280] text-sm mt-2">Connecting to GenAI Predictive Engine...</p>
              </motion.div>
            ) : activeTab === 'dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-12 gap-8"
              >
                {/* Center Column: Digital Twin */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                  <div className="relative glass-panel p-8 flex flex-col overflow-hidden">
                    <div className="scanline pointer-events-none" />
                    
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <div className="text-[11px] uppercase tracking-widest text-[#6B7280] font-bold mb-1">Vata-Pitta-Kapha Biometric Map</div>
                        <div className="text-xs text-[#4C6B5F] font-medium flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-[#4C6B5F] rounded-full animate-pulse" />
                          GenAI Predictive Active
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] uppercase tracking-widest text-[#6B7280] font-bold mb-1">Subject ID</div>
                        <div className="text-sm font-mono font-bold text-[#1E2D24]">AS-9928-X</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center py-10 relative">
                      <DigitalTwin />
                      
                      {selectedImage && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute bottom-0 left-0 w-32 h-32 rounded-2xl border-4 border-white shadow-2xl overflow-hidden z-20"
                        >
                          <img src={selectedImage} alt="Skin Sample" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                          >
                            <RefreshCw size={12} />
                          </button>
                        </motion.div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                      {[
                        { label: 'Vagus Nerve Tone', value: '88%', trend: '+2%', trendColor: 'text-[#C5A059]' },
                        { label: 'Inflammation Index', value: 'Low', trend: '', trendColor: '' },
                        { label: 'Ojas Vitality Score', value: '9.2/10', trend: '', trendColor: '' },
                        { label: 'Sleep Quality (AI)', value: '7h 45m', trend: '', trendColor: '' },
                      ].map((stat, i) => (
                        <div key={i} className="p-4 rounded-xl bg-[#F9FAF7] border border-[#E5E7EB]">
                          <div className="text-[10px] uppercase text-[#6B7280] font-bold mb-1">{stat.label}</div>
                          <div className="text-lg font-bold text-[#4C6B5F]">
                            {stat.value}
                            {stat.trend && <span className={cn("text-[10px] ml-1", stat.trendColor)}>{stat.trend}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <section className="tech-card">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[11px] uppercase tracking-widest text-[#6B7280] font-bold">Personalized Treatment Plan</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {data?.treatmentPlan.map((plan, i) => (
                        <div key={i} className="space-y-4">
                          <div className="text-xs font-bold text-[#4C6B5F] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">{plan.category}</div>
                          <ul className="space-y-3">
                            {plan.items.map((item, j) => (
                              <li key={j} className="text-sm text-[#1A1A1A] flex items-start gap-2">
                                <ChevronRight size={14} className="text-[#C5A059] mt-0.5 shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Right Column: Side Panel */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                  <section className="tech-card">
                    <div className="text-[11px] uppercase tracking-widest text-[#6B7280] font-bold mb-6">Dosha Analysis</div>
                    <DoshaChart data={data?.dosha || { vata: 33, pitta: 33, kapha: 34 }} />
                    <p className="text-[11px] text-[#6B7280] mt-6 leading-relaxed">
                      AI Recommendation: Increase Pitta-pacifying foods for the next 48 hours to maintain twin balance.
                    </p>
                  </section>

                  <section className="bg-[#1E2D24] text-white rounded-[24px] p-6 shadow-lg">
                    <DoctorConsultancy />
                  </section>

                  <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6">
                    <div className="text-[11px] uppercase tracking-widest text-[#6B7280] font-bold mb-4">Next Predictive Event</div>
                    <div className="flex justify-between items-end">
                      <div className="text-xl font-bold text-[#1E2D24]">Digestive Peak</div>
                      <div className="text-sm text-[#C5A059] font-bold">In 2h 40m</div>
                    </div>
                  </div>

                  <section className="tech-card">
                    <div className="text-[11px] uppercase tracking-widest text-[#6B7280] font-bold mb-6">Skin Health Forecast</div>
                    <Forecast {...(data?.forecast || { current: "Stable", future: "Optimizing", prediction: "Maintaining balance" })} />
                  </section>
                </div>
              </motion.div>
            ) : activeTab === 'shop' ? (
              <motion.div
                key="shop"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <ProductCatalog recommendedRemedies={data?.treatmentPlan.flatMap(p => p.items)} />
              </motion.div>
            ) : activeTab === 'admin' ? (
              <motion.div
                key="admin"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <AdminDashboard />
              </motion.div>
            ) : (
              <div className="p-20 text-center text-[#6B7280]">Content for {activeTab} coming soon...</div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
