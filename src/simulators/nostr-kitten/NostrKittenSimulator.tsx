import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { MockUser, MockNote } from '../../data/mock';
import './nostr-kitten.theme.css';

interface NostrKittenSimulatorProps {
  className?: string;
}

export function NostrKittenSimulator({ className = '' }: NostrKittenSimulatorProps) {
  const [visitorCount, setVisitorCount] = useState(1337);
  const [activeTab, setActiveTab] = useState('home');
  const [showGuestbook, setShowGuestbook] = useState(false);
  const [midiPlaying, setMidiPlaying] = useState(false);

  return (
    <div className={`nostr-kitten-simulator ${className}`}>
      {/* Starfield Background */}
      <div className="starfield" />
      
      {/* MIDI Player (fake) */}
      <div className="midi-player">
        <button 
          onClick={() => setMidiPlaying(!midiPlaying)}
          className="midi-btn"
        >
          {midiPlaying ? '⏹ Stop MIDI' : '▶ Play MIDI'}
        </button>
        <span className="midi-text">🎵 All-Star.mid</span>
      </div>

      {/* Main Container */}
      <div className="geocities-container">
        {/* Header with Marquee */}
        <header className="geocities-header">
          <div className="construction-banner">
            🚧 UNDER CONSTRUCTION 🚧
          </div>
          <h1 className="main-title">
            <span className="rainbow-text">✨ NostrKitten ✨</span>
          </h1>
          <p className="subtitle blink">Welcome to my Nostr Page!</p>
          
          {/* Visitor Counter */}
          <div className="visitor-counter">
            <span>👀 Visitors: </span>
            <span className="counter-digits">{visitorCount.toString().padStart(6, '0')}</span>
          </div>

          {/* Best viewed badge */}
          <div className="browser-badge">
            Best viewed in Netscape 4.0 at 800x600
          </div>

          {/* Navigation Tabs */}
          <nav className="geocities-nav">
            <button 
              onClick={() => setActiveTab('home')}
              className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
            >
              🏠 Home
            </button>
            <button 
              onClick={() => setActiveTab('notes')}
              className={`nav-btn ${activeTab === 'notes' ? 'active' : ''}`}
            >
              📝 My Notes
            </button>
            <button 
              onClick={() => setActiveTab('guestbook')}
              className={`nav-btn ${activeTab === 'guestbook' ? 'active' : ''}`}
            >
              📖 Guestbook
            </button>
            <button 
              onClick={() => setActiveTab('links')}
              className={`nav-btn ${activeTab === 'links' ? 'active' : ''}`}
            >
              🔗 Cool Links
            </button>
          </nav>
        </header>

        {/* Main Content */}
        <main className="geocities-content">
          {activeTab === 'home' && <HomeTab />}
          {activeTab === 'notes' && <NotesTab />}
          {activeTab === 'guestbook' && <GuestbookTab />}
          {activeTab === 'links' && <LinksTab />}
        </main>

        {/* Footer */}
        <footer className="geocities-footer">
          <p>© 1999-2026 NostrKitten Industries</p>
          <p>Made with 💖 and Netscape Composer</p>
          <p className="webring">
            Part of the <a href="#">Nostr Webring</a> | 
            <a href="#">Previous</a> | 
            <a href="#">Next</a> | 
            <a href="#">Random</a>
          </p>
          <div className="hit-counter">
            <img src="https://counter.digits.com/wc/-d/6/nostr-kitten" alt="Hit Counter" />
          </div>
        </footer>
      </div>

      {/* Floating Elements */}
      <div className="floating-email">📧 Email me!</div>
      <div className="floating-icq">💬 ICQ: 123456789</div>
    </div>
  );
}

function HomeTab() {
  return (
    <div className="home-tab">
      <div className="welcome-box">
        <h2>🌟 Welcome to my Nostr Page! 🌟</h2>
        <p>Hi! I'm NostrKitten and this is my personal Nostr client page!</p>
        <p>I've been into decentralized social media since like, yesterday!</p>
        
        <div className="about-me">
          <h3>About Me:</h3>
          <ul>
            <li>🐱 I love cats</li>
            <li>⚡ Bitcoin maximalist since 2024</li>
            <li>🌙 Online since 1999</li>
            <li>💾 56k modem user</li>
          </ul>
        </div>

        <div className="currently-listening">
          <h3>🎵 Currently Listening To:</h3>
          <marquee>
            Smash Mouth - All Star | Aqua - Barbie Girl | Backstreet Boys - I Want It That Way | 
            Nirvana - Smells Like Teen Spirit | Creedence Clearwater Revival - Bad Moon Rising
          </marquee>
        </div>

        <div className="animated-gifs">
          <span className="spinning">🌐</span>
          <span className="bouncing">💾</span>
          <span className="spinning">📧</span>
          <span className="bouncing">⚡</span>
        </div>
      </div>

      <div className="side-widgets">
        <div className="widget">
          <h3>🔥 This page is HOT!</h3>
          <div className="flames">🔥🔥🔥</div>
        </div>

        <div className="widget">
          <h3>📊 Stats</h3>
          <p>Page created: 1999</p>
          <p>Last updated: Just now!</p>
          <p>Relays connected: 1337</p>
        </div>
      </div>
    </div>
  );
}

