"use client";

import NumberFlowBase, { type Value } from "@number-flow/react";

interface NumberFlowProps {
  value: Value;
  className?: string;
}

export function NumberFlow({ value, className }: NumberFlowProps) {
  return (
    <div className={className}>
      <NumberFlowBase value={value} trend={false} />
    </div>
  );
}