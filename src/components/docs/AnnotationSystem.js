import React, { useState, useEffect } from 'react';
import { HiAnnotation, HiX } from 'react-icons/hi';
import './AnnotationSystem.css';

const AnnotationSystem = () => {
  const [annotations, setAnnotations] = useState([]);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    // Load annotations from localStorage
    const savedAnnotations = localStorage.getItem('doc-annotations');
    if (savedAnnotations) {
      try {
        setAnnotations(JSON.parse(savedAnnotations));
      } catch (e) {
        console.error('Failed to load annotations:', e);
      }
    }

    // Handle text selection
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (text && text.length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setSelectedText(text);
        setToolbarPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 40
        });
        setShowToolbar(true);
      } else {
        setShowToolbar(false);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const saveAnnotations = (newAnnotations) => {
    setAnnotations(newAnnotations);
    localStorage.setItem('doc-annotations', JSON.stringify(newAnnotations));
  };

  const handleCreateAnnotation = () => {
    if (!noteContent.trim()) return;

    const newAnnotation = {
      id: Date.now(),
      text: selectedText,
      note: noteContent,
      path: window.location.pathname,
      createdAt: new Date().toISOString()
    };

    saveAnnotations([...annotations, newAnnotation]);
    setNoteContent('');
    setIsCreatingNote(false);
    setShowToolbar(false);
  };

  const handleDeleteAnnotation = (id) => {
    saveAnnotations(annotations.filter(a => a.id !== id));
  };

  const currentPageAnnotations = annotations.filter(
    a => a.path === window.location.pathname
  );

  return (
    <>
      {/* Selection Toolbar */}
      {showToolbar && !isCreatingNote && (
        <div
          className="annotation-toolbar"
          style={{
            left: `${toolbarPosition.x}px`,
            top: `${toolbarPosition.y}px`
          }}
        >
          <button
            className="annotation-toolbar-btn"
            onClick={() => setIsCreatingNote(true)}
            title="Add note"
          >
            <HiAnnotation /> Add Note
          </button>
        </div>
      )}

      {/* Note Creation Dialog */}
      {isCreatingNote && (
        <>
          <div
            className="annotation-backdrop"
            onClick={() => {
              setIsCreatingNote(false);
              setNoteContent('');
            }}
          />
          <div
            className="annotation-dialog"
            style={{
              left: `${toolbarPosition.x}px`,
              top: `${toolbarPosition.y + 50}px`
            }}
          >
            <div className="annotation-dialog-header">
              <span>Add Note</span>
              <button
                onClick={() => {
                  setIsCreatingNote(false);
                  setNoteContent('');
                }}
              >
                <HiX />
              </button>
            </div>
            <div className="annotation-dialog-quote">
              "{selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}"
            </div>
            <textarea
              className="annotation-dialog-input"
              placeholder="Write your note here..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              autoFocus
            />
            <div className="annotation-dialog-actions">
              <button
                className="annotation-btn annotation-btn-cancel"
                onClick={() => {
                  setIsCreatingNote(false);
                  setNoteContent('');
                }}
              >
                Cancel
              </button>
              <button
                className="annotation-btn annotation-btn-primary"
                onClick={handleCreateAnnotation}
              >
                Save Note
              </button>
            </div>
          </div>
        </>
      )}

      {/* Annotations List (Floating Panel) */}
      {currentPageAnnotations.length > 0 && (
        <div className="annotations-list">
          <div className="annotations-list-header">
            <HiAnnotation /> My Notes ({currentPageAnnotations.length})
          </div>
          {currentPageAnnotations.map(annotation => (
            <div key={annotation.id} className="annotation-item">
              <div className="annotation-quote">"{annotation.text.substring(0, 80)}..."</div>
              <div className="annotation-note">{annotation.note}</div>
              <div className="annotation-actions">
                <button
                  className="annotation-delete"
                  onClick={() => handleDeleteAnnotation(annotation.id)}
                  title="Delete note"
                >
                  <HiX />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AnnotationSystem;
