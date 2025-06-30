const AuthImagePattern = ({ title, subtitle }) => {
//   console.log("Title:", title, "Subtitle:", subtitle);

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md w-full text-center">
        {/* Animated Grid Blocks */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-xl ${
                i % 2 === 0
                  ? "bg-primary/30 animate-pulse"
                  : "bg-primary/10"
              }`}
            />
          ))}
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-3xl font-bold text-primary mb-3">{title}</h2>
        <p className="text-base text-base-content/70 leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
