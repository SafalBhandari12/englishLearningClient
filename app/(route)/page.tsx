import Link from "next/link";
import { Button } from "@/components/ui/button";

export const revalidate = 0;

export default function Home() {
  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <div className='relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600'>
        <div className='absolute inset-0 bg-black opacity-10'></div>
        <div className='relative container mx-auto px-4 py-20 sm:py-32'>
          <div className='text-center'>
            <h1 className='text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight'>
              Master English with
              <span className='block text-yellow-300'>AI-Powered Learning</span>
            </h1>
            <p className='text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto'>
              Improve your pronunciation, fluency, and confidence through
              interactive conversations with our advanced AI tutor.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <Button
                asChild
                size='lg'
                className='bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 text-lg'
              >
                <Link href='/register'>Start Learning Free</Link>
              </Button>
              <Button
                asChild
                variant='outline'
                size='lg'
                className='border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg'
              >
                <Link href='/login'>Sign In</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className='absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-pulse'></div>
        <div className='absolute bottom-10 right-10 w-32 h-32 bg-purple-300 rounded-full opacity-20 animate-pulse delay-700'></div>
        <div className='absolute top-1/2 left-1/4 w-16 h-16 bg-pink-300 rounded-full opacity-20 animate-pulse delay-1000'></div>
      </div>

      {/* Features Section */}
      <div className='py-20 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4'>
              Why Choose Our Platform?
            </h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              Advanced AI technology meets personalized learning to help you
              achieve fluency faster.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-shadow'>
              <div className='w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6'>
                <svg
                  className='w-8 h-8 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>
                Real-time Pronunciation
              </h3>
              <p className='text-gray-600'>
                Get instant feedback on your pronunciation with our advanced
                speech recognition technology.
              </p>
            </div>

            <div className='text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-shadow'>
              <div className='w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6'>
                <svg
                  className='w-8 h-8 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>
                Progress Tracking
              </h3>
              <p className='text-gray-600'>
                Monitor your improvement with detailed analytics on accuracy,
                fluency, and completeness.
              </p>
            </div>

            <div className='text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-shadow'>
              <div className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6'>
                <svg
                  className='w-8 h-8 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>
                Interactive Conversations
              </h3>
              <p className='text-gray-600'>
                Practice with our AI tutor through engaging, contextual
                conversations tailored to your level.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className='py-20 bg-gradient-to-r from-indigo-600 to-purple-600'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl sm:text-4xl font-bold text-white mb-6'>
            Ready to Transform Your English?
          </h2>
          <p className='text-xl text-indigo-100 mb-8 max-w-2xl mx-auto'>
            Join thousands of learners who have improved their English skills
            with our AI-powered platform.
          </p>
          <Button
            asChild
            size='lg'
            className='bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg'
          >
            <Link href='/register'>Get Started Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
