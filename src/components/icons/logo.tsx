import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      {...props}
    >
      <circle cx="100" cy="100" r="95" fill="#000" stroke="#E7B100" strokeWidth="5" />
      <circle cx="100" cy="100" r="85" fill="#2B579A" />
      
      {/* Eagle Body - Simplified */}
      <path d="M100 60 L80 90 L120 90 Z" fill="#FFF" />
      <path d="M90 90 Q100 100 110 90" fill="none" stroke="#E0E0E0" strokeWidth="2" />
      <path d="M80 90 C 70 110, 80 130, 90 140 L110 140 C120 130, 130 110, 120 90" fill="#FFF" />
      <path d="M95 135 L105 135 L100 145 Z" fill="#FFC107"/>
      
      {/* Wings - Simplified */}
      <path d="M80 90 C 40 70, 50 40, 70 30 L80 60" fill="#FFF" stroke="#DDD" strokeWidth="1" />
      <path d="M120 90 C 160 70, 150 40, 130 30 L120 60" fill="#FFF" stroke="#DDD" strokeWidth="1" />

      {/* Text Path */}
      <defs>
        <path id="circlePath" d="M 30 100 A 70 70, 0, 1, 1, 170 100" />
        <path id="bottomPath" d="M 45 135 Q 100 165 155 135" />
      </defs>
      
      <text fill="#E7B100" fontSize="14" fontWeight="bold">
        <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
          THE FRATERNAL ORDER OF EAGLES
        </textPath>
      </text>
      
       <text fill="#E7B100" fontSize="14" fontWeight="bold">
        <textPath href="#bottomPath" startOffset="50%" textAnchor="middle">
          PHILIPPINE EAGLES
        </textPath>
      </text>
    </svg>
  );
}
