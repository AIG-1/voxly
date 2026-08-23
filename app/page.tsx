import Link from "next/link";
import VoxlyLogo from "@/components/VoxlyLogo";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <VoxlyLogo size={36} />
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Start free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-8 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
          AI-powered sales call analysis
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
          Every call is a coaching<br />opportunity. <span className="text-indigo-400">Start using them.</span>
        </h1>

        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Upload your sales recordings. Voxly transcribes, scores, and delivers instant coaching feedback —
          without the $100+/seat price tag of Gong.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/signup"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors"
          >
            Get started free →
          </Link>
          <Link
            href="/login"
            className="text-gray-400 hover:text-white text-base px-4 py-3.5 transition-colors"
          >
            Already have an account?
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left">
          {[
            {
              icon: "🎯",
              title: "Talk ratio & pacing",
              desc: "Know exactly how much your reps talk vs. listen. Optimal: 43% rep / 57% customer.",
            },
            {
              icon: "🛡️",
              title: "Objection tracking",
              desc: "Every objection flagged, categorized, and tracked across your team over time.",
            },
            {
              icon: "📈",
              title: "Coaching scores",
              desc: "Each rep gets a call score with specific feedback — like having a manager on every call.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Pricing callout */}
        <div className="mt-16 bg-gradient-to-r from-indigo-950 to-gray-900 border border-indigo-800 rounded-2xl p-8">
          <p className="text-gray-400 text-sm mb-2">Simple pricing</p>
          <p className="text-3xl font-bold text-white mb-1">
            $39 <span className="text-lg font-normal text-gray-400">/user/month</span>
          </p>
          <p className="text-gray-400 text-sm">vs. Gong at $100+/seat. Same insights. No sales call required to buy.</p>
        </div>
      </main>

      <footer className="text-center py-8 text-gray-600 text-sm border-t border-gray-800">
        © 2025 Voxly · Applied Intelligence Holdings
      </footer>
    </div>
  );
}
