import { type TextareaHTMLAttributes } from 'react';

import { cn } from '../../lib/utils';

export interface HTMLEditorProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export default function HTMLEditor({ className, ...props }: HTMLEditorProps) {
  return (
    <textarea
      {...props}
      className={cn(
        'min-h-48 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
    />
  );
}
