"use client";

import { useRef } from "react";
import { useChat } from "ai/react";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { Button, TextField } from "@/components/form";
import { AiFillGithub, AiOutlineTwitter } from "react-icons/ai";
import { PAGE_TITLE, PAGE_DESCRIPTION } from "@/config/constants";
import { useTheme } from "next-themes";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
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
      <main className={`flex  flex-col items-center  justify-start`}>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <div className="bg-transparent dark:bg-neutral w-full h-10 md:h-20 mb-10"></div>
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
            </header>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mb-8 p-2 bg-blue-500 text-white dark:bg-blue-700"
            >
              Toggle Theme
            </button>
            <div className="sm:max-w-[500px] max-w-[300px] w-full flex flex-col items-center gap-5">
              <form onSubmit={handleSubmit} ref={formRef} className="w-full">
                <TextField
                  className="w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
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

              <p className="text-xs text-center"></p>
            </div>

            <div className="w-full mt-10 mb-10">
              {messages && messages?.length > 0 && (
                <>
                  <hr />
                  <h3 className="text-left text-xl mt-3 mb-5 font-semibold">
                    Result:
                  </h3>
                  {messages.map((m) => (
                    <div key={m.id} className="whitespace-pre-wrap mb-2">
                      {m.role === "user" ? "User: " : "AI: "}
                      {m.content}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="container mx-auto max-w-prose">
        <p className="text-center text-sm text-gray-400">
          This app uses AI and may produce inaccurate results
        </p>
        <hr className="mb-5 mt-2" />
        <div className="flex flex-row justify-between items-center mb-8">
          <div>
            <p>
              Powered by{" "}
              <a
                href="https://vercel.com/"
                className="underline"
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
            >
              <AiFillGithub size={"2em"} />
            </a>
            <a
              href="https://twitter.com/JohnPevien
            "
              rel="noreferrer"
            >
              <AiOutlineTwitter size={"2em"} />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
