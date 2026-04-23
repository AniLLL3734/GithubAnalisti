import { LuCopy, LuCircleCheck, LuTrendingUp } from 'react-icons/lu';

export default function PromptSection({ prompt, copied, onCopy, t }) {
  if (!prompt) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <LuTrendingUp className="w-5 h-5 text-indigo-400" />
          {t.promptSection.title}
        </h2>
        <button onClick={onCopy}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
            copied ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-slate-200'
          }`}>
          {copied ? <LuCircleCheck className="w-5 h-5" /> : <LuCopy className="w-5 h-5" />}
          {copied ? t.promptSection.copied : t.promptSection.copy}
        </button>
      </div>
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
        <textarea readOnly value={prompt}
          className="relative w-full h-[400px] p-6 bg-[#12151c] border border-slate-800 rounded-3xl text-slate-300 font-mono text-xs leading-relaxed focus:outline-none resize-none shadow-2xl" />
      </div>
      <p className="text-center text-slate-500 text-xs">{t.promptSection.hint}</p>
    </div>
  );
}
