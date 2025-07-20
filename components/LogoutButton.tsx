import { logoutAction } from "@/actions/auth";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type='submit' className=' hover:text-gray-800 hover:underline hover:cursor-pointer'>
        Logout
      </button>{" "}
    </form>
  );
}
