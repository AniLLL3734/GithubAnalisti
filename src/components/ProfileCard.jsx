import { LuGithub, LuMapPin, LuBriefcase, LuLink, LuCalendar, LuCodeXml as LuCode2, LuStar } from 'react-icons/lu';

export default function ProfileCard({ profile, username, t }) {
  const accountAge = Math.floor((new Date() - new Date(profile.created_at)) / (1000 * 60 * 60 * 24 * 365));

  return (
    <div className="p-6 bg-[#12151c] border border-slate-800 rounded-3xl space-y-5 shadow-xl">
      <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
        <div className="relative">
          <img src={profile.avatar_url} alt="Avatar" className="w-20 h-20 rounded-2xl border-2 border-indigo-500/30 shadow-lg" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#12151c]" />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg leading-tight">{profile.name || username}</h3>
          <p className="text-slate-500 text-sm">@{profile.login}</p>
          {profile.bio && <p className="text-slate-400 text-xs mt-1 line-clamp-2">{profile.bio}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0a0c10] rounded-xl p-3 text-center border border-slate-800/50">
          <p className="text-2xl font-black text-white">{profile.public_repos}</p>
          <p className="text-xs text-slate-500">{t.profile.repos}</p>
        </div>
        <div className="bg-[#0a0c10] rounded-xl p-3 text-center border border-slate-800/50">
          <p className="text-2xl font-black text-white">{profile.followers}</p>
          <p className="text-xs text-slate-500">{t.stats.followers}</p>
        </div>
        <div className="bg-[#0a0c10] rounded-xl p-3 text-center border border-slate-800/50">
          <p className="text-2xl font-black text-white">{profile.following}</p>
          <p className="text-xs text-slate-500">{t.profile.following}</p>
        </div>
        <div className="bg-[#0a0c10] rounded-xl p-3 text-center border border-slate-800/50">
          <p className="text-2xl font-black text-white">{accountAge}</p>
          <p className="text-xs text-slate-500">{t.profile.years}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        {profile.location && (
          <div className="flex items-center gap-2 text-slate-400">
            <LuMapPin className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="truncate">{profile.location}</span>
          </div>
        )}
        {profile.company && (
          <div className="flex items-center gap-2 text-slate-400">
            <LuBriefcase className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="truncate">{profile.company}</span>
          </div>
        )}
        {profile.blog && (
          <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors">
            <LuLink className="w-4 h-4 shrink-0" />
            <span className="truncate">{profile.blog}</span>
          </a>
        )}
        <div className="flex items-center gap-2 text-slate-400">
          <LuCalendar className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{t.profile.joinedOn} {profile.created_at.split('T')[0]}</span>
        </div>
      </div>

      <a href={profile.html_url} target="_blank" rel="noreferrer"
        className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl transition-colors">
        <LuGithub className="w-4 h-4" /> {t.profile.viewProfile}
      </a>
    </div>
  );
}
