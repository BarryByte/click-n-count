import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Sparkles, Zap, Rocket, Star, Crown } from "lucide-react";

export default function FrontPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-500 opacity-20 animate-pulse" />
      
      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjEiLz48L3N2Zz4=')] opacity-50" />

      <div className="relative flex items-center justify-center min-h-screen p-8">
        <div className="w-11/12 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Section */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 transform hover:scale-105 transition-all duration-300 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <Rocket className="w-8 h-8 text-fuchsia-400" />
                <h1 className="text-4xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Poll It!
                </h1>
              </div>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                ✨ Create viral polls that hit different! Share your vibe and get instant feedback from your squad.
              </p>
              <ul className="space-y-4">
                {[
                  "No cap, ready in seconds 🚀",
                  "Bussin' interface that slaps 💅",
                  "Real-time results = zero waiting ⚡",
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <span className="text-gray-300">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Middle Section */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 flex flex-col items-center justify-center transform hover:scale-105 transition-all duration-300 border border-white/20">
              <div className="relative mb-6">
                <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-yellow-400 animate-pulse" />
                <QRCodeSVG
                  value="http://localhost:3000/session/join"
                  size={200}
                  bgColor="rgba(255, 255, 255, 0.9)"
                  fgColor="#7c3aed"
                  level="Q"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <button className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-bold text-lg shadow-lg hover:shadow-fuchsia-500/25 transition duration-300 flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                Start Polling
              </button>
            </div>

            {/* Right Section */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 transform hover:scale-105 transition-all duration-300 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <Crown className="w-8 h-8 text-yellow-400" />
                <h2 className="text-3xl font-black">Level Up!</h2>
              </div>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Fr fr, our dashboard is giving main character energy. Track your polls and watch the magic happen! 🎭✨
              </p>
              <div className="space-y-4">
                <button className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl font-bold text-lg shadow-lg hover:shadow-green-500/25 transition duration-300">
                  Vibe Check Dashboard
                </button>
                <button className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl font-bold text-lg shadow-lg hover:shadow-blue-500/25 transition duration-300">
                  Spill the Tea (Docs)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}