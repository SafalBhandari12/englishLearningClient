import AuthGuard from "@/components/AuthGuard";
import CompleteRegistrationForm from "@/components/CompleteRegistrationForm";

export default function Home() {
  return (
    <AuthGuard requireAuth={true}>
      <div>
        <h1 className='text-5xl'>Tell me about yourself</h1>
        <CompleteRegistrationForm />
      </div>
    </AuthGuard>
  );
}
