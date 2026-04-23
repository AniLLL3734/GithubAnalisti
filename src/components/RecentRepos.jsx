import { LuClock, LuCircle, LuStar, LuExternalLink } from 'react-icons/lu';

function timeAgo(dateStr, t) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}${t.recentRepos.timeAgo.min}`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}${t.recentRepos.timeAgo.hour}`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}${t.recentRepos.timeAgo.day}`;
  const months = Math.floor(days / 30);
  return `${months}${t.recentRepos.timeAgo.month}`;
}

export default function RecentRepos({ repos, t }) {
  const recent = [...repos].sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at)).slice(0, 5);
  if (recent.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
        <LuClock className="w-4 h-4" /> {t.recentRepos.title}
      </h3>
      <div className="space-y-2">
        {recent.map((repo) => (
          <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer"
            className="group flex items-center justify-between p-3.5 bg-[#12151c] border border-slate-800 rounded-xl hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div className="min-w-0">
                <h4 className="font-semibold text-white text-sm truncate group-hover:text-emerald-300 transition-colors">{repo.name}</h4>
                <p className="text-xs text-slate-500 truncate">{repo.description || t.recentRepos.noDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-3">
              {repo.language && (
                <span className="hidden sm:flex items-center gap-1 text-xs text-slate-500">
                  <LuCircle className="w-2 h-2 fill-current text-indigo-400" />{repo.language}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <LuStar className="w-3 h-3" />{repo.stargazers_count}
              </span>
              <span className="text-xs text-emerald-400/70 font-mono whitespace-nowrap">{timeAgo(repo.pushed_at, t)}</span>
              <LuExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
