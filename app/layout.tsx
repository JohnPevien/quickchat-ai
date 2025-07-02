import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { PAGE_TITLE, PAGE_DESCRIPTION } from "@/config/constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
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
