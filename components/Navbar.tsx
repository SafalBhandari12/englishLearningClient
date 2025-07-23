import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { getCurrentUser } from "@/lib/serverAuth";
import { Button } from "./ui/button";

export const Navbar = async () => {
  const user = await getCurrentUser();
  return (
    <nav className='bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-40'>
      <div className='container mx-auto flex justify-between items-center gap-2 px-4 py-4'>
        <Link
          href='/'
          className='flex items-center space-x-2 group'
          prefetch={false}
        >
          <div className='w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform'>
            <svg
              className='w-5 h-5 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
              />
            </svg>
          </div>
          <div className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:text-blue-700 transition-colors'>
            English Learning
          </div>
        </Link>

        {user ? (
          <div className='flex items-center space-x-4'>
            <Button
              asChild
              variant='neutral'
              className='hover:bg-blue-50 hover:text-blue-600'
            >
              <Link href='/dashboard'>
                <svg
                  className='w-4 h-4 mr-2'
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
                Dashboard
              </Link>
            </Button>
            <Button
              asChild
              variant='neutral'
              className='hover:bg-blue-50 hover:text-blue-600'
            >
              <Link href='/profile'>
                <svg
                  className='w-4 h-4 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
                Profile
              </Link>
            </Button>
            <LogoutButton />
          </div>
        ) : (
          <div className='flex items-center space-x-4'>
            <Button
              asChild
              variant='neutral'
              className='hover:bg-blue-50 hover:text-blue-600'
            >
              <Link href='/login'>Sign In</Link>
            </Button>
            <Button
              asChild
              className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            >
              <Link href='/register'>Get Started</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
