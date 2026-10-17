import { useState } from "react";
import { sendChatMessage } from "../api/chat";
import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";
import Sidebar from "../components/Sidebar";

function createConversation() {
  return {
    id: crypto.randomUUID(),
    title: "새 대화",
    messages: [],
  };
}

export default function App() {
  const [initialConversation] = useState(() => createConversation());
  const [conversations, setConversations] = useState([initialConversation]);
  const [activeConversationId, setActiveConversationId] = useState(
    initialConversation.id,
  );
  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  );

  function updateConversation(conversationId, updater) {
    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === conversationId
          ? updater(conversation)
          : conversation,
      ),
    );
  }

  function handleNewChat() {
    const conversation = createConversation();

    setConversations((previous) => [conversation, ...previous]);
    setActiveConversationId(conversation.id);
    setError("");
  }

  function handleSelectConversation(conversationId) {
    setActiveConversationId(conversationId);
    setError("");
  }

  async function handleSend(message, files) {
    if (isLoading || !activeConversation) {
      return;
    }

    const conversationId = activeConversation.id;
    const sessionId = activeConversation.id;

    setError("");
    setIsLoading(true);

    updateConversation(conversationId, (conversation) => ({
      ...conversation,
      title:
        conversation.messages.length === 0
          ? message.slice(0, 32)
          : conversation.title,
      messages: [
        ...conversation.messages,
        {
          id: crypto.randomUUID(),
          role: "user",
          content: message,
          attachments: files.map((file) => ({
            name: file.name,
            type: file.type,
            size: file.size,
          })),
        },
      ],
    }));

    try {
      const result = await sendChatMessage({
        message,
        thread_id: sessionId,
        files,
      });

      updateConversation(conversationId, (conversation) => ({
        ...conversation,
        messages: [
          ...conversation.messages,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: result.answer,
            route: result.route,
            sources: result.sources ?? [],
          },
        ],
      }));
    } catch (requestError) {
      setError(requestError.message || "요청을 처리하지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((previous) => !previous)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
      />

      <main className="chat-main">
        <ChatHeader />

        <section className="chat-body" aria-label="대화 내용">
          {!activeConversation?.messages.length && (
            <div className="welcome-panel">
              <span className="welcome-eyebrow">DEVELOPER WORKSPACE</span>
              <h2>무엇을 해결해 볼까요?</h2>
              <p>기술 질문, 오류 메시지 또는 코드 파일을 입력해 주세요.</p>
            </div>
          )}

          {activeConversation?.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="loading-message" role="status">
              <span className="loading-indicator" />
              답변을 생성하고 있습니다.
            </div>
          )}

          {error && (
            <div className="error-message" role="alert">
              <span>{error}</span>
              <button onClick={() => setError("")}>닫기</button>
            </div>
          )}
        </section>

        <footer className="chat-footer">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
          <p className="footer-note">
            AI가 생성한 답변은 공식 문서와 함께 확인해 주세요.
          </p>
        </footer>
      </main>
    </div>
  );
}
