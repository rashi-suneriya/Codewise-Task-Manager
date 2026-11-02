import React from 'react';
import { CheckSquare, Plus, RefreshCw } from 'lucide-react';

const Header = ({ onOpenCreateModal, onRefresh, isRefreshing }) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <div className="brand-icon-wrapper">
            <CheckSquare className="brand-icon" size={26} />
          </div>
          <div>
            <div className="brand-title-row">
              <h1 className="brand-title">Personal Task Manager</h1>
            </div>
            <p className="brand-subtitle">Organize, track, and accomplish your daily tasks</p>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Tasks"
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
            <span className="btn-text">Refresh</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenCreateModal}
          >
            <Plus size={18} />
            <span>Create Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
