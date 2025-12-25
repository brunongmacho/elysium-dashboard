export default function Home() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          Boss Spawn Timers
        </h1>
        <p className="text-gray-400">
          Real-time tracking of all boss spawns
        </p>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-8 text-center">
        <div className="flex items-center justify-center space-x-2 text-gray-400">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg">
            Setting up MongoDB connection...
          </p>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Phase 1: Project initialization complete! ✅
        </p>
      </div>
    </div>
  );
}
