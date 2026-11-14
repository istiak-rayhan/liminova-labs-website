"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track } from "@/lib/track";

type Props = ComponentProps<typeof Link> & {
  event: string;
  eventData?: Record<string, string | number | boolean>;
};

export default function TrackLink({
  event,
  eventData,
  onClick,
  ...props
}: Props) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        track(event, eventData);
        onClick?.(e);
      }}
    />
  );
}
