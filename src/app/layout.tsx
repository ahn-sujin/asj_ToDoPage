import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kanban Todo List | FE_안수진",
  description: "업무의 효율을 증진시키기 위한 칸반형태의 To-Do List",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
