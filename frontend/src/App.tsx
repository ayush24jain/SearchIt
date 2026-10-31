
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import './App.css'
import type { Faculty } from './data/faculty'
import { fetchFaculty } from './services/facultyApi'
import {
  fetchDepartments,
  type Department,
} from './services/departmentApi'

const sampleSearches = [
  'Chemical Engineering',
  'Assistant Professor',
  'Dean Student Welfare',
]

// Displays the faculty photo or their initial if the photo is unavailable.
type FacultyAvatarProps = {
  name: string
  photoUrl: string | null
  className: string
}

function FacultyAvatar({
  name,
  photoUrl,
  className,
}: FacultyAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
  }, [photoUrl])

  return (
    <div className={className}>
      {photoUrl && !imageFailed ? (
        <img
          src={photoUrl}
          alt=""
          onError={() => setImageFailed(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 'inherit',
            display: 'block',
          }}
        />
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </div>
  )
}

function App() {
  const [query, setQuery] = useState('')

  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [departmentError, setDepartmentError] = useState('')

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('searchit-history')
      const parsed: unknown = saved ? JSON.parse(saved) : []

      return Array.isArray(parsed) &&
        parsed.every((item) => typeof item === 'string')
        ? parsed.slice(0, 5)
        : []
    } catch {
      return []
    }
  })

  const [activeSuggestion, setActiveSuggestion] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [results, setResults] = useState<Faculty[]>([])
  const [suggestions, setSuggestions] = useState<Faculty[]>([])
  const suggestionListRef = useRef<HTMLDivElement>(null)
  const [apiError, setApiError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null)

  // Load departments from the PostgreSQL database.
  useEffect(() => {
    let cancelled = false

    async function loadDepartments() {
      try {
        const data = await fetchDepartments()

        if (!cancelled) {
          setDepartments(data)
          setDepartmentError('')
        }
      } catch {
        if (!cancelled) {
          setDepartmentError(
            'Unable to load departments. Please check the backend connection.',
          )
        }
      }
    }

    void loadDepartments()

    return () => {
      cancelled = true
    }
  }, [])

  function saveSearch(value: string) {
    const trimmed = value.trim()
    if (!trimmed) return

    const updated = [
      trimmed,
      ...searchHistory.filter(
        (item) => item.toLowerCase() !== trimmed.toLowerCase(),
      ),
    ].slice(0, 5)

    setSearchHistory(updated)

    try {
      localStorage.setItem('searchit-history', JSON.stringify(updated))
    } catch {
      // The search still works if browser storage is unavailable.
    }
  }

  // Fetch all autocomplete suggestions using search and department filters.
  useEffect(() => {
    let cancelled = false

    if (!query.trim()) {
      setSuggestions([])
      return
    }

    const timer = window.setTimeout(async () => {
      try {
        const data = await fetchFaculty(query, selectedDepartment)

        if (!cancelled) {
          setSuggestions(data)
          setApiError('')
        }
      } catch {
        if (!cancelled) {
          setSuggestions([])
          setApiError(
            'Unable to connect to SearchIt. Check that the backend is running.',
          )
        }
      }
    }, 250)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [query, selectedDepartment])

  // Keep the keyboard-highlighted suggestion visible inside the scrollable list.
  useEffect(() => {
    if (!showSuggestions) return

    const activeOption = suggestionListRef.current?.querySelector<HTMLElement>(
      `[data-suggestion-index="${activeSuggestion}"]`,
    )

    activeOption?.scrollIntoView({ block: 'nearest' })
  }, [activeSuggestion, showSuggestions])

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedQuery = query.trim()

    if (!trimmedQuery && !selectedDepartment) return

    setSubmittedQuery(trimmedQuery)
    saveSearch(trimmedQuery)
    setHasSearched(true)
    setResults([])
    setApiError('')
    setSelectedFaculty(null)
    setShowSuggestions(false)
    setMenuOpen(false)

    try {
      const data = await fetchFaculty(trimmedQuery, selectedDepartment)
      setResults(data)
    } catch {
      setApiError(
        'Unable to fetch faculty. Please check your backend connection.',
      )
    }
  }

  function startNewSearch() {
    setQuery('')
    setSelectedDepartment('')
    setSubmittedQuery('')
    setResults([])
    setHasSearched(false)
    setSelectedFaculty(null)
    setShowSuggestions(false)
    setActiveSuggestion(0)
    setMenuOpen(false)
    setApiError('')
  }

  async function runSuggestedSearch(value: string) {
    setQuery(value)
    setSubmittedQuery(value)
    saveSearch(value)
    setHasSearched(true)
    setResults([])
    setApiError('')
    setSelectedFaculty(null)
    setShowSuggestions(false)
    setActiveSuggestion(0)
    setMenuOpen(false)

    try {
      const data = await fetchFaculty(value, selectedDepartment)
      setResults(data)
    } catch {
      setApiError(
        'Unable to fetch faculty. Please check your backend connection.',
      )
    }
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
      setActiveSuggestion(
        (current) => (current + 1) % suggestions.length,
      )
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveSuggestion(
        (current) =>
          (current - 1 + suggestions.length) % suggestions.length,
      )
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      selectFaculty(suggestions[activeSuggestion])
    }
  }

  const resultDescription = [
    submittedQuery ? `"${submittedQuery}"` : '',
    selectedDepartment || '',
  ]
    .filter(Boolean)
    .join(' in ')

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

        {searchHistory.length > 0 && (
          <>
            <div className="sidebar-heading recent-heading">
              <span>RECENT SEARCHES</span>

              <button
                className="clear-history"
                onClick={() => {
                  setSearchHistory([])

                  try {
                    localStorage.removeItem('searchit-history')
                  } catch {
                    // The current page can still clear its visible history.
                  }
                }}
              >
                Clear
              </button>
            </div>

            <div className="history-list">
              {searchHistory.map((item) => (
                <button
                  className="history-item"
                  key={item}
                  title={item}
                  onClick={() => runSuggestedSearch(item)}
                >
                  <span className="history-icon">↻</span>
                  <span>{item}</span>
                </button>
              ))}
            </div>
          </>
        )}

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
                placeholder="Name, designation, email, phone..."
                aria-label="Search faculty"
                aria-autocomplete="list"
                aria-expanded={
                  showSuggestions && suggestions.length > 0
                }
                autoComplete="off"
              />

              <button
                type="submit"
                className="search-button"
                disabled={!query.trim() && !selectedDepartment}
              >
                Search <span aria-hidden="true">↗</span>
              </button>
            </form>

            <div className="department-filter">
              <label htmlFor="department-select">
                Filter by department
              </label>

              <select
                id="department-select"
                value={selectedDepartment}
                onChange={(event) => {
                  setSelectedDepartment(event.target.value)
                  setSelectedFaculty(null)
                  setShowSuggestions(false)
                  setApiError('')
                }}
              >
                <option value="">All Departments</option>

                {departments.map((department) => (
                  <option
                    key={department.id}
                    value={department.name}
                  >
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            {departmentError && (
              <p className="department-error">{departmentError}</p>
            )}

            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionListRef}
                className="autocomplete-list"
                role="listbox"
                aria-label="Faculty suggestions"
                style={{
                  maxHeight: '320px',
                  overflowY: 'auto',
                  overscrollBehavior: 'contain',
                }}
              >
                {suggestions.map((faculty, index) => (
                  <button
                    key={faculty.id}
                    data-suggestion-index={index}
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
                    <FacultyAvatar
                      name={faculty.fullName}
                      photoUrl={faculty.photoUrl}
                      className="autocomplete-avatar"
                    />

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
              <span className="suggestions-label">
                Try searching for
              </span>

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
                      <strong>{resultDescription}</strong>
                    </p>
                  </div>

                  <button
                    className="clear-results"
                    onClick={startNewSearch}
                  >
                    Clear
                  </button>
                </div>

                <p className="mock-warning">
                  {results.some((faculty) => faculty.isMock)
                    ? 'Development preview: fictional sample records are included.'
                    : 'Faculty information is displayed from the SearchIt database.'}
                </p>

                {apiError && (
                  <p className="mock-warning">{apiError}</p>
                )}

                {results.length > 0 ? (
                  <div className="results-list">
                    {results.map((faculty) => (
                      <article
                        className="faculty-result"
                        key={faculty.id}
                      >
                        <FacultyAvatar
                          name={faculty.fullName}
                          photoUrl={faculty.photoUrl}
                          className="faculty-avatar"
                        />

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
                  {selectedFaculty.isMock
                    ? 'Fictional sample record — not a real faculty profile.'
                    : 'Database record — verify official details before relying on them.'}
                </p>

                <FacultyAvatar
                  name={selectedFaculty.fullName}
                  photoUrl={selectedFaculty.photoUrl}
                  className="faculty-avatar"
                />

                <h3>{selectedFaculty.fullName}</h3>
                <p>{selectedFaculty.designation}</p>
                <p>{selectedFaculty.department}</p>

                {selectedFaculty.administrativePositions.map(
                  (position) => (
                    <p key={position}>{position}</p>
                  ),
                )}

                <div className="profile-contact">
                  <p>
                    <strong>Email:</strong> {selectedFaculty.email}
                  </p>
                  <p>
                    <strong>Office phone:</strong>{' '}
                    {selectedFaculty.officePhone}
                  </p>
                  <p>
                    <strong>Office room:</strong>{' '}
                    {selectedFaculty.officeRoom}
                  </p>
                </div>

                <div className="profile-actions">
                  <button
                    className="clear-results"
                    onClick={() => {
                      void navigator.clipboard
                        .writeText(selectedFaculty.email)
                        .catch(() => {
                          window.alert(
                            'Could not copy the email address.',
                          )
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

                  {selectedFaculty.officialProfileUrl && (
                    <a
                      className="email-link"
                      href={selectedFaculty.officialProfileUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Official profile ↗
                    </a>
                  )}
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
