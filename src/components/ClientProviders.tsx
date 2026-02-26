
"use client";

import GoogleTranslate from "./GoogleTranslate";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GoogleTranslate />
      {children}
    </>
  );
}
