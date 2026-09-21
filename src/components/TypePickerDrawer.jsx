import './TypePickerDrawer.scss'

const WORKOUT_TYPES = ['Upper', 'Lower']

// Exact asset from Figma (node 193:1743, Group 2134355740).
function CloseIcon() {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32">
      <circle cx="16" cy="16" r="16" fill="white" fillOpacity="0.1" />
      <path
        d="M10.4 24L9 22.6L14.6 17L9 11.4L10.4 10L16 15.6L21.6 10L23 11.4L17.4 17L23 22.6L21.6 24L16 18.4L10.4 24Z"
        fill="white"
        fillOpacity="0.45"
      />
    </svg>
  )
}

export default function TypePickerDrawer({ open, onClose, onSelect }) {
  if (!open) return null

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer__header">
          <span className="text-subheadline drawer__title">Select workout</span>
          <button className="drawer__close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <div className="drawer__options">
          {WORKOUT_TYPES.map((type) => (
            <button key={type} className="drawer__option text-headline" onClick={() => onSelect(type)}>
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
