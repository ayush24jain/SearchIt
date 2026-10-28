import { useState, type FormEvent } from 'react'
import './App.css'

const sampleSearches = [
  'Chemical Engineering',
  'Assistant Professor',
  'Dean Student Welfare',
]

function App() {
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!query.trim()) return

    window.alert(
      'SearchIt interface is working. Faculty search will be added in the next stage.',
    )
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

        <button
          className="new-search"
          onClick={() => {
            setQuery('')
            setMenuOpen(false)
          }}
        >
          <span className="plus-icon">+</span>
          New search
        </button>

        <div className="sidebar-heading">RECENT SEARCHES</div>

        <div className="history-list">
          {sampleSearches.map((item) => (
            <button
              className="history-item"
              key={item}
              onClick={() => {
                setQuery(item)
                setMenuOpen(false)
              }}
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
            Faculty directory
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
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name, department, designation..."
                aria-label="Search SVNIT faculty"
              />

              <button
                type="submit"
                className="search-button"
                disabled={!query.trim()}
              >
                Search <span aria-hidden="true">↗</span>
              </button>
            </form>

            <div className="suggestions">
              <span className="suggestions-label">Try searching for</span>

              {sampleSearches.map((item) => (
                <button
                  key={item}
                  className="suggestion-chip"
                  onClick={() => setQuery(item)}
                >
                  {item}
                </button>
              ))}
            </div>

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