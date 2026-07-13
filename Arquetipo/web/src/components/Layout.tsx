import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header>
        <h1>BP -- Banca por Internet</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
