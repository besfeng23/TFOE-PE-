import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <g fill="currentColor">
        <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z" />
        <path d="M172.4 96.69a4 4 0 0 0-5.92 1.39L133.3 151.8l-15-21.25a4 4 0 1 0-6.52 4.58l18.41 26.1a4 4 0 0 0 6.52-.1l35.4-58a4 4 0 0 0-1.31-5.92Z" />
        <path d="M128 80a47.92 47.92 0 0 0-44.66 28.53A4 4 0 1 0 90 111.8a40 40 0 0 1 76 0 4 4 0 1 0 6.63-3.27A48 48 0 0 0 128 80Z" />
      </g>
    </svg>
  );
}
