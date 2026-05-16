import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useAutoResize } from '../../hooks/useAutoResize';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import type { OutputMode } from '../../types';
import { AVAILABLE_MODELS } from '../../types';

interface ChatInputProps {
  onSend: (content: string, images?: string[], mode?: OutputMode) => void;
  isLoading: boolean;
  onStop: () => void;
  disabled?: boolean;
  currentModel?: string;
  onModelChange?: (model: string) => void;
}

const AT_OPTIONS: { mode: OutputMode; label: string; desc: string }[] = [
  { mode: 'prompt', label: 'prompt', desc: 'Response as reusable prompt' },
  { mode: 'doc', label: 'doc', desc: 'Response as downloadable document' },
  { mode: 'default', label: 'default', desc: 'Normal chat response' },
];

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ChatInput({ onSend, isLoading, onStop, disabled, currentModel, onModelChange }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [showAt, setShowAt] = useState(false);
  const [atIndex, setAtIndex] = useState(-1);
  const [atFilter, setAtFilter] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useAutoResize([value]);
  const atRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const filtered = AT_OPTIONS.filter((o) => o.label.startsWith(atFilter));

  useEffect(() => {
    if (!showAt) return;
    const handler = (e: MouseEvent) => {
      if (atRef.current && !atRef.current.contains(e.target as Node)) {
        setShowAt(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showAt]);

  const handleChange = (val: string) => {
    setValue(val);
    const idx = val.lastIndexOf('@');
    if (idx !== -1 && (idx === 0 || val[idx - 1] === ' ')) {
      const after = val.slice(idx + 1);
      if (!after.includes(' ') && after.length < 20) {
        setShowAt(true);
        setAtIndex(idx);
        setAtFilter(after.toLowerCase());
        setSelectedIdx(0);
        return;
      }
    }
    setShowAt(false);
  };

  const insertAtOption = (mode: OutputMode) => {
    const option = AT_OPTIONS.find((o) => o.mode === mode);
    if (!option) return;
    const before = value.slice(0, atIndex);
    const after = value.slice(atIndex + 1 + atFilter.length);
    setValue(before + '@' + option.label + ' ' + after);
    setShowAt(false);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const getMode = (): OutputMode | undefined => {
    const m = value.match(/^@(prompt|doc|default)\s+/);
    if (m) return m[1] as OutputMode;
    return undefined;
  };

  const getCleanContent = (): string => {
    return value.replace(/^@(prompt|doc|default)\s+/, '');
  };

  const handleSend = () => {
    const content = getCleanContent();
    if ((!content && images.length === 0) || isLoading || disabled) return;
    onSend(content, images.length ? images : undefined, getMode());
    setValue('');
    setImages([]);
    setShowAt(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showAt && filtered.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((p) => Math.min(p + 1, filtered.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((p) => Math.max(p - 1, 0));
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertAtOption(filtered[selectedIdx].mode);
        return;
      }
      if (e.key === 'Escape') {
        setShowAt(false);
        return;
      }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith('image/')) {
        newImages.push(await readFileAsDataURL(files[i]));
      }
    }
    setImages((prev) => [...prev, ...newImages]);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      style={{
        borderTop: '1px solid #2d2d4a',
        padding: isMobile ? '10px 12px' : '16px 24px',
        background: '#1a1a2e',
      }}
    >
      {images.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
            marginBottom: 6,
            maxWidth: isMobile ? '100%' : 800,
            margin: '0 auto 6px',
          }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              style={{ position: 'relative', width: isMobile ? 48 : 64, height: isMobile ? 48 : 64, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}
            >
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                onClick={() => removeImage(i)}
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  border: 'none',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  fontSize: 11,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      {images.length > 0 && currentModel && !AVAILABLE_MODELS.find((m) => m.id === currentModel)?.vision && onModelChange && (
        <div
          style={{
            maxWidth: isMobile ? '100%' : 800,
            margin: '0 auto 6px',
            padding: '6px 10px',
            borderRadius: 8,
            background: '#2a2a1a',
            border: '1px solid #4a4a2a',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            color: '#e4e4e7',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
          }}
        >
          <span>🖼 This model doesn't support images.</span>
          <button
            onClick={() => {
              const vision = AVAILABLE_MODELS.find((m) => m.vision);
              if (vision) onModelChange(vision.id);
            }}
            style={{
              marginLeft: isMobile ? 0 : 'auto',
              padding: '4px 10px',
              borderRadius: 6,
              border: 'none',
              background: '#7c5cfc',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            Switch to {AVAILABLE_MODELS.find((m) => m.vision)?.name}
          </button>
        </div>
      )}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 6,
          maxWidth: isMobile ? '100%' : 800,
          margin: '0 auto',
        }}
      >
        {showAt && filtered.length > 0 && (
          <div
            ref={atRef}
            style={{
              position: 'absolute',
              bottom: '100%',
              left: 0,
              marginBottom: 4,
              background: '#1e1e3f',
              border: '1px solid #2d2d4a',
              borderRadius: 10,
              padding: 4,
              minWidth: isMobile ? 180 : 200,
              zIndex: 50,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            {filtered.map((opt, i) => (
              <div
                key={opt.mode}
                onClick={() => insertAtOption(opt.mode)}
                onMouseEnter={() => setSelectedIdx(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: i === selectedIdx ? '#2d2d4a' : 'transparent',
                  color: '#e4e4e7',
                  fontSize: 13,
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: i === selectedIdx ? '#7c5cfc' : '#2d2d4a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {opt.mode === 'prompt' ? '⌨' : opt.mode === 'doc' ? '📄' : '💬'}
                </span>
                <div>
                  <div style={{ fontWeight: 500 }}>@{opt.label}</div>
                  <div style={{ fontSize: 11, color: '#6b6b80' }}>{opt.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={isLoading || disabled}
          style={{
            padding: isMobile ? '8px' : '10px',
            borderRadius: 10,
            border: '1px solid #2d2d4a',
            background: '#212134',
            color: '#a1a1aa',
            cursor: isLoading || disabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isLoading || disabled ? 0.5 : 1,
            flexShrink: 0,
          }}
          title="Attach image"
        >
          <svg width={isMobile ? 16 : 18} height={isMobile ? 16 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </button>
        <div style={{ flex: 1, position: 'relative' }}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={images.length ? 'Add a message about the image...' : 'Type @prompt, @doc, @default or type a message...'}
            rows={1}
            disabled={isLoading || disabled}
            style={{
              width: '100%',
              padding: isMobile ? '8px 10px' : '10px 14px',
              borderRadius: 10,
              border: '1px solid #2d2d4a',
              background: '#212134',
              color: '#e4e4e7',
              fontSize: isMobile ? 13 : 14,
              lineHeight: 1.5,
              resize: 'none',
              outline: 'none',
              maxHeight: 200,
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </div>
        {isLoading ? (
          <button
            onClick={onStop}
            style={{
              padding: isMobile ? '8px 12px' : '10px 16px',
              borderRadius: 10,
              border: 'none',
              background: '#dc2626',
              color: '#fff',
              cursor: 'pointer',
              fontSize: isMobile ? 12 : 13,
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            Stop
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={(!getCleanContent() && images.length === 0) || disabled}
            style={{
              padding: isMobile ? '8px 12px' : '10px 16px',
              borderRadius: 10,
              border: 'none',
              background: (getCleanContent() || images.length > 0) && !disabled ? '#7c5cfc' : '#2d2d4a',
              color: (getCleanContent() || images.length > 0) && !disabled ? '#fff' : '#6b6b80',
              cursor: (getCleanContent() || images.length > 0) && !disabled ? 'pointer' : 'not-allowed',
              fontSize: isMobile ? 12 : 13,
              fontWeight: 500,
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
}
