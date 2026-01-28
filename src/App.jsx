import { useState, useEffect, useCallback } from 'react';
import logo from './assets/logo.png'

const PILLARS = {
  connect: {
    name: 'CONNECT',
    subtitle: 'Relationships • Network • Events • Introductions',
    color: '#C91433',
    description: 'The relationships. Your peer network, introductions, the people you call when you need advice or a referral. Some of us know many people in the industry. Some feel isolated. Most are somewhere in between — we know people, but not always the right people for every situation.',
    keyQuestion: 'What kind of connections and events would be most valuable to you?',
    questions: [
      { q: 'What kind of person do you wish you had in your network?', ex: 'A lawyer who knows STR, a revenue manager, someone who\'s exited a portfolio...' },
      { q: 'Best professional relationship — how did it happen?', ex: 'Met at a conference, introduced by a friend, same WhatsApp group...' },
      { q: 'What type of events would you actually attend?', ex: 'Small breakfast (20 ppl), large mixer (100+), topic workshop, dinner with speakers...' },
      { q: 'Structured introductions or organic networking?', ex: '"We match you with 3 relevant people" vs. "Here\'s a room, go mingle"' },
      { q: 'Would you value connections beyond Dubai?', ex: 'Abu Dhabi operators, Saudi contacts, GCC-wide, international...' },
      { q: 'Adjacent players — valuable or distraction?', ex: 'Tech vendors, investors, developers, tourism boards, interior designers...' }
    ]
  },
  learn: {
    name: 'LEARN',
    subtitle: 'Knowledge • Content • Data • Insights',
    color: '#2C5F2D',
    description: 'The knowledge. Events, webinars, reports, market data, regulatory updates. Staying ahead instead of catching up. Understanding what\'s working for others, what\'s changing in the market, and where the industry is heading.',
    keyQuestion: 'What do you need to learn to run your business better? How do you want to learn it?',
    questions: [
      { q: 'What topic do you wish you understood better?', ex: 'Revenue management, DET regulations, scaling operations, hiring, tech stack...' },
      { q: 'Where do you currently go for answers?', ex: 'Google, WhatsApp groups, call a friend, consultants, figure it out alone...' },
      { q: 'What format actually works for you to learn?', ex: 'In-person workshop, webinar replay, written guide, peer roundtable, 1:1 mentoring...' },
      { q: 'Comfortable learning from / sharing with competitors?', ex: '"Yes, we all benefit" vs. "Depends on topic" vs. "No, competitive advantage"' },
      { q: 'Market data — would you pay? Would you share yours?', ex: 'Occupancy benchmarks, ADR by area, supply trends, seasonal patterns...' },
      { q: 'Who would you want to learn from?', ex: 'Other operators, bigger players, outside experts, government, tech vendors...' }
    ]
  },
  elevate: {
    name: 'ELEVATE',
    subtitle: 'Growth • Credibility • Advocacy • Opportunity',
    color: '#D4AF37',
    description: 'The growth. Business opportunities, partnerships, credibility, recognition. Rising together as an industry. Having a collective voice that matters. Getting access to opportunities that don\'t come to individuals operating alone.',
    keyQuestion: 'What does "elevation" mean for you? How could this club help you get there?',
    questions: [
      { q: 'Where do you want to be in 2-3 years?', ex: 'Double portfolio, expand to new emirates, build a team, exit/sell, become market leader...' },
      { q: 'What\'s holding you back from growing right now?', ex: 'Capital, finding good staff, knowledge gaps, too busy operating, regulations...' },
      { q: 'How important is industry credibility and official recognition?', ex: '"Banks take me seriously", "Developers trust me", "Nice to have", "Doesn\'t matter"' },
      { q: 'Does having a collective voice on regulations matter?', ex: 'Input on licensing, tax policy discussions, representation to DET/DTCM...' },
      { q: 'Would you value business opportunities through the club?', ex: 'Investor intros, developer partnerships, expansion opps, M&A, supplier deals...' },
      { q: 'Recognition — awards, speaking, case studies?', ex: '"Would love it", "Good for my brand", "Not my thing", "Only if it brings business"' }
    ]
  }
};

