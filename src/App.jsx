import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useProteinData } from './hooks/useProteinData';
import { ProgressRing } from './components/ProgressRing';
import { AddEntryModal } from './components/AddEntryModal';
import { HistoryList } from './components/HistoryList';
import { TabBar } from './components/TabBar';
import { CalendarView } from './components/CalendarView';
import { ChartsView } from './components/ChartsView';
import { FullHistoryView } from './components/FullHistoryView';
import { VoiceEntryButton } from './components/VoiceEntryButton';
import { EditEntryModal } from './components/EditEntryModal';
import { AuthView } from './components/AuthView';
import { OnboardingView } from './components/OnboardingView';
import { ProfileView } from './components/ProfileView';
import { FloatingDecorations } from './components/FloatingDecorations';
import { EmptyState } from './components/EmptyState';
import { Logo } from './components/Logo';
import { Plus, Sun, Moon, ChevronLeft, ChevronRight, UserCircle, Inbox, LogOut, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from './utils/audio';
import { useAuth } from './contexts/AuthContext';
import { getNow, getLocalString, formatLocal } from './utils/date';
import { subDays, addDays } from 'date-fns';

export default function App() {
  const { entries, goal, addEntry, removeEntry, editEntry, getEntriesForDay, getTotalForDay } = useProteinData();
  const { user, profile, loading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null); // Holds the entry object being edited
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('protein-tracker-tab') || 'today';
  });
  const [selectedPastDate, setSelectedPastDate] = useState(null);
  const [dashboardDate, setDashboardDate] = useState(getNow());

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('protein-tracker-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('protein-tracker-theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    if (!user) {
      setActiveTab('today');
      setSelectedPastDate(null);
      setDashboardDate(getNow());
    }
  }, [user]);

  const isActuallyToday = formatLocal(dashboardDate, 'yyyy-MM-dd') === formatLocal(getNow(), 'yyyy-MM-dd');
  const dailyTotal = getTotalForDay(dashboardDate);
  const todaysEntries = getEntriesForDay(dashboardDate);

  const handleDelete = (id) => {
    playSound('delete');
    removeEntry(id);
  };

  const handleEditOpen = (entry) => {
    playSound('edit');
    setEditingEntry(entry);
  };

  const handleAddSubmit = (amount, label) => {
    const targetDate = activeTab === 'today' ? dashboardDate : ((activeTab === 'calendar' && selectedPastDate) ? selectedPastDate : getNow());
    const targetDailyTotal = getTotalForDay(targetDate);

    const isGoalReached = targetDailyTotal < goal && (targetDailyTotal + Number(amount)) >= goal;

    if (isGoalReached) {
      playSound('achieve');
      // Fire massive confetti for reaching the goal!
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ff2d55', '#34c759', '#007aff', '#ffcc00']
      });
    } else {
      playSound('add');
      // Fire localized entry confetti
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ff2d55', '#ffffff']
      });
    }

    addEntry(amount, label, targetDate);
    setIsAddOpen(false);
  };

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>Loading Auth...</div>;

  if (!user) return <AuthView />;

  if (profile && (!profile.username || !profile.dob)) return <OnboardingView />;

  return (
    <div className={`app-container ${isDark ? 'dark' : ''}`}>
      <FloatingDecorations activeTab={activeTab} />

      {/* Dynamic Content Based on Tab */}
      <div className="main-content">
        {/* Global Unified Header */}
        <header style={{
          padding: 'env(safe-area-inset-top, 24px) 24px 0 24px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: activeTab === 'profile' ? '0' : '8px',
          zIndex: 50,
          position: 'relative'
        }}>
          {activeTab !== 'profile' && (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Logo size="small" onClick={() => { playSound('pop'); setActiveTab('today'); setDashboardDate(getNow()); }} />

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', borderLeft: '1px solid var(--border-glass)', paddingLeft: '16px' }}>
                <button onClick={() => setIsDark(!isDark)}
                  className="flex-center"
                  style={{ background: 'var(--bg-surface-elevated)', border: 'none', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', color: 'var(--text-primary)', boxShadow: 'var(--shadow-sm)' }}
                >
                  {isDark ? <Sun size={22} /> : <Moon size={22} />}
                </button>
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => { playSound('pop'); setIsDropdownOpen(!isDropdownOpen); }}
                    style={{ background: 'var(--accent-protein)', border: 'none', width: '44px', height: '44px', borderRadius: '22px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', padding: 0 }}
                  >
                    {profile?.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      profile?.username ? profile.username.charAt(0).toUpperCase() : <UserCircle size={24} />
                    )}
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="glass-panel"
                        style={{
                          position: 'absolute',
                          top: '56px',
                          right: 0,
                          width: '240px',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          padding: '8px 0',
                          zIndex: 100,
                        }}
                      >
                        <button
                          onClick={() => { playSound('pop'); setIsDropdownOpen(false); setActiveTab('profile'); }}
                          className="dropdown-item"
                          style={{ background: 'transparent', border: 'none', width: '100%', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: 'var(--text-primary)', textAlign: 'left', borderBottom: '1px solid var(--border-glass-light)' }}
                        >
                          <Edit2 size={20} className="text-muted" />
                          <span style={{ fontSize: '15px', fontWeight: '500' }}>Manage Profile</span>
                        </button>
                        <button
                          onClick={() => { playSound('pop'); setIsDropdownOpen(false); logout(); }}
                          className="dropdown-item"
                          style={{ background: 'transparent', border: 'none', width: '100%', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: 'var(--accent-protein)', textAlign: 'left' }}
                        >
                          <LogOut size={20} />
                          <span style={{ fontSize: '15px', fontWeight: '500' }}>Sign out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'today' && (
            <motion.div
              key="today"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <header className="px-4" style={{ paddingTop: '8px', paddingRight: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => { playSound('pop'); setDashboardDate(subDays(dashboardDate, 1)); }}
                      className="flex-center"
                      style={{ background: 'var(--bg-surface-elevated)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', color: 'var(--text-primary)', marginLeft: '-8px' }}
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-title-1">{isActuallyToday ? 'Today' : getLocalString(dashboardDate, { weekday: 'long' })}</h1>
                    <button
                      onClick={() => { playSound('pop'); setDashboardDate(addDays(dashboardDate, 1)); }}
                      className="flex-center"
                      disabled={isActuallyToday}
                      style={{ background: 'var(--bg-surface-elevated)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: isActuallyToday ? 'default' : 'pointer', color: isActuallyToday ? 'var(--text-tertiary)' : 'var(--text-primary)', opacity: isActuallyToday ? 0.3 : 1 }}
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                  <p className="text-subheadline text-muted" style={{ paddingLeft: '32px' }}>
                    {getLocalString(dashboardDate, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </header>

              <main className="p-4 desktop-dashboard-grid">
                <section className="flex-center card" style={{ padding: '40px 20px', flexDirection: 'column' }}>
                  <ProgressRing progress={dailyTotal} goal={goal} size={240} />
                  <div className="mt-4 flex-center" style={{ flexDirection: 'column', gap: '4px' }}>
                    <p className="text-headline">Daily Goal</p>
                    <p className="text-subheadline text-muted">Aiming for {goal}g</p>
                  </div>
                </section>

                {/* Log History (Limited to 3) */}
                <div style={{ marginTop: '0px' }}>
                  <h2 className="text-title-2" style={{ marginBottom: '16px' }}>Log</h2>
                  <HistoryList
                    entries={todaysEntries.slice(0, 3)}
                    onDelete={handleDelete}
                    onEdit={handleEditOpen}
                  />
                  {todaysEntries.length > 3 && (
                    <p className="text-footnote" style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-tertiary)' }}>
                      +{todaysEntries.length - 3} more. See History tab.
                    </p>
                  )}
                </div>
              </main>
            </motion.div>
          )}

          {activeTab === 'charts' && (
            <motion.div
              key="charts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ChartsView entries={entries} goal={goal} />
            </motion.div>
          )}

          {activeTab === 'calendar' && !selectedPastDate && (
            <motion.div
              key="calendar-grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CalendarView
                entries={entries}
                goal={goal}
                onDateSelect={(date) => {
                  playSound('pop');
                  setSelectedPastDate(date);
                }}
              />
            </motion.div>
          )}

          {activeTab === 'calendar' && selectedPastDate && (
            <motion.div
              key="calendar-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <header className="p-4 flex-between" style={{ paddingTop: 'env(safe-area-inset-top, 20px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => { playSound('pop'); setSelectedPastDate(null); }}
                    className="flex-center"
                    style={{ background: 'transparent', border: 'none', padding: '8px', cursor: 'pointer', marginLeft: '-8px' }}
                  >
                    <ChevronLeft size={28} color="var(--accent-blue)" />
                  </button>
                  <div>
                    <h1 className="text-title-2">Log Details</h1>
                    <p className="text-subheadline text-muted">
                      {getLocalString(selectedPastDate, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </header>

              <main className="p-4 desktop-dashboard-grid">
                <section className="flex-center card" style={{ padding: '40px 20px', flexDirection: 'column' }}>
                  <ProgressRing progress={getTotalForDay(selectedPastDate)} goal={goal} size={240} />
                  <div className="mt-4 flex-center" style={{ flexDirection: 'column', gap: '4px' }}>
                    <p className="text-headline">Daily Goal</p>
                    <p className="text-subheadline text-muted">Aimed for {goal}g</p>
                  </div>
                </section>

                <div style={{ marginTop: '0px' }}>
                  <h2 className="text-title-2" style={{ marginBottom: '16px' }}>Logs</h2>
                  <HistoryList
                    entries={getEntriesForDay(selectedPastDate)}
                    onDelete={handleDelete}
                    onEdit={handleEditOpen}
                  />
                  {getEntriesForDay(selectedPastDate).length === 0 && (
                    <EmptyState
                      icon={Inbox}
                      title="No Entries"
                      message="You didn't log any protein on this date. Keep tracking to build your history!"
                    />
                  )}
                </div>
              </main>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <FullHistoryView
                entries={entries}
                onDelete={handleDelete}
                onEdit={handleEditOpen}
              />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ProfileView onBack={() => setActiveTab('today')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button - Show on specific logging views */}
      {(activeTab === 'today' || (activeTab === 'calendar' && selectedPastDate)) && (
        <div style={{ position: 'fixed', bottom: '100px', right: '20px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <VoiceEntryButton onEntryParsed={(amount, label) => handleAddSubmit(amount, label)} />
          <button
            className="btn-primary shadow-lg flex-center"
            style={{ padding: '16px 24px', borderRadius: '30px', gap: '8px' }}
            onClick={() => { playSound('pop'); setIsAddOpen(true); }}
          >
            <Plus size={24} />
            <span className="text-headline">Log Protein</span>
          </button>
        </div>
      )}

      {activeTab !== 'profile' && (
        <TabBar activeTab={activeTab} onTabChange={(tab) => {
          playSound('tab');
          if (tab === 'calendar') {
            setSelectedPastDate(null);
          }
          if (tab === 'today') {
            setDashboardDate(getNow());
          }
          setActiveTab(tab);
          localStorage.setItem('protein-tracker-tab', tab);
        }} />
      )}

      <AddEntryModal
        isOpen={isAddOpen}
        onClose={() => {
          playSound('pop');
          setIsAddOpen(false);
        }}
        onSave={(amount, label) => handleAddSubmit(amount, label)}
      />

      <EditEntryModal
        isOpen={!!editingEntry}
        entryToEdit={editingEntry}
        onClose={() => setEditingEntry(null)}
        onSave={(id, amount, label) => {
          editEntry(id, amount, label);
          setEditingEntry(null); // Close modal after saving
        }}
      />
    </div>
  );
}
