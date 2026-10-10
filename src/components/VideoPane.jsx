import { forwardRef } from "react";

const VideoPane = forwardRef(function VideoPane({ label, video, poster }, ref) {
  return (
    <figure className="viewer">
      <figcaption className="viewer-bar mono">{label}</figcaption>
      <video
        ref={ref}
        className="viewer-video"
        muted
        playsInline
        loop
        preload="metadata"
        poster={poster}
        aria-label={label}
      >
        <source src={video.webm} type="video/webm" />
        <source src={video.mp4} type="video/mp4" />
      </video>
    </figure>
  );
});

export default VideoPane;
