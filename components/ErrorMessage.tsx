"use client";

import { AlertCircle, RefreshCw, WifiOff, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  message: string;
  errorType?: "connection" | "rate-limit" | "no-results" | "default";
  onRetry?: () => void;
}

export function ErrorMessage({
  message,
  errorType,
  onRetry,
}: ErrorMessageProps) {
  const getErrorIcon = () => {
    switch (errorType) {
      case "connection":
        return <WifiOff className="size-6 text-destructive" />;
      case "rate-limit":
        return <Clock className="size-6 text-destructive" />;
      case "no-results":
        return <Search className="size-6 text-destructive" />;
      default:
        return <AlertCircle className="size-6 text-destructive" />;
    }
  };
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border-2 border-destructive/20 bg-destructive/5 p-6 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Error Icon */}/
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
            {getErrorIcon()}
          </div>
          {/* Error Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-destructive">
              Something went wrong
            </h3>
            <p className="text-sm text-destructive-foreground/80">{message}</p>
          </div>
          {/* Retry Button */}
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="destructive"
              className="mt-2 gap-2"
            >
              <RefreshCw className="size-4" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
