import { login } from "../../utils/supabase/actions";

export default function LoginPage() {
  return (
    <div className="h-lvh flex items-center">
      <form className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email:
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password:
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          formAction={login}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
