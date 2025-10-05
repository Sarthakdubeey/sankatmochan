
export const Header = () => {
  return (
    <header className="text-center mb-8 py-8 bg-black/30 rounded-2xl backdrop-blur-sm shadow-2xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-2xl">⚡</span>
        </div>
        Real-Time Weather Alert System
      </h1>
      <p className="text-xl opacity-90">
        Live notifications from IMD, NDMA, and Google Weather APIs
      </p>
    </header>
  );
};
