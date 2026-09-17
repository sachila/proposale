const NoResult = ({
  title = "Nothing to show yet",
  message,
}: {
  title?: string;
  message: string;
}) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="max-w-sm text-zinc-400">{message}</p>
    </div>
  );
};

export default NoResult;
