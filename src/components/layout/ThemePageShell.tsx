import { ThemeRenderer } from "@/core/theme/ThemeRenderer";
import { DefaultFallbackHeader } from "./DefaultFallbackHeader";
import { DefaultFallbackFooter } from "./DefaultFallbackFooter";

type ThemePageShellProps = {
  children: React.ReactNode;
  hideFooter?: boolean;
};

export function ThemePageShell({ children, hideFooter }: ThemePageShellProps) {
  return (
    <ThemeRenderer name="Layout">
      <ThemeRenderer name="Header" fallback={<DefaultFallbackHeader />} />
      {children}
      {!hideFooter && (
        <ThemeRenderer name="Footer" fallback={<DefaultFallbackFooter />} />
      )}
    </ThemeRenderer>
  );
}
