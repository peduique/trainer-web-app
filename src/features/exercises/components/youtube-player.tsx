interface Props {
  videoId: string;
  className?: string;
}

export function YoutubePlayer({ videoId, className = '' }: Props) {
  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-xl ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Exercise video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
