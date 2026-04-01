import AuthGuard from "@/components/AuthGuard";
import CompleteRegistrationContent from "./content";

export default function Home() {
  return (
    <AuthGuard requireAuth={true}>
      <CompleteRegistrationContent />
    </AuthGuard>
  );
}
