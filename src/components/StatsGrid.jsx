import { LuStar, LuGitFork, LuCodeXml, LuUsers, LuTrendingUp, LuEye } from 'react-icons/lu';

const cards = [
  { key: 'totalStars', icon: LuStar, color: 'amber', tKey: 'totalStars' },
  { key: 'totalForks', icon: LuGitFork, color: 'blue', tKey: 'totalForks' },
  { key: 'repoCount', icon: LuCodeXml, color: 'indigo', tKey: 'repoCount' },
  { key: 'followers', icon: LuUsers, color: 'emerald', tKey: 'followers' },
  { key: 'avgStars', icon: LuTrendingUp, color: 'purple', tKey: 'avgStars' },
  { key: 'totalWatchers', icon: LuEye, color: 'pink', tKey: 'totalWatchers' },
];

const colorMap = {
  amber:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  blue:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  indigo:  'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  purple:  'bg-purple-500/10 text-purple-400 border-purple-500/20',
  pink:    'bg-pink-500/10 text-pink-400 border-pink-500/20',
};

export default function StatsGrid({ data, t }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map(({ key, icon: Icon, color, tKey }) => (
        <div key={key} className={`p-4 rounded-2xl border text-center ${colorMap[color]}`}>
          <Icon className="w-5 h-5 mx-auto mb-2 opacity-80" />
          <p className="text-2xl font-black">{data[key]?.toLocaleString?.() ?? data[key]}</p>
          <p className="text-[10px] uppercase tracking-widest opacity-60 mt-1">{t.stats[tKey]}</p>
        </div>
      ))}
    </div>
  );
}
