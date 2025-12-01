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
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M15.44 16.34c.9-.88 1.43-2.03 1.56-3.24" />
        <path d="M12 13.5c-1.6 0-3-1.3-3-3s1.4-3 3-3c.3 0 .7.1 1 .2" />
        <path d="m8.56 16.34c-.9-.88-1.43-2.03-1.56-3.24" />
        <path d="M12 22c1.657 0 3-1.79 3-4" />
        <path d="M12 22c-1.657 0-3-1.79-3-4" />
        <path d="m14 7 3-2" />
        <path d="m10 7-3-2" />
    </svg>
  );
}
