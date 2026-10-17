export default function ChatHeaders() {
  return (
    <header className="chat-header">
      <div>
        <h1>AI 개발 도우미</h1>
      </div>
      <p>기술 문서와 검색 결과를 바탕으로 개발 문제를 해결합니다.</p>

      <div className="connection-status">
        <span className="status-dot"></span>
        <span>API 연결 방식</span>
      </div>
    </header>
  );
}
