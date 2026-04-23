import { LuActivity } from 'react-icons/lu';

export default function ActivityFeed({ events, t }) {
  if (!events || events.length === 0) return null;

  const typeMap = {
    PushEvent: { label: t.activity.push, emoji: '🚀', color: 'text-emerald-400' },
    CreateEvent: { label: t.activity.create, emoji: '✨', color: 'text-blue-400' },
    DeleteEvent: { label: t.activity.delete, emoji: '🗑️', color: 'text-red-400' },
    WatchEvent: { label: t.activity.star, emoji: '⭐', color: 'text-amber-400' },
    ForkEvent: { label: t.activity.fork, emoji: '🍴', color: 'text-purple-400' },
    IssuesEvent: { label: t.activity.issue, emoji: '🐛', color: 'text-orange-400' },
    PullRequestEvent: { label: t.activity.pr, emoji: '🔀', color: 'text-indigo-400' },
    IssueCommentEvent: { label: t.activity.comment, emoji: '💬', color: 'text-cyan-400' },
    ReleaseEvent: { label: t.activity.release, emoji: '📦', color: 'text-pink-400' },
  };

  const formatDate = (d) => {
    const date = new Date(d);
    const diff = Date.now() - date;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return t.activity.justNow;
    if (hours < 24) return `${hours}${t.recentRepos.timeAgo.hour}`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}${t.recentRepos.timeAgo.day}`;
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
        <LuActivity className="w-4 h-4" /> {t.activity.title}
      </h3>
      <div className="bg-[#12151c] border border-slate-800 rounded-2xl divide-y divide-slate-800/50 overflow-hidden">
        {events.slice(0, 8).map((ev, i) => {
          const info = typeMap[ev.type] || { label: ev.type.replace('Event', ''), emoji: '📌', color: 'text-slate-400' };
          return (
            <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/20 transition-colors">
              <span className="text-lg">{info.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">
                  <span className={`font-semibold ${info.color}`}>{info.label}</span>
                  {' → '}
                  <span className="text-slate-400">{ev.repo.name.split('/')[1]}</span>
                </p>
              </div>
              <span className="text-xs text-slate-600 whitespace-nowrap">{formatDate(ev.created_at)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
