const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-20 pb-10 ">
      <div className="max-w-md text-center m-10">
        <div className="grid grid-cols-5 gap-10 m-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary/80 ${
                i % 2 === 0 ? "animate-bounce" : ""
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
