import 'tailwindcss/tailwind.css'
import "../styles/global.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "web-editor.js",
  description: "An online web editor.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
