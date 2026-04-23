import { LuStar, LuGitFork, LuCircle, LuExternalLink } from 'react-icons/lu';

export default function TopRepos({ repos, t }) {
  const top = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6);
  if (top.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
        <LuStar className="w-4 h-4" /> {t.topRepos.title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {top.map((repo, i) => (
          <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer"
            className="group p-4 bg-[#12151c] border border-slate-800 rounded-2xl hover:border-indigo-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                {i < 3 && (
                  <span className={`text-xs font-black px-1.5 py-0.5 rounded ${
                    i === 0 ? 'bg-amber-500/20 text-amber-400' :
                    i === 1 ? 'bg-slate-400/20 text-slate-300' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>#{i + 1}</span>
                )}
                <h4 className="font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">{repo.name}</h4>
              </div>
              <LuExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0 mt-1" />
            </div>
            <p className="text-xs text-slate-500 line-clamp-2 mb-3 min-h-[2rem]">{repo.description || t.topRepos.noDesc}</p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              {repo.language && (
                <span className="flex items-center gap-1"><LuCircle className="w-2.5 h-2.5 fill-current text-indigo-400" />{repo.language}</span>
              )}
              <span className="flex items-center gap-1"><LuStar className="w-3 h-3" />{repo.stargazers_count}</span>
              <span className="flex items-center gap-1"><LuGitFork className="w-3 h-3" />{repo.forks_count}</span>
            </div>
            {repo.topics?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {repo.topics.slice(0, 3).map(tp => (
                  <span key={tp} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 text-[10px] rounded-md border border-indigo-500/20">{tp}</span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
