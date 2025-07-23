import AuthGuard from "@/components/AuthGuard";
import CompleteRegistrationForm from "@/components/CompleteRegistrationForm";

export default function Home() {
  return (
    <AuthGuard requireAuth={true}>
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-white px-4'>
        <div className='max-w-xl w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4 text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-center'>
            Tell us about yourself&nbsp;(&apos;your story matters!&apos;)
          </h1>
          <p className='text-lg text-gray-600 mb-6 text-center'>
            Share your interests, hobbies, and anything you&apos;d like your AI
            tutor to know!
          </p>
          <CompleteRegistrationForm />
        </div>
      </div>
    </AuthGuard>
  );
}
