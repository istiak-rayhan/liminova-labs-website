import Image from "next/image";

export default function BrandLogo({
  size = 32,
  className = "",
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/liminova-mark.jpg"
      alt="Liminova Labs"
      width={size}
      height={size}
      className={`rounded-lg ${className}`.trim()}
      priority={priority}
    />
  );
}
