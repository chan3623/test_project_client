export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <article className={`message-row ${isUser ? "user-row" : "assistant-row"}`}>
      {!isUser && <div className="message-avatar">D</div>}

      <div className="message-content">
        <div className="message-author">{isUser ? "You" : "Dev Assistant"}</div>

        {message.content && (
          <div
            className={`message-bubble ${
              isUser ? "user-bubble" : "assistant-bubble"
            }`}
          >
            {message.content}
          </div>
        )}

        {message.attachments?.length > 0 && (
          <div className="sent-attachments">
            {message.attachments.map((file, index) => (
              <div className="sent-attachment" key={`${file.name}-${index}`}>
                <span className="sent-attachment-icon">
                  {file.type?.startsWith("image/") ? "IMG" : "FILE"}
                </span>

                <span className="sent-attachment-name" title={file.name}>
                  {file.name}
                </span>

                <span className="sent-attachment-status">첨부됨</span>
              </div>
            ))}
          </div>
        )}

        {!isUser && message.route && (
          <div className="message-meta">처리 경로: {message.route}</div>
        )}

        {!isUser && message.sources?.length > 0 && (
          <div className="message-sources">
            <div className="sources-heading">참고 문서</div>

            {message.sources.map((source, index) => (
              <a
                key={`${source.url || source.title}-${index}`}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="source-link"
              >
                {source.title || source.url}
              </a>
            ))}
          </div>
        )}
      </div>

      {isUser && <div className="user-avatar">U</div>}
    </article>
  );
}
