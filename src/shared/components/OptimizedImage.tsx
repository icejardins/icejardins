import { useState, useRef, useEffect, type CSSProperties, type ImgHTMLAttributes } from "react";
import styles from "./OptimizedImage.module.css";

export interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  avifSrc?: string;
  webpSrc?: string;
  autoFormats?: boolean;
  aspectRatio?: string | number;
  objectFit?: CSSProperties["objectFit"];
  showSkeleton?: boolean;
  containerClassName?: string;
}

function deriveFormats(src: string) {
  if (!src || src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return { avif: undefined, webp: undefined };
  }

  const lastDotIndex = src.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return { avif: undefined, webp: undefined };
  }

  const basePath = src.slice(0, lastDotIndex);
  const ext = src.slice(lastDotIndex).toLowerCase();

  let avif: string | undefined;
  let webp: string | undefined;

  if (ext !== ".avif") {
    avif = `${basePath}.avif`;
  }
  if (ext !== ".webp" && ext !== ".avif") {
    webp = `${basePath}.webp`;
  }

  return { avif, webp };
}

export function OptimizedImage({
  src,
  alt,
  avifSrc: customAvifSrc,
  webpSrc: customWebpSrc,
  autoFormats = false,
  aspectRatio,
  objectFit,
  showSkeleton = true,
  containerClassName = "",
  className = "",
  style,
  loading = "lazy",
  decoding = "async",
  onLoad,
  onError,
  ...restProps
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const derived = autoFormats ? deriveFormats(src) : { avif: undefined, webp: undefined };
  const avifSrc = customAvifSrc ?? derived.avif;
  const webpSrc = customWebpSrc ?? derived.webp;

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalWidth !== 0) {
      setIsLoaded(true);
    }
  }, [src]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(e);
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    setIsLoaded(true);
    if (onError) {
      onError(e);
    }
  };

  const containerStyle: CSSProperties = {
    ...(aspectRatio ? { aspectRatio: String(aspectRatio) } : {}),
  };

  const imgStyle: CSSProperties = {
    ...(objectFit ? { objectFit } : {}),
    ...style,
  };

  const combinedImgClassName = `${styles.image} ${isLoaded ? styles.imageLoaded : ""} ${className}`.trim();
  const combinedContainerClassName = `${styles.wrapper} ${containerClassName}`.trim();

  return (
    <div className={combinedContainerClassName} style={containerStyle}>
      {!isLoaded && showSkeleton && !hasError && <div className={styles.skeleton} aria-hidden="true" />}
      <picture>
        {avifSrc && <source srcSet={avifSrc} type="image/avif" />}
        {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          className={combinedImgClassName}
          style={imgStyle}
          onLoad={handleLoad}
          onError={handleError}
          {...restProps}
        />
      </picture>
    </div>
  );
}
