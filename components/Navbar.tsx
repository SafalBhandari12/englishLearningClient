import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { getCurrentUser } from "@/lib/serverAuth";

export const Navbar = async () => {
  const user = await getCurrentUser();
  return (
    <nav className='bg-secondary-background text-black px-5 py-4 border-b-4'>
      <div className='container mx-auto flex justify-between items-center gap-2 px-3'>
        <div className='text-lg font-bold'>Find Peers</div>
        {user ? (
          <div className='flex items-center space-x-6'>
            <Link
              href='/dashboard'
              className=' hover:text-gray-800 hover:underline'
            >
              Dashboard
            </Link>
            <Link
              href='/profile'
              className=' hover:text-gray-800 hover:underline hover:cursor-pointer'
            >
              Profile
            </Link>
            <LogoutButton />
          </div>
        ) : (
          <div className='flex items-center space-x-6'>
            <Link
              href='/login'
              className=' hover:text-gray-800 hover:underline'
            >
              Login
            </Link>
            <Link
              href='/register'
              className=' hover:text-gray-800 hover:underline hover:cursor-pointer'
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
