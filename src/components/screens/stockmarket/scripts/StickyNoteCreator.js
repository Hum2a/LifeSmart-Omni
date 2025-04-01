import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firebaseAuth, db } from '../../../../firebase/initFirebase';
import { doc, setDoc, getDocs, collection, deleteDoc, serverTimestamp } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../styles/StickyNoteCreator.css';

const StickyNoteCreator = () => {
  const navigate = useNavigate();
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteDate, setNoteDate] = useState(null);
  const [noteLinkName, setNoteLinkName] = useState('');
  const [noteLinks, setNoteLinks] = useState('');
  const [showForAllUsers, setShowForAllUsers] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [portfolioValueThreshold, setPortfolioValueThreshold] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [existingNotes, setExistingNotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [stickyNotePosition, setStickyNotePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragInitialPosition, setDragInitialPosition] = useState({ x: 0, y: 0 });

  const stocks = [
    { name: 'Amazon', symbol: 'AMZN'},
    { name: 'Apple', symbol: 'AAPL'},
    { name: 'Boeing', symbol: 'BA'},
    { name: 'Coca-Cola', symbol: 'KO'},
    { name: 'Disney', symbol: 'DIS'},
    { name: 'Google', symbol: 'GOOGL'},
    { name: 'Mastercard', symbol: 'MA'},
    { name: 'Microsoft', symbol: 'MSFT'},
    { name: 'Nike', symbol: 'NKE'},
    { name: 'NVIDIA', symbol: 'NVDA'},
    { name: 'PayPal', symbol: 'PYPL'},
    { name: 'Pfizer', symbol: 'PFE'},
    { name: 'Roblox', symbol: 'RBLX'},
    { name: 'Shell', symbol: 'SHEL'},
    { name: 'Spotify', symbol: 'SPOT'},
    { name: 'Tesla', symbol: 'TSLA'},
    { name: 'Visa', symbol: 'V'},
    { name: 'Walmart', symbol: 'WMT'}
  ];

  useEffect(() => {
    fetchExistingNotes();
    fetchUsers();
  }, []);

  const fetchExistingNotes = async () => {
    const querySnapshot = await getDocs(collection(db, 'Sticky Notes'));
    const notes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    notes.sort((a, b) => b.createdAt - a.createdAt);
    setExistingNotes(notes);
  };

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, 'Users'));
    const usersData = querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    setUsers(usersData);
  };

  const createOrUpdateStickyNote = async (e) => {
    e.preventDefault();
    const note = {
      title: noteTitle,
      content: noteContent,
      date: noteDate,
      linkName: noteLinkName,
      links: noteLinks,
      showForAllUsers,
      selectedUsers,
      selectedStocks,
      portfolioValueThreshold,
      position: stickyNotePosition,
      createdAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, 'Sticky Notes', noteTitle), note);
      await fetchExistingNotes();
      resetForm();
    } catch (error) {
      console.error('Error creating or updating sticky note:', error);
    }
  };

  const selectNoteForEditing = (note) => {
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteDate(note.date);
    setNoteLinkName(note.linkName || '');
    setNoteLinks(note.links);
    setShowForAllUsers(note.showForAllUsers);
    setSelectedUsers(note.selectedUsers || []);
    setSelectedStocks(note.selectedStocks);
    setPortfolioValueThreshold(note.portfolioValueThreshold);
    setStickyNotePosition(note.position || { x: 0, y: 0 });
    setEditingNoteId(note.id);
  };

  const deleteNote = async (noteId) => {
    try {
      await deleteDoc(doc(db, 'Sticky Notes', noteId));
      await fetchExistingNotes();
    } catch (error) {
      console.error('Error deleting sticky note:', error);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => {
      const index = prev.indexOf(userId);
      if (index > -1) {
        const newUsers = [...prev];
        newUsers.splice(index, 1);
        return newUsers;
      } else {
        return [...prev, userId];
      }
    });
  };

  const toggleStockSelection = (stock) => {
    setSelectedStocks(prev => {
      const index = prev.indexOf(stock);
      if (index > -1) {
        const newStocks = [...prev];
        newStocks.splice(index, 1);
        return newStocks;
      } else {
        return [...prev, stock];
      }
    });
  };

  const resetForm = () => {
    setNoteTitle('');
    setNoteContent('');
    setNoteDate(null);
    setNoteLinkName('');
    setNoteLinks('');
    setShowForAllUsers(false);
    setSelectedUsers([]);
    setSelectedStocks([]);
    setPortfolioValueThreshold(null);
    setStickyNotePosition({ x: 0, y: 0 });
    setEditingNoteId(null);
  };

  const startDrag = (event) => {
    setIsDragging(true);
    const container = document.querySelector('.position-selector').getBoundingClientRect();
    const initialX = event.clientX - (stickyNotePosition.x / 100) * container.width;
    const initialY = event.clientY - (stickyNotePosition.y / 100) * container.height;
    setDragInitialPosition({ x: initialX, y: initialY });
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
  };

  const drag = (event) => {
    if (isDragging) {
      const container = document.querySelector('.position-selector').getBoundingClientRect();
      const x = event.clientX - dragInitialPosition.x;
      const y = event.clientY - dragInitialPosition.y;
      setStickyNotePosition({
        x: Math.min(Math.max((x / container.width) * 100, 0), 100),
        y: Math.min(Math.max((y / container.height) * 100, 0), 100)
      });
    }
  };

  const stopDrag = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
  };

  const formatDate = (date) => {
    if (!date) return '';
    if (date.toDate) {
      const dateObj = date.toDate();
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return dateObj.toLocaleDateString(undefined, options);
    }
    return date;
  };

  return (
    <div className="sticky-note-creator">
      <header className="header">
        <img src={require('../../../../assets/icons/LifeSmartLogo.png')} alt="Logo" className="logo" />
        <nav className="header-links">
          <button onClick={() => navigate('/stock-market-simulator')} className="nav-link">
            Admin Dashboard
          </button>
          <button onClick={() => navigate('/')} className="nav-link">
            Home
          </button>
        </nav>
      </header>
      <main className="main-content">
        <h1>{editingNoteId ? 'Edit Sticky Note' : 'Create Sticky Note'}</h1>
        <div className="form-container">
          <div className="note-content-card">
            <h2>Note Content</h2>
            <form onSubmit={createOrUpdateStickyNote}>
              <div className="form-group">
                <label htmlFor="note-title">Note Title:</label>
                <input
                  type="text"
                  id="note-title"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="note-content">Note Content:</label>
                <textarea
                  id="note-content"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="note-date">Date:</label>
                <DatePicker
                  selected={noteDate}
                  onChange={(date) => setNoteDate(date)}
                  dateFormat="MMMM d, yyyy"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="note-link-name">Link Name:</label>
                <input
                  type="text"
                  id="note-link-name"
                  value={noteLinkName}
                  onChange={(e) => setNoteLinkName(e.target.value)}
                  placeholder="Link Name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="note-links">Links:</label>
                <input
                  type="url"
                  id="note-links"
                  value={noteLinks}
                  onChange={(e) => setNoteLinks(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <button type="submit">{editingNoteId ? 'Update Note' : 'Create Note'}</button>
            </form>
          </div>
          <div className="options-card">
            <h2>Options</h2>
            <form>
              <div className="form-group">
                <label htmlFor="show-for-all">Show for All Users:</label>
                <input
                  type="checkbox"
                  id="show-for-all"
                  checked={showForAllUsers}
                  onChange={(e) => setShowForAllUsers(e.target.checked)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="users">Show for Specific Users:</label>
                <div className="user-buttons">
                  {users.map(user => (
                    <button
                      key={user.uid}
                      className={selectedUsers.includes(user.uid) ? 'selected' : ''}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleUserSelection(user.uid);
                      }}
                    >
                      {user.firstName || user.email}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="stocks">Show for Specific Stocks:</label>
                <div className="stock-buttons">
                  {stocks.map(stock => (
                    <button
                      key={stock.symbol}
                      className={selectedStocks.includes(stock.symbol) ? 'selected' : ''}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleStockSelection(stock.symbol);
                      }}
                    >
                      {stock.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="portfolio-value">Show if Portfolio Value is Above:</label>
                <input
                  type="number"
                  id="portfolio-value"
                  value={portfolioValueThreshold || ''}
                  onChange={(e) => setPortfolioValueThreshold(e.target.value ? Number(e.target.value) : null)}
                />
              </div>
            </form>
          </div>
        </div>
        <div className="existing-notes">
          <h2>Existing Notes</h2>
          <div className="notice-board">
            <ul>
              {existingNotes.map(note => (
                <li key={note.id} className="sticky-note" onClick={() => selectNoteForEditing(note)}>
                  <div className="note-header">
                    <span>{note.title}</span>
                    <button onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}>Delete</button>
                  </div>
                  <p>{note.content}</p>
                  <p>{note.date && `Date: ${formatDate(note.date)}`}</p>
                  {note.links && (
                    <a href={note.links} target="_blank" rel="noopener noreferrer">
                      {note.linkName || note.links}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StickyNoteCreator; 