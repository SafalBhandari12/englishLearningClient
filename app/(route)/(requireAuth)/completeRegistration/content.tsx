"use client";

import CompleteRegistrationForm from "@/components/CompleteRegistrationForm";

export default function CompleteRegistrationContent() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #fef3e6 0%, #faf8f3 50%, #f0ebe5 100%)",
      }}
    >
      {/* Organic floating shapes background */}
      <div
        className="absolute top-10 left-10 w-72 h-72 bg-orange-200/20 rounded-full filter blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: "4s" }}
      />
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-amber-100/15 rounded-full filter blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: "5s", animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-64 h-64 bg-orange-100/10 rounded-full filter blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: "6s", animationDelay: "2s" }}
      />

      {/* Main card */}
      <div className="max-w-xl w-full relative z-10 mx-4 my-8">
        {/* Decorative top element */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 border-2 border-orange-200/30 rounded-full pointer-events-none" />

        <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border-4 border-amber-900 p-8 md:p-12 relative overflow-hidden">
          {/* Bold accent bar - neo brutalism element */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-orange-600" />
          <div className="absolute bottom-0 right-0 w-2 h-20 bg-amber-900" />
          {/* Subtle texture overlay */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(217, 119, 6, 0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Gradient accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-100/30 via-amber-50/20 to-transparent rounded-full filter blur-3xl pointer-events-none" />

          {/* Content */}
          <div className="relative z-10">
            <div className="text-center mb-12 animate-fade-in">
              <h1
                className="text-3xl md:text-5xl font-black mb-3 text-amber-950 leading-tight tracking-tighter uppercase"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                Let&apos;s Get Personal
              </h1>

              <p
                className="text-lg md:text-xl text-amber-900/70 mt-6 leading-relaxed max-w-lg mx-auto font-light"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                Help your AI tutor understand what makes you unique. Share your
                passions, interests, and goals—it&apos;s what makes learning{" "}
                <span className="italic font-medium text-orange-700">
                  meaningful
                </span>
                .
              </p>

              {/* Progress indicator */}
              <div className="mt-8 flex justify-center items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-400" />
                <div className="w-3 h-3 rounded-full bg-orange-300" />
                <div className="w-3 h-3 rounded-full bg-orange-200" />
                <span className="text-xs text-orange-800/60 ml-2 font-medium">
                  Final step
                </span>
              </div>
            </div>

            <CompleteRegistrationForm />

            {/* Footer motivation */}
            <p
              className="text-center text-sm text-amber-900/50 mt-8"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              This helps us personalize your learning experience
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
