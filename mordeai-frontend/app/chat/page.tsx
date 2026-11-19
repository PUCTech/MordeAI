import Cabecalho from "@/components/Cabecalho";
import Chat from "@/components/Chat";

export const metadata = { title: "Conversar com a IA — MordeAI" };

export default function ChatPage() {
  return (
    <div className="flex h-dvh flex-col">
      <Cabecalho modo="usuario" ativo="chat" />
      <main className="flex min-h-0 flex-1 flex-col">
        <Chat />
      </main>
    </div>
  );
}