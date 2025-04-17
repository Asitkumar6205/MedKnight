export default function AccountSuspended() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="mb-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 text-red-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Account Suspended</h1>
          
          <p className="text-gray-600 mb-6">
            Your account has been suspended. Please contact an administrator for 
            assistance with reactivating your account.
          </p>
          
          <div className="p-4 bg-gray-50 rounded-md mb-6">
            <p className="text-sm text-gray-500">
              If you believe this is an error, please email us at{" "}
              <a 
                href="mailto:support@example.com" 
                className="text-blue-600 hover:underline"
              >
                support@medknight.in
              </a>
            </p>
          </div>
          
          <a
            href="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }