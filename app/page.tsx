"use client";

import { useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import Head from "next/head";
import { Button, TextField, Select } from "@/components/form";
import { PAGE_TITLE, PAGE_DESCRIPTION } from "@/config/constants";
import { useTheme } from "next-themes";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";

export default function Chat() {
    const [selectedProvider, setSelectedProvider] = useState<string>("openai");

    const { messages, input, handleInputChange, handleSubmit, status } =
        useChat({
            api: "/api/chat",
            body: {
                provider: selectedProvider,
            },
        });
    const isLoading = status === "submitted" || status === "streaming";
    const formRef = useRef<HTMLFormElement>(null);
    const title = PAGE_TITLE;
    const description = PAGE_DESCRIPTION;
    const { theme, setTheme } = useTheme();

    return (
        <>
            <Head>
                {title && <title>{title}</title>}
                {description && (
                    <meta name="description" content={description} />
                )}
            </Head>
            <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start">
                <div className="w-full h-10 md:h-20 mb-10"></div>
                <div className="max-w-prose px-8 md:px-0">
                    <div className="flex  flex-col items-center justify-start py-2 min-w-96">
                        <header className="mb-10 ">
                            {title && (
                                <h1 className="text-3xl font-bold underline leading-relaxed text-center">
                                    {title}
                                </h1>
                            )}
                            {description && <p>{description}</p>}
                        </header>{" "}
                        <div className="flex gap-4 mb-8 items-center justify-center">
                            <label htmlFor="provider">Provider:</label>
                            <Select
                                value={selectedProvider}
                                onChange={(e) =>
                                    setSelectedProvider(e.target.value)
                                }
                                id="provider"
                                options={["openai", "deepseek", "deepseek-r1"]}
                                className="min-w-32"
                            />
                        </div>
                        <div className="sm:max-w-[500px] max-w-[300px] w-full flex flex-col items-center gap-5">
                            <form
                                onSubmit={handleSubmit}
                                ref={formRef}
                                className="w-full"
                            >
                                <TextField
                                    className="w-full max-w-md p-3 mb-8 bg-background border border-border text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-colors"
                                    value={input}
                                    placeholder="Say something..."
                                    onChange={handleInputChange}
                                />

                                <Button
                                    disabled={
                                        !input || input?.length < 3 || isLoading
                                    }
                                    type="submit"
                                >
                                    Send
                                </Button>
                            </form>

                            <p className="text-xs text-center text-muted-foreground">
                                Using: {selectedProvider}
                            </p>
                        </div>
                        <div className="w-full mt-10 mb-10">
                            {messages && messages?.length > 0 && (
                                <>
                                    <hr className="border-border" />
                                    <h3 className="text-left text-xl mt-3 mb-5 font-semibold">
                                        Result:
                                    </h3>
                                    {messages.map((m) => (
                                        <div
                                            key={m.id}
                                            className="whitespace-pre-wrap mb-4 p-3 rounded-md bg-muted/50"
                                        >
                                            <span className="font-medium text-sm text-muted-foreground">
                                                {m.role === "user"
                                                    ? "User: "
                                                    : "AI: "}
                                            </span>
                                            <div className="prose lg:prose-xl dark:prose-invert">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkMath]}
                                                    rehypePlugins={[
                                                        rehypeKatex,
                                                        rehypeRaw,
                                                    ]}
                                                >
                                                    {m.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
