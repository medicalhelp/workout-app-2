import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatDate } from '../utils/date'
import { formatWeight, parseWeightInput } from '../utils/weight'
import { getWeightEntries, saveWeightEntry } from '../data/weightStore'
import WeightChart from './WeightChart'
import './WeightScreen.scss'

const TAP_TRANSITION = { type: 'spring', stiffness: 700, damping: 30 }

export default function WeightScreen({ onBack }) {
  const [entries, setEntries] = useState(() => getWeightEntries())
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')

  const latest = entries[0] ?? null
  // Chart wants oldest -> newest; the list (and `entries` itself) stays newest-first.
  const chartEntries = entries.slice().reverse()

  function handleStartAdd() {
    // Prefilled with the last value (not blank) — day-to-day weight barely moves, so
    // adjusting beats retyping, same "edit forward from last time" pattern as starting a
    // new workout from the most recent session of that type.
    setDraft(latest ? formatWeight(latest.value) : '')
    setAdding(true)
  }

  function handleCancelAdd() {
    setAdding(false)
  }

  function handleSaveAdd() {
    const value = parseWeightInput(draft)
    if (value === null) return
    saveWeightEntry(value)
    setEntries(getWeightEntries())
    setAdding(false)
  }

  function handleDraftKeyDown(e) {
    if (e.key === 'Enter') handleSaveAdd()
    if (e.key === 'Escape') handleCancelAdd()
  }

  return (
    <div className="weight-screen">
      <motion.button
        className="weight-screen__back"
        onClick={onBack}
        whileTap={{ scale: 0.88 }}
        transition={TAP_TRANSITION}
        aria-label="Back"
      >
        ‹
      </motion.button>
      <span className="text-headline weight-screen__title">Weight</span>

      {chartEntries.length > 0 && <WeightChart entries={chartEntries} />}

      {adding ? (
        <div className="weight-screen__add-row">
          <input
            className="text-headline weight-screen__add-input"
            type="text"
            inputMode="decimal"
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={(e) => e.target.select()}
            onKeyDown={handleDraftKeyDown}
          />
          <span className="text-headline weight-screen__add-unit">kg</span>
          <button className="weight-screen__add-cancel" onClick={handleCancelAdd} aria-label="Cancel">
            ✕
          </button>
          <button className="weight-screen__add-save" onClick={handleSaveAdd} aria-label="Save">
            ✓
          </button>
        </div>
      ) : (
        <button className="text-subheadline weight-screen__add-button" onClick={handleStartAdd}>
          + Add
        </button>
      )}

      {entries.length === 0 ? (
        <p className="text-body weight-screen__empty">No entries yet.</p>
      ) : (
        <ul className="weight-screen__list">
          {entries.map((entry) => (
            <li key={entry.id} className="weight-screen__row">
              <span className="text-subheadline weight-screen__row-value">{formatWeight(entry.value)} kg</span>
              {/* Always the full date here (never "2w" relative) — this list is for actually
                  reviewing history, not a glance-and-forget freshness check like the Overview
                  badge. */}
              <span className="text-body weight-screen__row-date">{formatDate(entry.date)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
