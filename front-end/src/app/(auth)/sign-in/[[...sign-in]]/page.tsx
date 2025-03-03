import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-900 p-6">
      <div className="flex w-full max-w-5xl flex-col items-center gap-12 rounded-2xl bg-gray-850 p-10 shadow-2xl ring-1 ring-gray-700 md:flex-row">
        {/* Left Section - Hero Text */}
        <div className="flex flex-col items-center text-center md:w-1/2 md:items-start md:text-left">
          <h2 className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-4xl font-extrabold text-transparent">
            Share Files. Instantly.
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Secure, fast, and unlimited file transfers with end-to-end encryption.
          </p>
          <p className="mt-2 text-gray-400">Sign in to start sharing effortlessly.</p>
          <div className="mt-6 flex gap-4">
            <button className="rounded-lg bg-indigo-600 px-6 py-2 text-lg font-semibold text-white transition-all hover:bg-indigo-500">
              Learn More
            </button>
            <button className="rounded-lg border border-gray-600 px-6 py-2 text-lg font-semibold text-gray-300 transition-all hover:bg-gray-700">
              Contact Us
            </button>
          </div>
        </div>

        {/* Right Section - SignIn */}
        <div className="">
          <div className="rounded-xl bg-gray-900 p-6 shadow-lg ring-1 ring-gray-700">
            <SignIn appearance={{ variables: { colorPrimary: "#6366F1" } }} fallbackRedirectUrl={'/'} />
          </div>
        </div>
      </div>
    </div>
  );
}
