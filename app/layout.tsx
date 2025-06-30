import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: (process.env.PAGE_TITLE as string) || "QuickChat AI",
    description:
        (process.env.PAGE_DESCRIPTION as string) || "AI Chat Application",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider attribute="class">
                    <div className=" dark:bg-background w-full">{children}</div>
                </ThemeProvider>
            </body>
        </html>
    );
}
