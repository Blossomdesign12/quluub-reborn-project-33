
import * as React from "react";
import { Lock as LucideLock } from "lucide-react";

// Export the Lock component properly for React use
export const Lock = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>((props, ref) => <LucideLock ref={ref} {...props} />);
Lock.displayName = "LockIcon";
