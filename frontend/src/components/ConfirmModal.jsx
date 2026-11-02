import React from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, task, isDeleting }) => {
  if (!isOpen || !task) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container modal-confirm"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-labelledby="confirm-modal-title"
      >
        <div className="confirm-icon-wrapper">
          <AlertTriangle size={28} className="confirm-icon" />
        </div>

        <div className="confirm-content">
          <h3 id="confirm-modal-title" className="confirm-title">Delete Task?</h3>
          <p className="confirm-text">
            Are you sure you want to delete <strong>"{task.title}"</strong>? This action cannot be undone.
          </p>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(task.id || task._id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
