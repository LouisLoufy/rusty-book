import React, { useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { HiClock, HiX, HiTrash, HiOutlineDocumentText } from 'react-icons/hi';
import { useHistory } from '../../contexts/HistoryContext';
import { groupByDate } from '../../services/history/historyUtils';
import './HistoryModal.css';

function formatTime(timestamp) {
  const d = new Date(timestamp);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function HistoryModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { records, isReady, requiresAuth, clearHistory } = useHistory();

  const groups = useMemo(() => groupByDate(records), [records]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  const renderBody = () => {
    if (!isReady && requiresAuth) {
      return (
        <div className="history-modal-empty">
          <HiClock />
          <p>登录后即可查看浏览历史</p>
        </div>
      );
    }

    if (records.length === 0) {
      return (
        <div className="history-modal-empty">
          <HiClock />
          <p>还没有浏览记录</p>
          <span>阅读文章后会自动出现在这里</span>
        </div>
      );
    }

    return groups.map((group) => (
      <section key={group.key} className="history-modal-group">
        <div className="history-modal-group-title">{group.label}</div>
        <div className="history-modal-list">
          {group.records.map((record) => (
            <button
              key={record.path}
              type="button"
              className="history-modal-item"
              onClick={() => handleNavigate(record.path)}
            >
              <HiOutlineDocumentText className="history-modal-item-icon" />
              <div className="history-modal-item-main">
                <div className="history-modal-item-title">{record.title}</div>
                {record.category && (
                  <div className="history-modal-item-book">{record.category}</div>
                )}
              </div>
              <div className="history-modal-item-time">
                {formatTime(record.visitedAt)}
              </div>
            </button>
          ))}
        </div>
      </section>
    ));
  };

  return ReactDOM.createPortal(
    <div className="history-modal-backdrop" onClick={onClose}>
      <div
        className="history-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="history-modal-header">
          <h2 id="history-modal-title">浏览历史</h2>
          <div className="history-modal-header-actions">
            {records.length > 0 && (
              <button
                type="button"
                className="history-modal-clear"
                onClick={clearHistory}
              >
                <HiTrash />
                <span>清空</span>
              </button>
            )}
            <button
              type="button"
              className="history-modal-close"
              onClick={onClose}
              aria-label="关闭浏览历史"
            >
              <HiX />
            </button>
          </div>
        </div>

        <div className="history-modal-content">{renderBody()}</div>
      </div>
    </div>,
    document.body
  );
}

export default HistoryModal;
