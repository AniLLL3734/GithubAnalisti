import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LuBookOpen, LuChevronDown, LuChevronUp, LuStar } from 'react-icons/lu';

export default function ReadmePreview({ readmes, t }) {
  const [expandedIdx, setExpandedIdx] = useState(0);
  if (!readmes || readmes.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
        <LuBookOpen className="w-4 h-4" /> {t.readme.title}
      </h3>
      <div className="space-y-3">
        {readmes.map((item, idx) => (
          <div key={item.repo} className="bg-[#12151c] border border-slate-800 rounded-2xl overflow-hidden">
            <button onClick={() => setExpandedIdx(expandedIdx === idx ? -1 : idx)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <span className={`text-xs font-black px-1.5 py-0.5 rounded ${
                  idx === 0 ? 'bg-amber-500/20 text-amber-400' :
                  idx === 1 ? 'bg-slate-400/20 text-slate-300' :
                  'bg-orange-500/20 text-orange-400'
                }`}>#{idx + 1}</span>
                <span className="font-semibold text-white text-sm truncate">{item.repo}</span>
                <span className="flex items-center gap-1 text-xs text-amber-400">
                  <LuStar className="w-3 h-3" />{item.stars}
                </span>
              </div>
              {expandedIdx === idx ? <LuChevronUp className="w-4 h-4 text-slate-500" /> : <LuChevronDown className="w-4 h-4 text-slate-500" />}
            </button>
            {expandedIdx === idx && (
              <div className="px-5 pb-5 border-t border-slate-800/50">
                <div className="prose prose-invert prose-sm max-w-none mt-4
                  prose-headings:text-white prose-headings:font-bold
                  prose-p:text-slate-400 prose-p:leading-relaxed
                  prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white
                  prose-code:text-indigo-300 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-[#0a0c10] prose-pre:border prose-pre:border-slate-800
                  prose-img:rounded-xl prose-img:max-h-48
                  prose-li:text-slate-400
                  prose-blockquote:border-indigo-500/40 prose-blockquote:text-slate-400
                ">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.content}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
