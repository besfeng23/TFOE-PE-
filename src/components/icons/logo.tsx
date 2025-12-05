import type { SVGProps } from 'react';
import Image from 'next/image';

export function Logo(props: SVGProps<SVGSVGElement> & { className?: string }) {
  // The user requested to use an image from the public folder.
  // We will use the Next.js Image component for optimization and proper handling.
  // The 'props' are passed to maintain size and style consistency where the logo is used.
  return (
    <Image
      src="/Images.png"
      alt="The Fraternal Order of Eagles - Philippine Eagles Logo"
      width={100} // Default width, can be overridden by className
      height={100} // Default height, can be overridden by className
      className={props.className}
      // The rest of the props are not standard for the Image component, so we omit them.
    />
  );
}
