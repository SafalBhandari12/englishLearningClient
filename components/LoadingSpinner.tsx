"use client";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-2xl">
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div
            className="absolute inset-0 border-4 border-amber-200 rounded-full"
            style={{
              borderTopColor: "#b45309",
            }}
          />
          <style jsx>{`
            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
            div {
              animation: spin 1s linear infinite;
            }
          `}</style>
        </div>

        {/* Text */}
        <div className="text-center">
          <p
            className="text-amber-950 font-semibold"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            Processing...
          </p>
          <p
            className="text-sm text-amber-900/60 mt-1"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
          >
            Please wait
          </p>
        </div>
      </div>
    </div>
  );
}
