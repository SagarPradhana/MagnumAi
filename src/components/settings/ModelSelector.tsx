import { AVAILABLE_MODELS } from '../../types';

interface ModelSelectorProps {
  value: string;
  onChange: (model: string) => void;
  label?: string;
  compact?: boolean;
}

export function ModelSelector({ value, onChange, label, compact }: ModelSelectorProps) {
  const grouped = AVAILABLE_MODELS.reduce<Record<string, typeof AVAILABLE_MODELS>>(
    (acc, m) => {
      (acc[m.provider] ??= []).push(m);
      return acc;
    },
    {}
  );

  return (
    <div>
      {label && (
        <label style={{ display: 'block', fontSize: 13, color: '#a1a1aa', marginBottom: 6 }}>
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: compact ? '6px 10px' : '10px 12px',
          borderRadius: 8,
          border: '1px solid #2d2d4a',
          background: '#16162a',
          color: '#e4e4e7',
          fontSize: compact ? 12 : 14,
          outline: 'none',
          cursor: 'pointer',
        }}
      >
        {Object.entries(grouped).map(([provider, models]) => (
          <optgroup key={provider} label={provider}>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.vision ? '🖼 ' : '  '}{m.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
