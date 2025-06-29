"use client";

import { useRef, useState } from "react";
import { useChat } from "ai/react";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { Button, TextField, Select } from "@/components/form";
import { AiFillGithub, AiOutlineTwitter } from "react-icons/ai";
import { PAGE_TITLE, PAGE_DESCRIPTION } from "@/config/constants";
import { useTheme } from "next-themes";

export default function Chat() {
  const [selectedProvider, setSelectedProvider] = useState<string>("default");

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      body: {
        provider: selectedProvider,
      },
    });
  const formRef = useRef<HTMLFormElement>(null);
  const title = PAGE_TITLE;
  const description = PAGE_DESCRIPTION;
  const { theme, setTheme } = useTheme();

  return (
    <>
      <Head>
        {title && <title>{title}</title>}
        {description && <meta name="description" content={description} />}
      </Head>
      <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start">
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ 
            duration: 2000,
            style: {
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
            }
          }}
        />
        <div className="w-full h-10 md:h-20 mb-10"></div>
        <div className="max-w-prose px-8 md:px-0">
          <div className="flex  flex-col items-center justify-start py-2 min-w-96">
            <header className="mb-10 ">
              {title && (
                <h1 className="text-3xl font-bold underline leading-relaxed text-center">
                  {(process.env.PAGE_TITLE as string) || "Quikchat"}
                </h1>
              )}
              {description && (
                <p>{(process.env.PAGE_DESCRIPTION as string) || ""}</p>
              )}
            </header>            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors text-sm font-medium"
              >
                Toggle Theme
              </button>
              
              <Select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                options={["default", "openai", "deepseek"]}
                className="min-w-32"
              />
            </div>

            <div className="sm:max-w-[500px] max-w-[300px] w-full flex flex-col items-center gap-5">
              <form onSubmit={handleSubmit} ref={formRef} className="w-full">
                <TextField
                  className="w-full max-w-md p-3 mb-8 bg-background border border-border text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-colors"
                  value={input}
                  placeholder="Say something..."
                  onChange={handleInputChange}
                />

                <Button
                  disabled={isLoading || !input || input?.length < 3}
                  type="submit"
                >
                  Send
                </Button>
              </form>

              <p className="text-xs text-center text-muted-foreground">
                Using:{" "}
                {selectedProvider === "default"
                  ? "Default (OpenAI)"
                  : selectedProvider}
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
                    <div key={m.id} className="whitespace-pre-wrap mb-4 p-3 rounded-md bg-muted/50">
                      <span className="font-medium text-sm text-muted-foreground">
                        {m.role === "user" ? "User: " : "AI: "}
                      </span>
                      <span className="text-foreground">{m.content}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="container mx-auto max-w-prose border-t border-border pt-8 mt-16">
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
              <AiFillGithub size={"2em"} />
            </a>
            <a
              href="https://twitter.com/JohnPevien
            "
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <AiOutlineTwitter size={"2em"} />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
