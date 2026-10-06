import { useState } from 'react';

/**
 * Reusable screenshot component with fixed aspect ratio, lazy loading, and placeholder fallback.
 */
export const Screenshot = ({
  src,
  alt,
  caption,
  width = 800,
  height = 450,
  aspectRatio = '16/9',
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <figure className="space-y-2">
      <div
        className="relative w-full overflow-hidden rounded-[2px] border border-[#2E2A21] bg-[#1E1B15]"
        style={{ aspectRatio }}
      >
        {!hasError && src ? (
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            onError={() => setHasError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center border-2 border-dashed border-[#2E2A21] p-6 text-center">
            <span className="font-mono text-xs text-[#E8A33D]">[FILL: screenshot]</span>
            <p className="mt-2 font-mono text-xs text-[#B9B09A] max-w-sm">{alt}</p>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="font-mono text-xs text-[#B9B09A] text-center">
          // {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default Screenshot;
