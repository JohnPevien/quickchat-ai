"use client";

import { AiFillGithub, AiOutlineTwitter } from "react-icons/ai";

/**
 * Global footer shown on all pages.
 * Adheres to the project's code-style and Next.js conventions.
 */
export default function Footer() {
    return (
        <footer className="container mx-auto max-w-prose border-t border-border py-8 mt-16">
            <p className="text-center text-sm text-muted-foreground mb-6">
                This app uses AI and may produce inaccurate results
            </p>
            <div className="flex flex-row justify-between items-center mb-8">
                <div>
                    <p className="text-sm text-muted-foreground">
                        Powered by{" "}
                        <a
                            href="https://vercel.com/"
                            className="underline hover:text-foreground transition-colors"
                            rel="noreferrer"
                        >
                            Vercel
                        </a>
                    </p>
                </div>
                <div className="flex flex-row gap-3">
                    <a
                        href="https://github.com/JohnPevien/quickchat-ai"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <AiFillGithub size="2em" />
                    </a>
                    <a
                        href="https://twitter.com/JohnPevien"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <AiOutlineTwitter size="2em" />
                    </a>
                </div>
            </div>
        </footer>
    );
}
