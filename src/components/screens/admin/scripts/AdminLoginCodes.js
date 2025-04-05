import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../firebase/auth';
import { useAnalytics } from '../../../../hooks/useAnalytics';
import { db } from '../../../../firebase/initFirebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { 
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaCheck,
  FaBan,
  FaCopy,
  FaKey
} from 'react-icons/fa';
import '../styles/AdminLoginCodes.css';

const AdminLoginCodes = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { trackFeatureView, trackAdminAction, trackError } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [codes, setCodes] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCode, setNewCode] = useState({
    name: '',
    active: true
  });

  useEffect(() => {
    trackFeatureView('admin_login_codes');
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const codesRef = collection(db, 'Login Codes');
      const codesQuery = query(codesRef);
      const codesSnap = await getDocs(codesQuery);
      
      const codesData = codesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setCodes(codesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching login codes:', error);
      trackError('FETCH_CODES_ERROR', error.message, 'AdminLoginCodes');
      setLoading(false);
    }
  };

  const handleCreateCode = async (e) => {
    e.preventDefault();
    try {
      const codeData = {
        active: true
      };

      await setDoc(doc(db, 'Login Codes', newCode.name), codeData);
      trackAdminAction('create_login_code', { codeName: newCode.name });
      setShowCreateModal(false);
      setNewCode({ name: '', active: true });
      fetchCodes();
    } catch (error) {
      console.error('Error creating login code:', error);
      trackError('CREATE_CODE_ERROR', error.message, 'AdminLoginCodes');
      alert('Error creating login code: ' + error.message);
    }
  };

  const handleToggleCode = async (codeId, currentStatus) => {
    try {
      const codeRef = doc(db, 'Login Codes', codeId);
      await updateDoc(codeRef, {
        active: !currentStatus
      });
      trackAdminAction('toggle_login_code', { codeId, newStatus: !currentStatus });
      fetchCodes();
    } catch (error) {
      console.error('Error toggling login code:', error);
      trackError('TOGGLE_CODE_ERROR', error.message, 'AdminLoginCodes');
      alert('Error updating login code: ' + error.message);
    }
  };

  const handleDeleteCode = async (codeId) => {
    if (!window.confirm('Are you sure you want to delete this login code? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'Login Codes', codeId));
      trackAdminAction('delete_login_code', { codeId });
      fetchCodes();
    } catch (error) {
      console.error('Error deleting login code:', error);
      trackError('DELETE_CODE_ERROR', error.message, 'AdminLoginCodes');
      alert('Error deleting login code: ' + error.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    trackAdminAction('copy_login_code', { codeName: text });
  };

  if (loading) {
    return (
      <div className="adminlogincodes-loading">
        <div className="adminlogincodes-loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="adminlogincodes-container">
      <header className="adminlogincodes-header">
        <button 
          onClick={() => navigate('/admin')} 
          className="adminlogincodes-back-button"
        >
          <FaArrowLeft size={20} />
          <span>Back to Admin Panel</span>
        </button>
        <div className="adminlogincodes-header-content">
          <h1 className="adminlogincodes-title">
            <FaKey className="adminlogincodes-title-icon" />
            Login Codes Management
          </h1>
          <p className="adminlogincodes-subtitle">Manage login codes for user access</p>
        </div>
      </header>

      <main className="adminlogincodes-main">
        <div className="adminlogincodes-controls">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="adminlogincodes-create-button"
          >
            <FaPlus size={16} />
            Create New Code
          </button>
          <div className="adminlogincodes-stats">
            <div className="adminlogincodes-stat">
              <strong>{codes.length}</strong> Total Codes
            </div>
            <div className="adminlogincodes-stat">
              <strong>{codes.filter(c => c.active).length}</strong> Active Codes
            </div>
          </div>
        </div>

        <div className="adminlogincodes-table-container">
          <table className="adminlogincodes-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {codes.map(code => (
                <tr key={code.id}>
                  <td>
                    <div className="adminlogincodes-code-cell">
                      <span className="adminlogincodes-code">{code.id}</span>
                      <button
                        onClick={() => copyToClipboard(code.id)}
                        className="adminlogincodes-copy-button"
                        title="Copy code"
                      >
                        <FaCopy size={14} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className={`adminlogincodes-status ${code.active ? 'active' : 'inactive'}`}>
                      {code.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="adminlogincodes-actions">
                    <button
                      onClick={() => handleToggleCode(code.id, code.active)}
                      className={`adminlogincodes-action-button ${code.active ? 'deactivate' : 'activate'}`}
                      title={code.active ? 'Deactivate Code' : 'Activate Code'}
                    >
                      {code.active ? <FaBan /> : <FaCheck />}
                    </button>
                    <button
                      onClick={() => handleDeleteCode(code.id)}
                      className="adminlogincodes-action-button delete"
                      title="Delete Code"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {showCreateModal && (
        <div className="adminlogincodes-modal-overlay">
          <div className="adminlogincodes-modal">
            <button 
              className="adminlogincodes-modal-close"
              onClick={() => setShowCreateModal(false)}
            >
              ×
            </button>
            <h2>Create New Login Code</h2>
            <form onSubmit={handleCreateCode}>
              <div className="adminlogincodes-modal-field">
                <label htmlFor="codeName">Code Name</label>
                <input
                  type="text"
                  id="codeName"
                  value={newCode.name}
                  onChange={(e) => setNewCode({ ...newCode, name: e.target.value })}
                  required
                  placeholder="Enter code name"
                />
              </div>
              <div className="adminlogincodes-modal-actions">
                <button 
                  type="button" 
                  className="adminlogincodes-modal-button cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="adminlogincodes-modal-button create"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLoginCodes;