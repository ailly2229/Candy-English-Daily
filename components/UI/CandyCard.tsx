import { type HTMLAttributes } from "react";

export function CandyCard({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`candy-card ${className}`} {...props} />;
}
