"use client";

import { useState, useRef } from "react";
import { useChat } from "ai/react";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { Button, Select, TextField } from "@/components/form";
import { AiFillGithub, AiOutlineTwitter } from "react-icons/ai";

export default function Chat() {
  const onFormFinish = () => {
    setLoading(false);
  };
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onFinish: onFormFinish,
  });
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const submitForm = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event("submit", { cancelable: true }));
      setLoading(true);
    }
  };

  // return (
  //   <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
  //     {messages.map(m => (
  //       <div key={m.id} className="whitespace-pre-wrap">
  //         {m.role === 'user' ? 'User: ' : 'AI: '}
  //         {m.content}
  //       </div>
  //     ))}

  //     <form onSubmit={handleSubmit}>
  //       <input
  //         className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
  //         value={input}
  //         placeholder="Say something..."
  //         onChange={handleInputChange}
  //       />
  //     </form>
  //   </div>
  // );

  return (
    <>
      <Head>
        <title>Rephraser</title>
      </Head>
      <main
        className={`flex  flex-col items-center min-h-[90vh] justify-start`}
      >
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <div className="bg-neutral w-full h-10 md:h-20 mb-10"></div>
        <div className="max-w-prose px-8 md:px-0">
          <div className="flex  flex-col items-center justify-start py-2">
            <header className="mb-10 ">
              <h1 className="text-3xl font-bold underline leading-relaxed text-center">
                Japanese Navigator
              </h1>
              {/* <p>A rephraser and grammar checker app powered by OpenAI API.</p> */}
            </header>
            <div className="w-full flex flex-col gap-5">
              <div>
                {/* <TextField
                  className="rounded border-2 border-neutral w-full max-w-full"
                  onChange={(e) => {
                    setSentence(e.target.value);
                  }}
                  value={sentence}
                /> */}

                <form onSubmit={handleSubmit} ref={formRef}>
                  <TextField
                    className="w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
                    value={input}
                    placeholder="Say something..."
                    onChange={handleInputChange}
                  />
                </form>
              </div>
              {/* <div className="flex flex-col sm:flex-row justify-between gap-5 items-center">
                <p>Select tone:</p>
                <Select
                  className="rounded w-full max-w-full sm:max-w-xs"
                  onChange={(e) => setVibe(e.target.value)}
                  value={vibe}
                  options={[
                    "Professional",
                    "Conversational",
                    "Humorous",
                    "Empatic",
                    "Academic",
                    "Simple",
                    "Creative",
                  ]}
                />
              </div> */}

              <Button
                onClick={submitForm}
                disabled={loading || !input || input?.length < 7}
              >
                Send
              </Button>

              <p className="text-xs text-center"></p>
            </div>

            <div className="w-full mt-10">
              {messages && (
                <>
                  <hr />
                  {/* <h3 className="text-center text-xl mt-3 mb-5 font-semibold">
                    Rephrased Sentences
                  </h3> */}
                  {messages.map((m) => (
                    <div key={m.id} className="whitespace-pre-wrap">
                      {m.role === "user" ? "User: " : "AI: "}
                      {m.content}
                    </div>
                  ))}
                  {/* {rephrasedSentences.split("\n").map((sentence, index) => {
                    if (sentence.length < 7) return;
                    sentence = sentence
                      .replace("- ", "")
                      .replace(/^\d+\.\s/gm, "")
                      .replace(/"/g, "")
                      .trim();
                    return (
                      <Card
                        text={sentence}
                        key={index}
                        className="text-center w-full mb-5"
                        onClick={() => {
                          navigator.clipboard.writeText(sentence);
                          toast("Sentence have been copied to clipboard", {
                            icon: "✂️",
                          });
                        }}
                      />
                    );
                  })} */}
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
