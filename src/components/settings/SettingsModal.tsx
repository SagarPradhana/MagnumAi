import { Modal } from '../common/Modal';
import { ModelSelector } from './ModelSelector';
import { Button } from '../common/Button';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  model: string;
  onModelChange: (model: string) => void;
}

export function SettingsModal({
  open,
  onClose,
  model,
  onModelChange,
}: SettingsModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Settings">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <p style={{ margin: 0, fontSize: 13, color: '#a1a1aa', lineHeight: 1.5 }}>
          API key is set via <code style={{ background: '#2d2d4a', padding: '2px 6px', borderRadius: 4, color: '#e4e4e7' }}>VITE_OPENROUTER_API_KEY</code> environment variable.
        </p>

        <ModelSelector value={model} onChange={onModelChange} label="Default Model" />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
