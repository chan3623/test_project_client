import { useEffect, useRef, useState } from "react";

function formatFileSize(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function AttachmentItem({ file, onRemove }) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!file.type.startsWith("image/")) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="attachment-item">
      {previewUrl ? (
        <img
          className="attachment-thumbnail"
          src={previewUrl}
          alt={file.name}
        />
      ) : (
        <div className="attachment-file-icon">
          {file.name.split(".").pop()?.slice(0, 4).toUpperCase() || "FILE"}
        </div>
      )}

      <div className="attachment-details">
        <span className="attachment-name" title={file.name}>
          {file.name}
        </span>
        <span className="attachment-size">{formatFileSize(file.size)}</span>
      </div>

      <button
        type="button"
        className="attachment-remove"
        onClick={onRemove}
        aria-label={`${file.name} 첨부 제거`}
        title="첨부 제거"
      >
        ×
      </button>
    </div>
  );
}

export default function ChatInput({ onSend, isLoading }) {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  function handleFilesSelected(event) {
    const selectedFiles = Array.from(event.target.files ?? []);

    setFiles((previous) => {
      const existing = new Set(
        previous.map(
          (file) => `${file.name}-${file.size}-${file.lastModified}`,
        ),
      );

      const uniqueFiles = selectedFiles.filter((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        return !existing.has(key);
      });

      return [...previous, ...uniqueFiles];
    });

    event.target.value = "";
  }

  function removeFile(index) {
    setFiles((previous) => previous.filter((_, i) => i !== index));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const message = input.trim();

    if ((!message && files.length === 0) || isLoading) {
      return;
    }

    const attachedFiles = [...files];

    setInput("");
    setFiles([]);

    await onSend(message, attachedFiles);
  }

  function handleKeyDown(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      {files.length > 0 && (
        <div className="attachment-list">
          {files.map((file, index) => (
            <AttachmentItem
              key={`${file.name}-${file.size}-${file.lastModified}`}
              file={file}
              onRemove={() => removeFile(index)}
            />
          ))}
        </div>
      )}

      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="오류 메시지나 기술 질문을 입력하세요..."
        rows={3}
        disabled={isLoading}
        aria-label="질문 입력"
      />

      <div className="input-footer">
        <div className="input-actions">
          <button
            type="button"
            className="attach-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <span>＋</span> 파일 첨부
          </button>

          <input
            ref={fileInputRef}
            className="hidden-file-input"
            type="file"
            multiple
            accept="image/*,.pdf,.txt,.md,.py,.js,.jsx,.ts,.tsx,.json,.csv,.log,.html,.css,.sql,.yaml,.yml"
            onChange={handleFilesSelected}
          />

          <span className="input-hint">Enter 전송 · Shift + Enter 줄바꿈</span>
        </div>

        <button
          type="submit"
          className="send-button"
          disabled={isLoading || (!input.trim() && files.length === 0)}
        >
          {isLoading ? "처리 중..." : "전송"}
          {!isLoading && <span>↑</span>}
        </button>
      </div>
    </form>
  );
}
