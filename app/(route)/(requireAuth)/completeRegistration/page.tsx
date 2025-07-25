import AuthGuard from "@/components/AuthGuard";
import CompleteRegistrationForm from "@/components/CompleteRegistrationForm";

export default function Home() {
  return (
    <AuthGuard requireAuth={true}>
      <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
        <div className='max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-12 relative overflow-hidden'>
          {/* Subtle background pattern */}
          <div className='absolute inset-0 bg-gradient-to-br from-gray-50/30 via-transparent to-gray-100/20 pointer-events-none' />

          {/* Content */}
          <div className='relative z-10'>
            <div className='text-center mb-8'>
              <h1 className='text-5xl md:text-6xl font-black mb-6 text-gray-900 tracking-tight leading-tight'>
                Tell us about
                <span className='block text-gray-600 font-medium text-4xl md:text-5xl mt-2'>
                  yourself
                </span>
              </h1>

              <div className='inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-8'>
                <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
                <span className='text-sm font-medium text-gray-700'>
                  Your story matters
                </span>
              </div>

              <p className='text-xl text-gray-600 leading-relaxed max-w-lg mx-auto'>
                Share your interests, hobbies, and anything you&apos;d like your
                AI tutor to know about you
              </p>
            </div>

            <CompleteRegistrationForm />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
