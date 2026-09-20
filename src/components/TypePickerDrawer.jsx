import './TypePickerDrawer.scss'

const WORKOUT_TYPES = ['Upper', 'Lower']

export default function TypePickerDrawer({ open, onClose, onSelect }) {
  if (!open) return null

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer__header">
          <span className="text-headline drawer__title">Start Workout</span>
          <button className="drawer__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="drawer__options">
          {WORKOUT_TYPES.map((type) => (
            <button key={type} className="drawer__option text-body" onClick={() => onSelect(type)}>
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
