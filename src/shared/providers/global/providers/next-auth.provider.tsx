"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import React, { useEffect } from "react";

function SessionValidator({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      // Force sign out when token expires, which will redirect them to login
      signOut();
    }
  }, [session]);

  return <>{children}</>;
}

export default function NextAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SessionValidator>
        {children}
      </SessionValidator>
    </SessionProvider>
  );
}
