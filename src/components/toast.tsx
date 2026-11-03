"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
  status?: number; // e.g. 200, 201, 404, 400
}

interface ToastContextType {
  toast: (options: Omit<ToastMessage, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback(
    ({ type, title, message, status }: Omit<ToastMessage, "id">) => {
      const id = `${Date.now()}_${Math.random()}`;
      const newToast: ToastMessage = { id, type, title, message, status };

      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after 4.5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getStatusBadge = (status?: number) => {
    if (!status) return null;
    let color = "bg-slate-100 text-slate-700 border-slate-300";
    if (status >= 200 && status < 300) {
      color = "bg-emerald-100 text-emerald-800 border-emerald-300 font-mono";
    } else if (status >= 400 && status < 500) {
      color = "bg-amber-100 text-amber-800 border-amber-300 font-mono";
    } else if (status >= 500) {
      color = "bg-rose-100 text-rose-800 border-rose-300 font-mono";
    }

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${color}`}
      >
        HTTP {status}
      </span>
    );
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast floating container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
              t.type === "success"
                ? "bg-white border-emerald-200 text-slate-800 shadow-emerald-50"
                : t.type === "error"
                ? "bg-white border-rose-200 text-slate-800 shadow-rose-50"
                : "bg-white border-indigo-200 text-slate-800 shadow-indigo-50"
            }`}
          >
            {t.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            )}
            {t.type === "error" && (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            {t.type === "info" && (
              <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="text-sm font-semibold text-slate-900">{t.title}</p>
                {getStatusBadge(t.status)}
              </div>
              {t.message && (
                <p className="text-xs text-slate-600 leading-relaxed break-words">
                  {t.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
