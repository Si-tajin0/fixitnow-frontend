import RegisterForm from "../_components/RegisterForm";

export const metadata = {
  title: "Register | FixItNow",
  description: "Create a new account on FixItNow",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <RegisterForm />
    </div>
  );
}
