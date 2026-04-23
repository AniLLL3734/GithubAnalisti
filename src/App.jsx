import { useState } from 'react';
import axios from 'axios';
import { LuSearch as Search, LuLoader as Loader2, LuGithub as Github, LuCircleAlert as AlertCircle, LuGlobe, LuHeart } from 'react-icons/lu';

import translations from './i18n';
import ProfileCard from './components/ProfileCard';
import StatsGrid from './components/StatsGrid';
import LanguageChart from './components/LanguageChart';
import TopRepos from './components/TopRepos';
import RecentRepos from './components/RecentRepos';
import ReadmePreview from './components/ReadmePreview';
import ActivityFeed from './components/ActivityFeed';
import PromptSection from './components/PromptSection';

function App() {
  const [lang, setLang] = useState('tr');
  const t = translations[lang];

  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [readmes, setReadmes] = useState([]);
  const [events, setEvents] = useState([]);

  const fetchReadme = async (owner, repo) => {
    try {
      const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: { Accept: 'application/vnd.github.v3.raw' }
      });
      const content = typeof res.data === 'string' ? res.data : '';
      return content.length > 2000 ? content.slice(0, 2000) + `\n\n---\n*${t.readme.truncated}*` : content;
    } catch {
      return null;
    }
  };

  const calculateLanguageStats = (repos) => {
    const langs = {};
    repos.forEach(repo => {
      if (repo.language) langs[repo.language] = (langs[repo.language] || 0) + 1;
    });
    return Object.entries(langs)
      .sort((a, b) => b[1] - a[1])
      .map(([l, count]) => `${l} (%${Math.round((count / repos.length) * 100)})`);
  };

  const generatePrompt = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    setPrompt('');
    setCopied(false);
    setProfile(null);
    setRepos([]);
    setStatsData(null);
    setReadmes([]);
    setEvents([]);

    try {
      setLoadingStatus(t.loading.profile);
      const profileRes = await axios.get(`https://api.github.com/users/${username}`);
      const p = profileRes.data;
      setProfile(p);

      setLoadingStatus(t.loading.repos);
      const reposRes = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
      const personalRepos = reposRes.data.filter(r => !r.fork);
      setRepos(personalRepos);

      setLoadingStatus(t.loading.events);
      try {
        const evRes = await axios.get(`https://api.github.com/users/${username}/events/public?per_page=30`);
        setEvents(evRes.data);
      } catch { setEvents([]); }

      setLoadingStatus(t.loading.readmes);
      const topByStars = [...personalRepos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 3);
      const readmeResults = [];
      for (const repo of topByStars) {
        const content = await fetchReadme(username, repo.name);
        if (content) readmeResults.push({ repo: repo.name, stars: repo.stargazers_count, content });
      }
      setReadmes(readmeResults);

      const totalStars = personalRepos.reduce((a, r) => a + r.stargazers_count, 0);
      const totalForks = personalRepos.reduce((a, r) => a + r.forks_count, 0);
      const totalWatchers = personalRepos.reduce((a, r) => a + r.watchers_count, 0);
      const avgStars = personalRepos.length > 0 ? (totalStars / personalRepos.length).toFixed(1) : 0;
      setStatsData({ totalStars, totalForks, repoCount: p.public_repos, followers: p.followers, avgStars, totalWatchers });

      setLoadingStatus(t.loading.prompt);
      const langStats = calculateLanguageStats(personalRepos);
      const sortedRepos = [...personalRepos].sort((a, b) => {
        return ((b.stargazers_count * 5) + new Date(b.updated_at).getTime() / 1e8) -
               ((a.stargazers_count * 5) + new Date(a.updated_at).getTime() / 1e8);
      });
      const top10 = sortedRepos.slice(0, 10);
      const recentlyUpdated = [...personalRepos].sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at)).slice(0, 5);
      const accountAge = Math.floor((new Date() - new Date(p.created_at)) / (1000 * 60 * 60 * 24 * 365));

      let gp = `AŞAĞIDAKİ GİTHUB PROFİL VERİLERİNİ DERİNLEMESİNE ANALİZ ET VE PROFESYONEL BİR RAPOR SUN.\n\n`;
      gp += `KULLANICI: ${p.login} (${p.name || 'İsimsiz'})\n`;
      gp += `--- PROFİL MATRİSİ ---\n`;
      gp += `- Bio: ${p.bio || 'Yok'}\n- Lokasyon: ${p.location || 'Bilinmiyor'}\n`;
      gp += `- Şirket/Kurum: ${p.company || 'Belirtilmemiş'}\n- Blog/Portfolio: ${p.blog || 'Yok'}\n`;
      gp += `- Hesap Yaşı: ${accountAge} Yıl (${p.created_at.split('T')[0]})\n`;
      gp += `- İstatistikler: ${p.public_repos} Repo, ${p.followers} Takipçi, ${p.following} Takip, ${totalStars} Yıldız, ${totalForks} Fork\n`;
      gp += `- Ort. Yıldız/Repo: ${avgStars}\n\n`;
      gp += `--- TEKNOLOJİ YIĞINI ---\n${langStats.join(', ') || 'Veri yok'}\n\n`;
      gp += `--- EN İYİ 10 PROJE ---\n`;
      top10.forEach((r, i) => {
        gp += `${i + 1}. [${r.name}] → ${r.language || 'N/A'} | ⭐${r.stargazers_count} | 🍴${r.forks_count}\n`;
        gp += `   Açıklama: ${r.description || '-'}\n   Etiketler: ${r.topics?.join(', ') || '-'}\n   Son Güncelleme: ${r.updated_at.split('T')[0]}\n`;
        if (r.homepage) gp += `   Demo: ${r.homepage}\n`;
        gp += `\n`;
      });
      gp += `--- SON GÜNCELLENEN REPOLAR ---\n`;
      recentlyUpdated.forEach((r, i) => {
        gp += `${i + 1}. [${r.name}] → Son push: ${r.pushed_at.split('T')[0]} | ${r.language || 'N/A'}\n`;
      });
      gp += `\n`;
      if (readmeResults.length > 0) {
        gp += `--- TOP REPO README ÖZETLERİ ---\n`;
        readmeResults.forEach(rm => { gp += `📄 ${rm.repo} (⭐${rm.stars}):\n${rm.content.slice(0, 800)}\n...\n\n`; });
      }
      gp += `--- ANALİZ TALİMATLARI ---\n`;
      gp += `1. Yazılım Mimari Yaklaşımını ve Kod Kalitesi öngörüsünü değerlendir.\n`;
      gp += `2. Uzmanlık alanlarını (Frontend, Backend, DevOps, Game Dev vb.) belirle.\n`;
      gp += `3. Proje çeşitliliğinden Öğrenme Hızı ve Adaptasyon Yeteneğini analiz et.\n`;
      gp += `4. Junior/Mid/Senior/Lead pozisyon uygunluğunu gerekçelendir.\n`;
      gp += `5. Zayıf ve geliştirilmesi gereken alanları tespit et.\n`;
      gp += `6. README kalitesinden dokümantasyon yetkinliğini değerlendir.\n`;
      gp += `7. Son aktivitelere bakarak güncel çalışma temposunu yorumla.\n`;
      gp += `8. Açık kaynak topluluğuna katkı seviyesini ölç.\n`;
      gp += `9. Sonuç: Etkileyici bir Executive Summary oluştur.\n`;

      setPrompt(gp);
    } catch (err) {
      if (err.response?.status === 404) setError(t.notFound);
      else if (err.response?.status === 403) setError(t.rateLimit);
      else setError(t.fetchError);
    } finally {
      setLoading(false);
      setLoadingStatus('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasResults = profile && repos.length > 0;

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-300 font-sans selection:bg-indigo-500/30 selection:text-white">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto pt-6 pb-24 px-4 sm:px-6">
        {/* Top Bar — Language Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
            className="flex items-center gap-2 px-4 py-2 bg-[#12151c] border border-slate-800 rounded-xl text-sm text-slate-400 hover:text-white hover:border-indigo-500/40 transition-all"
          >
            <LuGlobe className="w-4 h-4" />
            {lang === 'tr' ? '🇬🇧 English' : '🇹🇷 Türkçe'}
          </button>
        </div>

        {/* Header */}
        <header className="text-center mb-12 space-y-5">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Logo" className="w-20 h-20 rounded-2xl shadow-2xl shadow-indigo-500/20 border border-indigo-500/20" />
          </div>
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium animate-fade-in">
            <Github className="w-4 h-4" />
            {t.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            {t.title1} <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">{t.title2}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base text-slate-400">{t.subtitle}</p>
        </header>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-10">
          <form onSubmit={generatePrompt} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder={t.placeholder}
              className="w-full pl-14 pr-36 py-5 bg-[#12151c] border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-2xl" />
            <button type="submit" disabled={loading}
              className="absolute right-2 top-2 bottom-2 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.analyze}
            </button>
          </form>
          {error && (
            <p className="mt-4 text-red-400 text-sm flex items-center gap-2 justify-center">
              <AlertCircle className="w-4 h-4" /> {error}
            </p>
          )}
          {loading && loadingStatus && (
            <p className="mt-4 text-indigo-400 text-sm flex items-center gap-2 justify-center animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" /> {loadingStatus}
            </p>
          )}
        </div>

        {/* Results */}
        {hasResults && (
          <div className="space-y-8 animate-in">
            <StatsGrid data={statsData} t={t} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <ProfileCard profile={profile} username={username} t={t} />
                <LanguageChart repos={repos} t={t} />
              </div>
              <div className="lg:col-span-9 space-y-8">
                <TopRepos repos={repos} t={t} />
                <RecentRepos repos={repos} t={t} />
                {readmes.length > 0 && <ReadmePreview readmes={readmes} t={t} />}
                <ActivityFeed events={events} t={t} />
                <PromptSection prompt={prompt} copied={copied} onCopy={copyToClipboard} t={t} />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-slate-800/50 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
            <LuHeart className="w-4 h-4 text-pink-500" />
            <span>{t.footer.builtWith}</span>
          </div>
          <a href="https://github.com/AniLLL3734" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#12151c] border border-slate-800 rounded-xl text-indigo-400 hover:text-white hover:border-indigo-500/40 transition-all text-sm font-medium group">
            <Github className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            AniLLL3734
          </a>
          <p className="text-xs text-slate-600">
            Powered by <span className="text-slate-500">GitHub REST API v3</span>
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-in > * { animation: fade-in 0.5s ease-out forwards; opacity: 0; }
        .animate-in > *:nth-child(1) { animation-delay: 0.05s; }
        .animate-in > *:nth-child(2) { animation-delay: 0.15s; }
        .animate-in > *:nth-child(3) { animation-delay: 0.25s; }
      `}</style>
    </div>
  );
}

export default App;
