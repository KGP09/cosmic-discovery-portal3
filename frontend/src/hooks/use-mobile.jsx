import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function MobileIndicator() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return (
    <div>
      {isMobile === undefined ? (
        <p>Checking screen size...</p>
      ) : isMobile ? (
        <p>You are on a mobile device</p>
      ) : (
        <p>You are on a desktop</p>
      )}
    </div>
  );
}
