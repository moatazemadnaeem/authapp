"use client";

import { useAuth } from "@/hooks/use-auth";
import { LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

export default function DashboardPage() {
  const { user, message, isLoading: authLoading, logout } = useAuth();
  
  const { data: trpcData, isLoading: trpcLoading } = trpc.secretMessage.useQuery(undefined, {
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 p-4 md:p-8">
      {/* Navbar */}
      <header className="flex w-full items-center justify-between py-4 max-w-6xl mx-auto mb-8 border-b border-zinc-800">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
            <UserIcon className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-zinc-100">FullStackAuth</span>
        </div>
        <Button
          onClick={logout}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-300 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="font-semibold tracking-wide">Logout</span>
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto flex flex-col items-center justify-center relative">
        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />

        <Card className="w-full max-w-2xl border-zinc-800 bg-zinc-900/60 backdrop-blur-xl shadow-2xl relative z-10 p-8 text-center">
          <CardContent className="space-y-6 pt-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {message || "Welcome to the application."}
            </h1>
            <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 inline-block">
              <p className="text-zinc-300 mb-2">
                You are successfully authenticated as:
              </p>
              <div className="flex items-center justify-center space-x-3 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="font-medium text-zinc-100">{user?.email}</p>
                </div>
              </div>

              {/* tRPC Example */}
              <div className="mt-6 p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 text-left">
                <h3 className="text-sm font-semibold text-blue-400 mb-2 flex items-center">
                  <span className="h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse" />
                  tRPC Response
                </h3>
                {trpcLoading ? (
                  <p className="text-sm text-zinc-400">Loading protected procedure...</p>
                ) : (
                  <p className="text-sm text-zinc-200 font-mono break-words">
                    {trpcData?.secret || "Failed to load tRPC data"}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
