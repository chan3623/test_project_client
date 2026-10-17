export default function Sidebar({
  collapsed,
  onToggle,
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
}) {
  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-top">
        {!collapsed && (
          <div className="sidebar-brand">
            <div className="brand-icon">D</div>
            <span>Dev Assistant</span>
          </div>
        )}

        <button
          className="icon-button sidebar-toggle"
          onClick={onToggle}
          title={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
          aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
        >
          <span>{collapsed ? "→" : "←"}</span>
        </button>
      </div>

      <button className="new-chat-button" onClick={onNewChat} title="새 대화">
        <span className="new-chat-icon">＋</span>
        {!collapsed && <span>새 대화</span>}
      </button>

      {!collapsed && (
        <div className="conversation-section">
          <div className="section-heading">최근 대화</div>

          <div className="conversation-list">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                className={`conversation-item ${
                  conversation.id === activeConversationId ? "active" : ""
                }`}
                onClick={() => onSelectConversation(conversation.id)}
                title={conversation.title}
              >
                <span className="conversation-icon">○</span>
                <span className="conversation-title">{conversation.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="user-avatar">U</div>
          {!collapsed && (
            <div className="user-info">
              <strong>Developer</strong>
              <span>AI Workspace</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
