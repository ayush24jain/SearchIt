
import { useState, type FormEvent, type KeyboardEvent } from 'react'
import './App.css'
import { mockFaculty, type Faculty } from './data/faculty'

const sampleSearches = [
  'Chemical Engineering',
  'Assistant Professor',
  'Dean Student Welfare',
]

function normalize(value: string) {
  return value.toLowerCase().trim().replace(/[^\p{L}\p{N}]/gu, '')
}

function searchFaculty(query: string): Faculty[] {
  const normalizedQuery = normalize(query)

  if (!normalizedQuery) return []

  return mockFaculty
    .map((faculty) => {
      const searchableFields = [
        faculty.fullName,
        faculty.designation,
        faculty.department,
        ...faculty.administrativePositions,
        faculty.email,
        faculty.officePhone,
        faculty.officeRoom,
      ]

      const normalizedFields = searchableFields.map(normalize)
      let score = 0

      if (normalize(faculty.email) === normalizedQuery) score += 100
      if (normalize(faculty.officePhone) === normalizedQuery) score += 100
      if (normalize(faculty.officeRoom) === normalizedQuery) score += 100

      if (normalize(faculty.fullName) === normalizedQuery) {
        score += 90
      } else if (normalize(faculty.fullName).startsWith(normalizedQuery)) {
        score += 70
      }

      if (normalizedFields.some((field) => field.includes(normalizedQuery))) {
        score += 30
      }

      return { faculty, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.faculty)
}

function App() {
  const [query, setQuery] = useState('')
  const [activeSuggestion, setActiveSuggestion] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [results, setResults] = useState<Faculty[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null)

  const suggestions = query.trim()
    ? searchFaculty(query).slice(0, 5)
    : []

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedQuery = query.trim()
    if (!trimmedQuery) return

    setSubmittedQuery(trimmedQuery)
    setResults(searchFaculty(trimmedQuery))
    setHasSearched(true)
    setSelectedFaculty(null)
    setShowSuggestions(false)
    setMenuOpen(false)
  }

  function startNewSearch() {
    setQuery('')
    setSubmittedQuery('')
    setResults([])
    setHasSearched(false)
    setSelectedFaculty(null)
    setShowSuggestions(false)
    setActiveSuggestion(0)
    setMenuOpen(false)
  }

  function runSuggestedSearch(value: string) {
    setQuery(value)
    setSubmittedQuery(value)
    setResults(searchFaculty(value))
    setHasSearched(true)
    setSelectedFaculty(null)
    setShowSuggestions(false)
    setActiveSuggestion(0)
    setMenuOpen(false)
  }

  function selectFaculty(faculty: Faculty) {
    setQuery(faculty.fullName)
    setSubmittedQuery(faculty.fullName)
    setResults([faculty])
    setHasSearched(true)
    setSelectedFaculty(faculty)
    setShowSuggestions(false)
    setActiveSuggestion(0)
  }

  function handleSearchKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === 'Escape') {
      setShowSuggestions(false)
      setActiveSuggestion(0)
      return
    }

    if (!showSuggestions || suggestions.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveSuggestion((current) =>
        (current + 1) % suggestions.length,
      )
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveSuggestion((current) =>
        (current - 1 + suggestions.length) % suggestions.length,
      )
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      selectFaculty(suggestions[activeSuggestion])
    }
  }

  return (
    <div className="app">
      {menuOpen && (
        <button
          className="mobile-backdrop"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">S</div>

          <div>
            <div className="brand-name">SearchIt</div>
            <div className="brand-subtitle">SVNIT Surat</div>
          </div>

          <button
            className="close-menu"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <button className="new-search" onClick={startNewSearch}>
          <span className="plus-icon">+</span>
          New search
        </button>

        <div className="sidebar-heading">QUICK SEARCHES</div>

        <div className="history-list">
          {sampleSearches.map((item) => (
            <button
              className="history-item"
              key={item}
              onClick={() => runSuggestedSearch(item)}
            >
              <span className="history-icon">↗</span>
              <span>{item}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="footer-heading">SVNIT FACULTY DIRECTORY</div>
          <p>Find official faculty information in one place.</p>
          <a
            href="https://www.svnit.ac.in/"
            target="_blank"
            rel="noreferrer"
          >
            Official website ↗
          </a>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation"
          >
            ☰
          </button>

          <div className="breadcrumb">
            <span>SVNIT Surat</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Faculty search</span>
          </div>

          <div className="directory-label">
            <span className="status-dot" />
            Development preview
          </div>
        </header>

        <section className="search-page">
          <div className="search-content">
            <div className="main-emblem">S</div>

            <p className="eyebrow">YOUR CAMPUS, SIMPLIFIED</p>

            <h1>Find your faculty.</h1>

            <p className="intro">
              Search professors, departments and official contact
              information at SVNIT Surat — all from one place.
            </p>

            <form className="search-form" onSubmit={handleSearch}>
              <span className="search-symbol" aria-hidden="true">
                ⌕
              </span>

              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setActiveSuggestion(0)
                  setShowSuggestions(true)
                  setSelectedFaculty(null)
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Name, department, designation, email..."
                aria-label="Search faculty"
                aria-autocomplete="list"
                aria-expanded={showSuggestions && suggestions.length > 0}
                autoComplete="off"
              />

              <button
                type="submit"
                className="search-button"
                disabled={!query.trim()}
              >
                Search <span aria-hidden="true">↗</span>
              </button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div
                className="autocomplete-list"
                role="listbox"
                aria-label="Faculty suggestions"
              >
                {suggestions.map((faculty, index) => (
                  <button
                    key={faculty.id}
                    type="button"
                    role="option"
                    aria-selected={index === activeSuggestion}
                    className={`autocomplete-item ${
                      index === activeSuggestion
                        ? 'autocomplete-active'
                        : ''
                    }`}
                    onMouseEnter={() => setActiveSuggestion(index)}
                    onClick={() => selectFaculty(faculty)}
                  >
                    <span className="autocomplete-avatar">
                      {faculty.fullName.charAt(0)}
                    </span>

                    <span className="autocomplete-details">
                      <strong>{faculty.fullName}</strong>
                      <span>
                        {faculty.designation} · {faculty.department}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="suggestions">
              <span className="suggestions-label">Try searching for</span>

              {sampleSearches.map((item) => (
                <button
                  key={item}
                  className="suggestion-chip"
                  onClick={() => runSuggestedSearch(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            {hasSearched && (
              <section className="results-section" aria-live="polite">
                <div className="results-heading">
                  <div>
                    <h2>Search results</h2>
                    <p>
                      {results.length}{' '}
                      {results.length === 1 ? 'match' : 'matches'} for{' '}
                      <strong>"{submittedQuery}"</strong>
                    </p>
                  </div>

                  <button className="clear-results" onClick={startNewSearch}>
                    Clear
                  </button>
                </div>

                <p className="mock-warning">
                  Development preview: every record below is fictional.
                </p>

                {results.length > 0 ? (
                  <div className="results-list">
                    {results.map((faculty) => (
                      <article className="faculty-result" key={faculty.id}>
                        <div className="faculty-avatar" aria-hidden="true">
                          {faculty.fullName.charAt(0)}
                        </div>

                        <div className="faculty-result-content">
                          <button
                            className="faculty-name"
                            onClick={() => setSelectedFaculty(faculty)}
                          >
                            {faculty.fullName}
                          </button>

                          <p className="faculty-designation">
                            {faculty.designation}
                          </p>

                          <p className="faculty-department">
                            {faculty.department}
                          </p>

                          {faculty.administrativePositions.length > 0 && (
                            <p className="faculty-position">
                              {faculty.administrativePositions.join(', ')}
                            </p>
                          )}

                          <button
                            className="view-profile"
                            onClick={() => setSelectedFaculty(faculty)}
                          >
                            View profile →
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    <h3>No matching faculty found</h3>
                    <p>
                      Try a different name, department, designation, email,
                      phone number or office room.
                    </p>
                  </div>
                )}
              </section>
            )}

            {selectedFaculty && (
              <section className="profile-panel">
                <div className="profile-panel-heading">
                  <h2>Faculty profile</h2>
                  <button
                    className="clear-results"
                    onClick={() => setSelectedFaculty(null)}
                  >
                    Close
                  </button>
                </div>

                <p className="mock-warning">
                  Fictional sample record — not a real faculty profile.
                </p>

                <h3>{selectedFaculty.fullName}</h3>
                <p>{selectedFaculty.designation}</p>
                <p>{selectedFaculty.department}</p>

                {selectedFaculty.administrativePositions.map((position) => (
                  <p key={position}>{position}</p>
                ))}

                <div className="profile-contact">
                  <p>
                    <strong>Email:</strong> {selectedFaculty.email}
                  </p>
                  <p>
                    <strong>Office phone:</strong> {selectedFaculty.officePhone}
                  </p>
                  <p>
                    <strong>Office room:</strong> {selectedFaculty.officeRoom}
                  </p>
                </div>

                <div className="profile-actions">
                  <button
                    className="clear-results"
                    onClick={() => {
                      void navigator.clipboard
                        .writeText(selectedFaculty.email)
                        .catch(() => {
                          window.alert('Could not copy the email address.')
                        })
                    }}
                  >
                    Copy email
                  </button>

                  <a
                    className="email-link"
                    href={`mailto:${selectedFaculty.email}`}
                  >
                    Open email app
                  </a>
                </div>
              </section>
            )}

            {!hasSearched && (
              <div className="information">
                <div className="information-icon">i</div>

                <div>
                  <h2>Official faculty information</h2>
                  <p>
                    SearchIt is being built to make publicly available
                    institutional faculty details easier to find. Official
                    SVNIT pages will remain the source of truth.
                  </p>
                </div>
              </div>
            )}
          </div>

          <footer className="page-footer">
            SearchIt · Faculty discovery for SVNIT Surat
          </footer>
        </section>
      </main>
    </div>
  )
}

export default App
