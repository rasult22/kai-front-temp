import React, { useMemo, useRef, useState } from "react";
import MultiPersonaEngine from "@/services/multi-person-engine";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import { Button } from "@/components/base/buttons/button";

export default function ChatTestScreen() {
  const [apiKey, setApiKey] = useState("");
  const [question, setQuestion] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const engine = useRef<MultiPersonaEngine | null>(null);

  const hasStarted = useMemo(() => messages.length > 0, [messages]);

  const start = async () => {
    setError(null);
    setMessages([]);
    engine.current = new MultiPersonaEngine(apiKey || null);
    const e = engine.current;
    e.reset();
    e.on("onMessageAdded", (m: any) => {
      setMessages((prev) => [...prev, m]);
    });
    e.on("onError", (err: Error) => {
      setError(err.message);
      setRunning(false);
    });
    setRunning(true);
    try {
      await e.discuss(question.trim());
    } catch {}
    setRunning(false);
  };

  const reset = () => {
    setMessages([]);
    setError(null);
    engine.current?.reset();
  };

  const renderLabel = (m: any) => {
    if (!engine.current) return "";
    if (m.type === "user") return "You";
    if (m.type === "summary") {
      const p = engine.current.getPersona(m.personaId);
      return p ? `${p.name} — Summary` : "Summary";
    }
    const p = engine.current.getPersona(m.personaId);
    return p ? p.name : m.personaId || "Persona";
  };

  const renderColor = (m: any) => {
    if (!engine.current) return undefined as string | undefined;
    if (m.type === "user") return "#6B7280";
    const p = engine.current.getPersona(m.personaId);
    return p?.color;
  };

  return (
    <section className="flex min-h-screen items-start bg-primary py-8 text-primary">
      <div className="mx-auto w-full max-w-container px-4">
        <div className="mb-6">
          <h1 className="text-display-sm font-semibold">Multi-Persona Chat Test</h1>
          <p className="text-md text-tertiary">Enter an API key and a question to run a discussion.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Input
              label="OpenAI API Key"
              placeholder="sk-..."
              type="password"
              value={apiKey}
              onChange={setApiKey}
            />
            <TextArea label="Question" rows={4} placeholder="Ask a question" value={question} onChange={setQuestion} />
            <div className="flex gap-3">
              <Button size="lg" isLoading={running} onClick={start} isDisabled={!question.trim()}>
                Start Discussion
              </Button>
              <Button color="secondary" size="lg" onClick={reset} isDisabled={!hasStarted}>
                Reset
              </Button>
            </div>
            {error && <div className="rounded-lg bg-error-primary/10 p-3 text-sm text-error-primary">{error}</div>}
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-lg ring-1 ring-primary">
              <div className="border-b border-primary p-3 text-sm font-semibold">Messages</div>
              <div className="max-h-[60vh] overflow-auto p-3">
                {messages.length === 0 && <div className="text-tertiary">No messages yet</div>}
                {messages.map((m) => (
                  <div key={m.id} className="mb-3">
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-1 h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: renderColor(m) || "#D1D5DB" }}
                      />
                      <div className="w-full">
                        <div className="text-sm font-semibold">{renderLabel(m)}</div>
                        <div className="text-md text-primary whitespace-pre-wrap">{m.content}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {running && (
                  <div className="text-tertiary">Running discussion…</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}