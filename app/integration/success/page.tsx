"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// 1. Isolate the logic that uses useSearchParams into its own component
function CallbackContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("status");
    const message = searchParams.get("message");
    const userId = searchParams.get("userId");

    // Send the message back to the window that opened this popup (HomePage)
    if (window.opener) {
      if (status === "success") {
        window.opener.postMessage(
          { type: "INSTAGRAM_AUTH_SUCCESS", userId: userId }, 
          window.location.origin
        );
      } else if (status === "error") {
        // This handles the error message sent from your Spring Boot controller
        const decodedMessage = message ? decodeURIComponent(message) : "Failed to connect.";
        
        window.opener.postMessage(
          { type: "INSTAGRAM_AUTH_ERROR", message: decodedMessage }, 
          window.location.origin
        );
      }
      
      // Close the popup window after signaling
      window.close();
    }
  }, [searchParams]);

  return <p className="text-muted-foreground">Finalizing your connection...</p>;
}

// 2. Wrap that component inside Suspense in the default export
export default function InstagramCallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Suspense fallback={<p className="text-muted-foreground">Finalizing your connection...</p>}>
        <CallbackContent />
      </Suspense>
    </div>
  );
}