// Membership features organized by category for vertical display
const MEMBERSHIP_FEATURES = [
  { category: 'Events & Networking', features: [
    { name: 'Monthly STR Club Breakfasts', basic: 'AED 200/event', silver: '✓ Included', platinum: '✓ Included' },
    { name: 'Executive Roundtable Dinners', basic: '—', silver: '—', platinum: '4 per year' },
  ]},
  { category: 'Learning & Content', features: [
    { name: 'Monthly Industry Newsletter', basic: '✓', silver: '✓', platinum: '✓' },
    { name: 'Expert-led Webinars', basic: '1 per quarter', silver: '1 per quarter', platinum: 'Unlimited' },
    { name: 'Expert Masterclasses (90 min)', basic: '—', silver: '2 per year', platinum: 'Unlimited' },
    { name: '1:1 Strategy Session', basic: '—', silver: '—', platinum: '1 per year (FREE)' },
  ]},
  { category: 'Data & Reports', features: [
    { name: 'Quarterly Industry Reports', basic: '—', silver: '✓', platinum: 'Early Access' },
  ]},
  { category: 'SCALE Conference', features: [
    { name: 'Early-Bird Access', basic: '—', silver: '48-72h priority', platinum: '48-72h priority' },
    { name: 'Member Discount', basic: '—', silver: '25% off', platinum: '50% off' },
  ]},
  { category: 'Community Access', features: [
    { name: 'Main WhatsApp Group', basic: '✓', silver: '✓', platinum: '✓' },
    { name: 'Working Groups (by topic/role)', basic: '—', silver: '✓', platinum: '✓' },
    { name: 'Member Directory', basic: '—', silver: '✓', platinum: '✓' },
    { name: 'Priority Moderator Support', basic: '—', silver: '✓', platinum: '✓' },
  ]},
  { category: 'Business & Growth', features: [
    { name: 'Partner Discounts & Benefits', basic: '—', silver: '✓', platinum: '✓' },
    { name: 'Curated Business Introductions', basic: '—', silver: '—', platinum: '✓' },
    { name: 'Executive Recognition & Visibility', basic: '—', silver: '—', platinum: '✓' },
  ]},
];

const MEMBERSHIP_TIERS = {
  basic: { name: 'Basic', price: 'Free', color: '#666666', target: 'Entry-level access', stripeLink: '' },
  silver: { name: 'Silver', price: '2,400 AED/year', color: '#A8A8A8', target: 'Active professionals', stripeLink: '' },
  platinum: { name: 'Platinum', price: '5,900 AED/year', color: '#D4AF37', target: 'Senior executives', stripeLink: '' },
};

const MAX_SUBMISSIONS_PER_PILLAR = 3;
const MAX_VOTES_PER_PILLAR = 3;

