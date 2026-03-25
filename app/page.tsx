export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            DevHire
          </span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Developer Hiring Platform
        </p>
        <div className="flex items-center justify-center gap-2 mt-6">
          <span className="inline-block w-2 h-2 rounded-full bg-secondary-500 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="inline-block w-2 h-2 rounded-full bg-secondary-500 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="inline-block w-2 h-2 rounded-full bg-secondary-500 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-600">
          Setting up your platform...
        </p>
      </div>
    </main>
  );
}