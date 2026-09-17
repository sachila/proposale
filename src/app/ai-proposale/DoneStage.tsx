const DoneStage = ({ url }: { url: string }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-black dark:text-zinc-50">
        Draft created. Review and send it whenever you&apos;re ready.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Open in Proposales
      </a>
    </div>
  );
};

export default DoneStage;
