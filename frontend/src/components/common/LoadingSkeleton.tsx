import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`gc-skeleton ${className}`} />
);

export const StatCardSkeleton: React.FC = () => (
  <div className="gc-card p-5 flex items-center justify-between">
    <div className="space-y-2 flex-1">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
    <Skeleton className="h-12 w-12 rounded-xl" />
  </div>
);

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => (
  <tr className="border-b border-[var(--color-border)]">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className="h-3.5 w-full" />
      </td>
    ))}
  </tr>
);

export const CardSkeleton: React.FC = () => (
  <div className="gc-card p-5 space-y-4">
    <div className="flex justify-between">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-24" />
    </div>
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <div className="pt-3 border-t border-[var(--color-border)] flex justify-between items-center">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
  </div>
);

export const PageSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    <div className="gc-card p-6 flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-10 w-32 rounded-xl" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
    </div>
    <div className="gc-card p-4 space-y-2">
      {Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)}
    </div>
  </div>
);
