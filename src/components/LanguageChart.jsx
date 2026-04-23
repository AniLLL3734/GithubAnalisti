const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', Java: '#b07219',
  'C#': '#178600', 'C++': '#f34b7d', C: '#555555', Go: '#00ADD8', Rust: '#dea584',
  Ruby: '#701516', PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB',
  HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051', Lua: '#000080', Vue: '#41b883',
  SCSS: '#c6538c', Dockerfile: '#384d54',
};

export default function LanguageChart({ repos, t }) {
  const langs = {};
  repos.forEach(r => {
    if (r.language) langs[r.language] = (langs[r.language] || 0) + 1;
  });
  const sorted = Object.entries(langs).sort((a, b) => b[1] - a[1]);
  const total = repos.length;

  if (sorted.length === 0) return null;

  return (
    <div className="p-6 bg-[#12151c] border border-slate-800 rounded-3xl shadow-xl">
      <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">{t.langChart.title}</h3>
      <div className="flex h-4 rounded-full overflow-hidden mb-4 bg-slate-800">
        {sorted.map(([lang, count]) => (
          <div key={lang}
            style={{ width: `${(count / total) * 100}%`, backgroundColor: LANG_COLORS[lang] || '#6366f1' }}
            className="transition-all duration-500 hover:opacity-80"
            title={`${lang}: ${Math.round((count / total) * 100)}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {sorted.slice(0, 8).map(([lang, count]) => (
          <div key={lang} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: LANG_COLORS[lang] || '#6366f1' }} />
            <span>{lang}</span>
            <span className="text-slate-600">%{Math.round((count / total) * 100)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
