import { LoginForm } from './login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
      <div className="w-full max-w-md p-8 space-y-4 rounded-xl bg-[#1E293B]">
        <h1 className="text-3xl font-bold text-center text-[#F8FAFC]">
          Welcome to Tangerine
        </h1>
        <p className="text-center text-[#94A3B8]">
          Healthcare Management System
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
