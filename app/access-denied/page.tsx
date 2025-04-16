export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
      <p className="text-lg text-stone-700 mt-4">
        You don't have permission to access this page because you are not authenticated.
      </p>
      <a href="/signin" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded">
        Go to Signin
      </a>
    </div>
  );
}