function NotesTab() {
  const [notes, setNotes] = useState([
    { id: 1, content: 'Just discovered Nostr! This is so cool! ⚡', date: '1999-12-31', author: 'NostrKitten' },
    { id: 2, content: 'My Y2K bug preparations are complete! 🐛', date: '1999-12-30', author: 'NostrKitten' },
    { id: 3, content: 'Anyone want to trade Pokemon cards? 🎴', date: '1999-12-29', author: 'NostrKitten' },
  ]);

  return (
    <div className="notes-tab">
      <h2>📝 My Notes</h2>
      <div className="notes-list">
        {notes.map(note => (
          <div key={note.id} className="note-card">
            <div className="note-header">
              <span className="note-author">{note.author}</span>
              <span className="note-date">{note.date}</span>
            </div>
            <p className="note-content">{note.content}</p>
            <div className="note-actions">
              <button className="action-btn">❤️ Like</button>
              <button className="action-btn">🔄 Repost</button>
              <button className="action-btn">⚡ Zap</button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="new-note-box">
        <textarea 
          placeholder="What's on your mind? (max 140 chars)"
          maxLength={140}
          className="note-input"
        />
        <button className="post-btn">🚀 Post Note!</button>
      </div>
    </div>
  );
}

function GuestbookTab() {
  const [entries, setEntries] = useState([
    { name: 'CyberPunk99', message: 'Cool page! Love the starfield!', date: '1999-12-31' },
    { name: 'SatoshiNakamoto', message: 'Working on something big... stay tuned', date: '1999-12-30' },
    { name: 'WebSurfer2000', message: 'A/S/L? Just kidding! Great Nostr client!', date: '1999-12-29' },
  ]);

  return (
    <div className="guestbook-tab">
      <h2>📖 Sign My Guestbook!</h2>
      <div className="guestbook-entries">
        {entries.map((entry, idx) => (
          <div key={idx} className="guestbook-entry">
            <div className="entry-header">
              <span className="entry-name">💌 {entry.name}</span>
              <span className="entry-date">{entry.date}</span>
            </div>
            <p className="entry-message">{entry.message}</p>
          </div>
        ))}
      </div>

      <div className="guestbook-form">
        <h3>✍️ Leave a message!</h3>
        <input type="text" placeholder="Your name" className="gb-input" />
        <input type="text" placeholder="Your email (optional)" className="gb-input" />
        <textarea placeholder="Your message" className="gb-textarea" />
        <button className="gb-submit">📨 Sign Guestbook!</button>
      </div>
    </div>
  );
}

function LinksTab() {
  const links = [
    { name: 'Bitcoin.org', url: '#', desc: 'The original cryptocurrency!' },
    { name: 'GeoCities', url: '#', desc: 'RIP 1994-2009 💀' },
    { name: 'AOL', url: '#', desc: 'You\'ve got mail!' },
    { name: 'Napster', url: '#', desc: 'Download MP3s here!' },
    { name: 'AltaVista', url: '#', desc: 'Best search engine!' },
  ];

  return (
    <div className="links-tab">
      <h2>🔗 Cool Links</h2>
      <p className="links-intro">Check out these awesome sites!</p>
      
      <div className="links-list">
        {links.map((link, idx) => (
          <div key={idx} className="link-item">
            <a href={link.url} className="link-url">{link.name}</a>
            <span className="link-desc">- {link.desc}</span>
            <span className="link-new">NEW!</span>
          </div>
        ))}
      </div>

      <div className="awards-section">
        <h3>🏆 Awards This Page Has Won</h3>
        <div className="awards">
          <span className="award">⭐ Site of the Day</span>
          <span className="award">🔥 Hot Page Award</span>
          <span className="award">💎 Diamond Quality</span>
        </div>
      </div>
    </div>
  );
}

export default NostrKittenSimulator;