export default function STRClubRoundtable() {
  const [currentView, setCurrentView] = useState('home');
  const [activePillar, setActivePillar] = useState(null);
  const [ideas, setIdeas] = useState({ connect: [], learn: [], elevate: [] });
  const [newIdea, setNewIdea] = useState('');
  const [user, setUser] = useState({ name: '', email: '', company: '' });
  const [userVotes, setUserVotes] = useState({});
  const [userSubmissions, setUserSubmissions] = useState({ connect: 0, learn: 0, elevate: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [phase, setPhase] = useState({ connect: 'submit', learn: 'submit', elevate: 'submit' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [visitorId, setVisitorId] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [allVotes, setAllVotes] = useState({});
  const [regForm, setRegForm] = useState({ name: '', email: '', company: '' });
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const ideasResult = await window.storage.get('str-club-ideas-v2', true);
      if (ideasResult?.value) setIdeas(JSON.parse(ideasResult.value));
    } catch (e) {}

    try {
      const phaseResult = await window.storage.get('str-club-phase', true);
      if (phaseResult?.value) setPhase(JSON.parse(phaseResult.value));
    } catch (e) {}

    try {
      const attendeesResult = await window.storage.get('str-club-attendees', true);
      if (attendeesResult?.value) setAttendees(JSON.parse(attendeesResult.value));
    } catch (e) {}

    try {
      const allVotesResult = await window.storage.get('str-club-all-votes', true);
      if (allVotesResult?.value) setAllVotes(JSON.parse(allVotesResult.value));
    } catch (e) {}
    
    try {
      let vid = localStorage.getItem('str-visitor-id');
      if (!vid) {
        vid = `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('str-visitor-id', vid);
      }
      setVisitorId(vid);
      
      const userResult = await window.storage.get(`str-club-user-${vid}`, false);
      if (userResult?.value) {
        const userData = JSON.parse(userResult.value);
        setUser(userData);
        setRegForm(userData);
      }

      const votesResult = await window.storage.get(`str-club-votes-${vid}`, false);
      if (votesResult?.value) setUserVotes(JSON.parse(votesResult.value));

      const subsResult = await window.storage.get(`str-club-subs-${vid}`, false);
      if (subsResult?.value) setUserSubmissions(JSON.parse(subsResult.value));
    } catch (e) {}
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [loadData]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      setIsAdmin(true);
    }
  }, []);

  const saveIdeas = async (newIdeas) => {
    setIdeas(newIdeas);
    try { await window.storage.set('str-club-ideas-v2', JSON.stringify(newIdeas), true); } catch (e) {}
  };

  const savePhase = async (newPhase) => {
    setPhase(newPhase);
    try { await window.storage.set('str-club-phase', JSON.stringify(newPhase), true); } catch (e) {}
  };

  const saveVotes = async (newVotes) => {
    setUserVotes(newVotes);
    try {
      await window.storage.set(`str-club-votes-${visitorId}`, JSON.stringify(newVotes), false);
      const newAllVotes = { ...allVotes, [visitorId]: newVotes };
      setAllVotes(newAllVotes);
      await window.storage.set('str-club-all-votes', JSON.stringify(newAllVotes), true);
    } catch (e) {}
  };

  const saveSubmissions = async (newSubs) => {
    setUserSubmissions(newSubs);
    try { await window.storage.set(`str-club-subs-${visitorId}`, JSON.stringify(newSubs), false); } catch (e) {}
  };

  const saveUser = async (userData) => {
    setUser(userData);
    try {
      await window.storage.set(`str-club-user-${visitorId}`, JSON.stringify(userData), false);
      const attendeesResult = await window.storage.get('str-club-attendees', true);
      let atts = [];
      if (attendeesResult?.value) atts = JSON.parse(attendeesResult.value);
      const existingIndex = atts.findIndex(a => a.visitorId === visitorId);
      if (existingIndex >= 0) atts[existingIndex] = { ...userData, visitorId };
      else atts.push({ ...userData, visitorId });
      setAttendees(atts);
      await window.storage.set('str-club-attendees', JSON.stringify(atts), true);
    } catch (e) {}
  };

  const handleRegister = async () => {
    if (!regForm.name.trim() || !regForm.email.trim() || !regForm.company.trim()) return;
    await saveUser(regForm);
  };

  const submitIdea = async () => {
    if (!newIdea.trim() || !activePillar) return;
    if (userSubmissions[activePillar] >= MAX_SUBMISSIONS_PER_PILLAR) return;
    if (phase[activePillar] !== 'submit') return;
    
    const idea = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: newIdea.trim(),
      authorName: user.name,
      authorCompany: user.company,
      authorEmail: user.email,
      votes: 0,
      timestamp: Date.now()
    };
    
    const newIdeas = { ...ideas, [activePillar]: [...ideas[activePillar], idea] };
    const newSubs = { ...userSubmissions, [activePillar]: userSubmissions[activePillar] + 1 };
    
    await saveIdeas(newIdeas);
    await saveSubmissions(newSubs);
    setNewIdea('');
  };

  const voteForIdea = async (pillar, ideaId) => {
    if (phase[pillar] !== 'vote') return;
    const voteKey = `${pillar}-${ideaId}`;
    
    if (userVotes[voteKey]) {
      const newVotes = { ...userVotes };
      delete newVotes[voteKey];
      await saveVotes(newVotes);
      const newIdeas = { ...ideas, [pillar]: ideas[pillar].map(i => i.id === ideaId ? { ...i, votes: Math.max(0, i.votes - 1) } : i) };
      await saveIdeas(newIdeas);
    } else {
      const pillarVotes = Object.entries(userVotes).filter(([k, v]) => k.startsWith(pillar) && v).length;
      if (pillarVotes < MAX_VOTES_PER_PILLAR) {
        const newVotes = { ...userVotes, [voteKey]: true };
        await saveVotes(newVotes);
        const newIdeas = { ...ideas, [pillar]: ideas[pillar].map(i => i.id === ideaId ? { ...i, votes: i.votes + 1 } : i) };
        await saveIdeas(newIdeas);
      }
    }
  };

  const getVotesRemaining = (pillar) => MAX_VOTES_PER_PILLAR - Object.entries(userVotes).filter(([k, v]) => k.startsWith(pillar) && v).length;
  const getSubmissionsRemaining = (pillar) => MAX_SUBMISSIONS_PER_PILLAR - (userSubmissions[pillar] || 0);

  const toggleAllPhase = async () => {
    const allSubmit = Object.values(phase).every(p => p === 'submit');
    const newPhase = allSubmit 
      ? { connect: 'vote', learn: 'vote', elevate: 'vote' }
      : { connect: 'submit', learn: 'submit', elevate: 'submit' };
    await savePhase(newPhase);
  };

  const getCurrentGlobalPhase = () => {
    const allSubmit = Object.values(phase).every(p => p === 'submit');
    const allVote = Object.values(phase).every(p => p === 'vote');
    if (allSubmit) return 'submit';
    if (allVote) return 'vote';
    return 'mixed';
  };

  const exportToCSV = () => {
    let ideasCSV = 'Pillar,Idea,Author Name,Author Company,Author Email,Votes\n';
    Object.entries(ideas).forEach(([pillar, pillarIdeas]) => {
      pillarIdeas.forEach(idea => {
        ideasCSV += `"${PILLARS[pillar].name}","${idea.text.replace(/"/g, '""')}","${idea.authorName}","${idea.authorCompany}","${idea.authorEmail}",${idea.votes}\n`;
      });
    });

    let attendeesCSV = 'Name,Email,Company\n';
    attendees.forEach(a => { attendeesCSV += `"${a.name}","${a.email}","${a.company}"\n`; });

    let votesCSV = 'Voter,Pillar,Idea Voted For\n';
    Object.entries(allVotes).forEach(([odorId, votes]) => {
      const voter = attendees.find(a => a.visitorId === odorId);
      const voterName = voter ? `${voter.name} (${voter.company})` : visitorId;
      Object.entries(votes).forEach(([voteKey, voted]) => {
        if (voted) {
          const [pillar, ...rest] = voteKey.split('-');
          const ideaId = rest.join('-');
          const idea = ideas[pillar]?.find(i => i.id === ideaId);
          const ideaText = idea?.text || ideaId;
          votesCSV += `"${voterName}","${PILLARS[pillar]?.name || pillar}","${ideaText.replace(/"/g, '""')}"\n`;
        }
      });
    });

    const combined = `=== IDEAS ===\n${ideasCSV}\n\n=== ATTENDEES ===\n${attendeesCSV}\n\n=== VOTES BREAKDOWN ===\n${votesCSV}`;
    const blob = new Blob([combined], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `STR_Club_Roundtable_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetAllData = async () => {
    if (!confirm('⚠️ Are you sure you want to delete ALL data?\n\nThis will remove:\n- All ideas\n- All votes\n- All attendees\n\nThis cannot be undone!')) return;
    
    try {
      await window.storage.delete('str-club-ideas-v2', true);
      await window.storage.delete('str-club-phase', true);
      await window.storage.delete('str-club-attendees', true);
      await window.storage.delete('str-club-all-votes', true);
      
      // Reset local state
      setIdeas({ connect: [], learn: [], elevate: [] });
      setPhase({ connect: 'submit', learn: 'submit', elevate: 'submit' });
      setAttendees([]);
      setAllVotes({});
      setUserVotes({});
      setUserSubmissions({ connect: 0, learn: 0, elevate: 0 });
      
      alert('✅ All data has been reset!');
    } catch (e) {
      alert('Error resetting data: ' + e.message);
    }
  };

  // Floating Admin Panel (only for #admin)
  const AdminPanel = () => {
    if (!isAdmin) return null;
    return (
      <>
        <button onClick={() => setShowAdminPanel(!showAdminPanel)}
          className="fixed bottom-20 right-4 z-50 bg-yellow-500 text-black w-12 h-12 rounded-full shadow-lg flex items-center justify-center font-bold text-xl hover:bg-yellow-400 transition">
          ⚙️
        </button>
        {showAdminPanel && (
          <div className="fixed bottom-36 right-4 z-50 bg-gray-900 border border-yellow-500 rounded-xl p-4 shadow-2xl w-72">
            <div className="flex justify-between items-center mb-3">
              <span className="text-yellow-500 font-bold">Admin</span>
              <button onClick={() => setShowAdminPanel(false)} className="text-gray-500 hover:text-white">✕</button>
            </div>
            <button onClick={exportToCSV} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition mb-2">
              📥 Export CSV
            </button>
            <button onClick={resetAllData} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium transition mb-2">
              🗑️ Reset All Data
            </button>
            <div className="text-xs text-gray-400">{attendees.length} attendees • {Object.values(ideas).flat().length} ideas</div>
          </div>
        )}
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Registration screen - only show if user wants to participate (submit/vote)
  // For now, allow browsing without sign-in

  // About view
  if (currentView === 'about') {
    return (
      <div className="min-h-screen bg-gray-900 text-white pb-16">
        <div className="h-2 bg-gradient-to-r from-[#C91433] via-[#2C5F2D] to-[#D4AF37]" />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <button onClick={() => setCurrentView('home')} className="text-gray-400 hover:text-white transition mb-6">← Back</button>
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif font-bold mb-4">What We're Building Together</h1>
            <p className="text-xl text-gray-400">The STR Club is built around three pillars</p>
          </div>
          <div className="space-y-6">
            {Object.entries(PILLARS).map(([key, pillar]) => (
              <div key={key} className="bg-gray-800 rounded-xl p-6" style={{ borderLeft: `4px solid ${pillar.color}` }}>
                <h2 className="text-2xl font-bold mb-2" style={{ color: pillar.color }}>{pillar.name}</h2>
                <p className="text-sm text-gray-500 mb-3">{pillar.subtitle}</p>
                <p className="text-gray-300 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 bg-gray-800 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold mb-3">Today's Session</h3>
            <p className="text-gray-400 mb-4">For each pillar, you'll share your ideas and vote on what matters most.</p>
            <div className="flex justify-center gap-4">
              <div className="bg-blue-900/30 px-4 py-2 rounded-lg">
                <span className="text-blue-400 font-medium">📝 Submit</span>
                <p className="text-xs text-gray-500">3 ideas per pillar</p>
              </div>
              <div className="bg-green-900/30 px-4 py-2 rounded-lg">
                <span className="text-green-400 font-medium">🗳️ Vote</span>
                <p className="text-xs text-gray-500">3 votes per pillar</p>
              </div>
            </div>
          </div>
          <button onClick={() => setCurrentView('home')} className="w-full mt-6 bg-[#C91433] px-6 py-4 rounded-lg font-semibold hover:bg-[#a01029] transition text-lg">
            Let's Get Started →
          </button>
        </div>
        <AdminPanel />
        <div className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#C91433] via-[#2C5F2D] to-[#D4AF37]" />
      </div>
    );
  }

  // Membership page - vertical comparison table
  if (currentView === 'membership') {
    return (
      <div className="min-h-screen bg-gray-900 text-white pb-16">
        <div className="h-2 bg-gradient-to-r from-[#C91433] via-[#2C5F2D] to-[#D4AF37]" />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <button onClick={() => setCurrentView('home')} className="text-gray-400 hover:text-white transition mb-6">← Back</button>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif font-bold mb-2">Membership Tiers</h1>
            <p className="text-gray-400">Choose the level that fits your journey</p>
          </div>

          {/* Pricing header */}
          <div className="bg-gray-800 rounded-t-xl overflow-hidden">
            <div className="grid grid-cols-4">
              <div className="p-4"></div>
              {Object.entries(MEMBERSHIP_TIERS).map(([key, tier]) => (
                <div key={key} className="p-4 text-center border-l border-gray-700" style={{ borderTop: `4px solid ${tier.color}` }}>
                  <h3 className="text-xl font-bold" style={{ color: tier.color }}>{tier.name}</h3>
                  <p className="text-2xl font-bold mt-1">{tier.price}</p>
                  <p className="text-xs text-gray-500 mt-1">{tier.target}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features table */}
          <div className="bg-gray-800 border-t border-gray-700">
            {MEMBERSHIP_FEATURES.map((category, catIdx) => (
              <div key={catIdx}>
                {/* Category header */}
                <div className="grid grid-cols-4 bg-gray-750 border-t border-gray-700">
                  <div className="p-3 col-span-4">
                    <span className="text-sm font-semibold text-gray-400 uppercase tracking-wide">{category.category}</span>
                  </div>
                </div>
                {/* Features */}
                {category.features.map((feature, featIdx) => (
                  <div key={featIdx} className="grid grid-cols-4 border-t border-gray-700 hover:bg-gray-750 transition">
                    <div className="p-3 text-sm text-gray-300">{feature.name}</div>
                    <div className="p-3 text-sm text-center border-l border-gray-700">
                      <span className={feature.basic === '—' ? 'text-gray-600' : feature.basic === '✓' ? 'text-green-500' : 'text-gray-300'}>
                        {feature.basic}
                      </span>
                    </div>
                    <div className="p-3 text-sm text-center border-l border-gray-700">
                      <span className={feature.silver === '—' ? 'text-gray-600' : feature.silver === '✓' ? 'text-green-500' : 'text-gray-300'}>
                        {feature.silver}
                      </span>
                    </div>
                    <div className="p-3 text-sm text-center border-l border-gray-700 bg-[#D4AF37]/5">
                      <span className={feature.platinum === '—' ? 'text-gray-600' : feature.platinum === '✓' ? 'text-green-500' : 'text-[#D4AF37]'}>
                        {feature.platinum}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="grid grid-cols-4 bg-gray-800 rounded-b-xl border-t border-gray-700">
            <div className="p-4"></div>
            {Object.entries(MEMBERSHIP_TIERS).map(([key, tier]) => (
              <div key={key} className="p-4 border-l border-gray-700">
                <button
                  onClick={() => {
                    if (tier.stripeLink) {
                      window.open(tier.stripeLink, '_blank');
                    } else {
                      alert(`Thank you for your interest in ${tier.name} membership! We'll contact you at ${user.email} to complete registration.`);
                    }
                  }}
                  className="w-full py-3 rounded-lg font-semibold transition text-sm"
                  style={{ 
                    backgroundColor: tier.color, 
                    color: key === 'basic' ? 'white' : key === 'silver' ? '#1a1a1a' : '#1a1a1a'
                  }}
                >
                  {key === 'basic' ? 'Join Free' : `Get ${tier.name}`}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Questions? Contact us at hello@thestrclub.com
          </p>
        </div>
        <AdminPanel />
        <div className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#C91433] via-[#2C5F2D] to-[#D4AF37]" />
      </div>
    );
  }

  // Home view
  if (currentView === 'home') {
    const globalPhase = getCurrentGlobalPhase();
    const isRegistered = user.name && user.email && user.company;
    
    return (
      <div className="min-h-screen bg-gray-900 text-white pb-16">
        <div className="h-2 bg-gradient-to-r from-[#C91433] via-[#2C5F2D] to-[#D4AF37]" />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-6">
          <img  src={logo} alt="STR Club" className="w-60 mx-auto"/>
            {/* <h1 className="text-4xl font-serif font-bold mb-2">THE STR CLUB</h1> */}
            <p className="text-gray-400">Co-Creation Roundtable</p>
          </div>

          {/* User info or register prompt */}
          {isRegistered ? (
            <div className="bg-gray-800 rounded-lg px-4 py-3 mb-4 flex justify-between items-center">
              <div>
                <span className="text-gray-400">Welcome, </span>
                <span className="font-semibold">{user.name}</span>
                <span className="text-gray-500"> • {user.company}</span>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-400 mb-3">Register to submit ideas and vote:</p>
              <div className="flex gap-2 flex-wrap">
                <input type="text" value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder="Name" className="flex-1 min-w-[120px] bg-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C91433]" />
                <input type="email" value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="Email" className="flex-1 min-w-[150px] bg-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C91433]" />
                <input type="text" value={regForm.company} onChange={(e) => setRegForm({ ...regForm, company: e.target.value })}
                  placeholder="Company" className="flex-1 min-w-[120px] bg-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C91433]" />
                <button onClick={handleRegister} disabled={!regForm.name.trim() || !regForm.email.trim() || !regForm.company.trim()}
                  className="bg-[#C91433] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#a01029] transition disabled:opacity-50 disabled:cursor-not-allowed">
                  Join
                </button>
              </div>
            </div>
          )}

          {/* Phase toggle button - visible to everyone */}
          <button
            onClick={toggleAllPhase}
            className={`w-full mb-4 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-3 ${
              globalPhase === 'submit' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : globalPhase === 'vote'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {globalPhase === 'submit' ? (
              <>📝 Currently: SUBMIT MODE <span className="text-sm opacity-70">— Click to switch to VOTING</span></>
            ) : globalPhase === 'vote' ? (
              <>🗳️ Currently: VOTE MODE <span className="text-sm opacity-70">— Click to switch to SUBMIT</span></>
            ) : (
              <>⚡ Mixed Mode — Click to sync all pillars</>
            )}
          </button>

          {/* About button */}
          <button onClick={() => setCurrentView('about')}
            className="w-full bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-3 mb-6 text-left transition">
            <span className="text-gray-400">📖</span>
            <span className="ml-2">What is Connect / Learn / Elevate?</span>
            <span className="float-right text-gray-500">→</span>
          </button>

          {/* Pillars */}
          <div className="grid gap-4 mb-6">
            {Object.entries(PILLARS).map(([key, pillar]) => {
              const ideaCount = ideas[key]?.length || 0;
              const totalVotes = ideas[key]?.reduce((sum, i) => sum + i.votes, 0) || 0;
              const currentPhase = phase[key];
              const subsRemaining = getSubmissionsRemaining(key);
              const votesRemaining = getVotesRemaining(key);
              
              return (
                <button key={key} onClick={() => { setActivePillar(key); setCurrentView('pillar'); }}
                  className="bg-[gray]-800 rounded-xl p-5 text-left hover:bg-gray-750 transition group"
                  style={{ borderLeft: `4px solid ${pillar.color}`, backgroundColor:`${pillar.color}`  }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-bold ">{pillar.name}</h2>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${currentPhase === 'submit' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'}`}>
                          {currentPhase === 'submit' ? '📝 Submit' : '🗳️ Vote'}
                        </span>
                      </div>
                      <p className=" text-sm">{pillar.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{ideaCount}</div>
                      <div className="text-xs ">ideas</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    {currentPhase === 'submit' ? (
                      <span className="">{subsRemaining} submissions left</span>
                    ) : (
                      <span className="">{votesRemaining} votes left</span>
                    )}
                    <span className="">{totalVotes} total votes</span>
                    <span className=" group-hover:text-white transition ml-auto">→</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-4">
            <button onClick={() => setCurrentView('results')} className="flex-1 bg-cyan-700 hover:bg-cyan-800 px-4 py-3 rounded-lg transition">
              📊 Results
            </button>
            <button onClick={() => setCurrentView('membership')} className="flex-1 bg-teal-700 hover:bg-teal-800 px-4 py-3 rounded-lg font-semibold transition">
              ⭐ Membership
            </button>
          </div>
        </div>
        <AdminPanel />
        <div className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#C91433] via-[#2C5F2D] to-[#D4AF37]" />
      </div>
    );
  }

  // Pillar view
  if (currentView === 'pillar' && activePillar) {
    const pillar = PILLARS[activePillar];
    const pillarIdeas = ideas[activePillar] || [];
    const currentPhase = phase[activePillar];
    const votesRemaining = getVotesRemaining(activePillar);
    const subsRemaining = getSubmissionsRemaining(activePillar);
    const isRegistered = user.name && user.email && user.company;

    return (
      <div className="min-h-screen text-white" style={{ backgroundColor: pillar.color }}>
        <div className="bg-black/20 px-6 py-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <button onClick={() => setCurrentView('home')} className="text-white/70 hover:text-white transition">← Back</button>
            <div className="flex items-center gap-4">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${currentPhase === 'submit' ? 'bg-blue-500/30 text-blue-100' : 'bg-green-500/30 text-green-100'}`}>
                {currentPhase === 'submit' ? '📝 Submit' : '🗳️ Vote'}
              </span>
              {isRegistered && (
                <div className="text-sm">
                  {currentPhase === 'submit' ? (<><span className="text-white/70">Submissions: </span><span className="font-bold">{subsRemaining}</span></>) 
                    : (<><span className="text-white/70">Votes: </span><span className="font-bold">{votesRemaining}</span></>)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-4xl font-serif font-bold mb-2">{pillar.name}</h1>
          <p className="text-white/70 mb-4">{pillar.subtitle}</p>
          <p className="text-white/80 text-sm mb-6 leading-relaxed">{pillar.description}</p>

          <div className="bg-white/15 rounded-xl p-5 mb-6">
            <div className="text-xs uppercase tracking-wider text-white/50 mb-2">Key Question</div>
            <p className="text-lg italic">{pillar.keyQuestion}</p>
          </div>

          <details className="mb-6">
            <summary className="cursor-pointer text-white/80 hover:text-white font-medium">Questions to Consider ▾</summary>
            <div className="space-y-2 mt-3">
              {pillar.questions.map((q, i) => (
                <div key={i} className="bg-white/10 rounded-lg p-3">
                  <p className="font-medium text-sm">{q.q}</p>
                  <p className="text-xs text-white/50 mt-1">{q.ex}</p>
                </div>
              ))}
            </div>
          </details>

          {/* Register prompt if not registered */}
          {!isRegistered && (
            <div className="bg-white/20 rounded-xl p-4 mb-6">
              <p className="text-sm mb-3">Register to submit ideas and vote:</p>
              <div className="flex gap-2 flex-wrap">
                <input type="text" value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder="Name" className="flex-1 min-w-[100px] bg-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none" />
                <input type="email" value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="Email" className="flex-1 min-w-[120px] bg-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none" />
                <input type="text" value={regForm.company} onChange={(e) => setRegForm({ ...regForm, company: e.target.value })}
                  placeholder="Company" className="flex-1 min-w-[100px] bg-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none" />
                <button onClick={handleRegister} disabled={!regForm.name.trim() || !regForm.email.trim() || !regForm.company.trim()}
                  className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition disabled:opacity-50">
                  Join
                </button>
              </div>
            </div>
          )}

          {currentPhase === 'submit' && isRegistered && (
            <div className="bg-white/20 rounded-xl p-5 mb-6">
              <h3 className="font-semibold mb-3">Share Your Idea <span className="text-sm font-normal text-white/60">({subsRemaining} remaining)</span></h3>
              {subsRemaining > 0 ? (
                <div className="flex gap-3">
                  <input type="text" value={newIdea} onChange={(e) => setNewIdea(e.target.value)}
                    placeholder="What's the ONE thing you'd value most?"
                    className="flex-1 bg-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                    onKeyDown={(e) => e.key === 'Enter' && submitIdea()} />
                  <button onClick={submitIdea} disabled={!newIdea.trim()}
                    className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50">Submit</button>
                </div>
              ) : (<p className="text-white/60">You've submitted all 3 ideas.</p>)}
            </div>
          )}

          {currentPhase === 'vote' && isRegistered && (
            <div className="bg-white/20 rounded-xl p-4 mb-6 text-center">
              <p className="font-medium">🗳️ Voting is open! Click ideas to vote.</p>
              <p className="text-sm text-white/70">{votesRemaining} votes remaining</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-4">Ideas ({pillarIdeas.length})</h3>
            {pillarIdeas.length === 0 ? (
              <div className="text-center py-12 text-white/50">No ideas yet. Be the first!</div>
            ) : (
              <div className="space-y-3">
                {[...pillarIdeas].sort((a, b) => currentPhase === 'vote' ? b.votes - a.votes : b.timestamp - a.timestamp).map((idea) => {
                  const voteKey = `${activePillar}-${idea.id}`;
                  const hasVoted = userVotes[voteKey];
                  const canVote = currentPhase === 'vote' && isRegistered && (hasVoted || votesRemaining > 0);
                  return (
                    <div key={idea.id} onClick={() => canVote && voteForIdea(activePillar, idea.id)}
                      className={`bg-white/10 rounded-lg p-4 flex items-center gap-4 transition ${canVote ? 'cursor-pointer hover:bg-white/20' : ''} ${hasVoted ? 'ring-2 ring-white' : ''}`}>
                      {currentPhase === 'vote' && (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${hasVoted ? 'bg-white text-gray-900' : 'bg-white/20'}`}>{idea.votes}</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{idea.text}</p>
                        <p className="text-sm text-white/60 mt-1">{idea.authorName} • {idea.authorCompany}</p>
                      </div>
                      {currentPhase === 'submit' && <div className="text-white/40 text-sm shrink-0">{idea.votes} votes</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <AdminPanel />
      </div>
    );
  }

  // Results view
  if (currentView === 'results') {
    return (
      <div className="min-h-screen bg-gray-900 text-white pb-16">
        <div className="h-2 bg-gradient-to-r from-[#C91433] via-[#2C5F2D] to-[#D4AF37]" />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <button onClick={() => setCurrentView('home')} className="text-gray-400 hover:text-white transition mb-6">← Back</button>
          <h1 className="text-3xl font-serif font-bold mb-8">Results Summary</h1>
          {Object.entries(PILLARS).map(([key, pillar]) => {
            const pillarIdeas = ideas[key] || [];
            const topIdeas = [...pillarIdeas].sort((a, b) => b.votes - a.votes).slice(0, 5);
            return (
              <div key={key} className="mb-8">
                <h2 className="text-xl font-bold mb-4 pb-2 border-b-2" style={{ color: pillar.color, borderColor: pillar.color }}>
                  {pillar.name}
                  <span className="text-sm font-normal text-gray-500 ml-3">{pillarIdeas.length} ideas • {pillarIdeas.reduce((s, i) => s + i.votes, 0)} votes</span>
                </h2>
                {topIdeas.length === 0 ? (<p className="text-gray-500">No ideas yet</p>) : (
                  <div className="space-y-2">
                    {topIdeas.map((idea, index) => (
                      <div key={idea.id} className="flex items-center gap-4 bg-gray-800 rounded-lg p-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{ backgroundColor: pillar.color }}>{index + 1}</div>
                        <div className="flex-1 min-w-0">
                          <p>{idea.text}</p>
                          <p className="text-sm text-gray-500">{idea.authorName} • {idea.authorCompany}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-bold">{idea.votes}</div>
                          <div className="text-xs text-gray-500">votes</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <AdminPanel />
        <div className="fixed bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#C91433] via-[#2C5F2D] to-[#D4AF37]" />
      </div>
    );
  }

  return null;
}
