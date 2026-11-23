import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "cn";
import { Input } from "@/components/ui/input";

function PasswordInput({ className, ...props }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative w-full">
      <Input
        {...props}
        type={isVisible ? "text" : "password"}
        className={cn("pr-12", className)}
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 z-10 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => setIsVisible(visible => !visible)}
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
      >
        {isVisible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
      </button>
    </div>
  );
}

export { PasswordInput };
