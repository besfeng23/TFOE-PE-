import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10z" />
        <path d="M12.1 12.5a2.5 2.5 0 0 1-4.2 0" />
        <path d="M16.1 12.5a2.5 2.5 0 0 1-4.2 0" />
        <path d="M14.1 8.5a2.5 2.5 0 0 1-4.2 0" />
        <path d="M9 17a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2H9v-2z" />
    </svg>
  );
}
