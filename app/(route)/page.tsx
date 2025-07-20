import Link from "next/link";

export const revalidate = 0;

export default function Home() {
  return (
    <div>
      <h1>Welcome to Find Peers</h1>
      <p>Your one-stop solution for finding study buddies.</p>
      <Link href='/login'>Login</Link>
    </div>
  );
}
