import RegisterForm from "../_components/RegisterForm";

export const metadata = {
  title: "Register | FixItNow",
  description: "Create a new account on FixItNow",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        <RegisterForm />
      </div>
    </div>
  );
}
