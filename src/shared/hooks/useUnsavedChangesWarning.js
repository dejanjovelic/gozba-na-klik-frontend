import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

export function useUnsavedChangesWarning(isDirty, message = "Unsaved changes will be lost. Do you really want to leave?") {
  const blocker = useBlocker(isDirty);

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirm = window.confirm(message);
      if (confirm) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker, message]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = message;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty, message]);
}