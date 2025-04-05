import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../firebase/auth';
import { useAnalytics } from '../../../../hooks/useAnalytics';
import { db } from '../../../../firebase/initFirebase';
import { collection, query, getDocs, doc, updateDoc, where, deleteDoc, orderBy, limit, getDoc } from 'firebase/firestore';
import { 
  FaUserShield,
  FaArrowLeft,
  FaSearch,
  FaEdit,
  FaBan,
  FaCheck,
  FaTrash,
  FaStar,
  FaUserCog,
  FaCode
} from 'react-icons/fa';
import ConfirmModal from '../../../widgets/modals/ConfirmModal';
import EditModal from '../../../widgets/modals/EditModal';
import '../styles/AdminUserManagement.css';

const AdminUserManagement = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { trackFeatureView, trackAdminAction, trackError } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'info',
    action: null
  });

  // Memoize the fetch users function
  const fetchUsers = useCallback(async () => {
    try {
      const usersRef = collection(db, 'Users');
      const usersSnap = await getDocs(usersRef);
      const usersData = [];
      
      for (const userDoc of usersSnap.docs) {
        const userData = userDoc.data();
        
        // Fetch the last login and streak from Login Streak document
        let lastLogin = null;
        let streak = 0;
        try {
          const loginStreakRef = doc(db, userDoc.id, 'Login Streak');
          const loginSnap = await getDoc(loginStreakRef);
          
          if (loginSnap.exists()) {
            const loginData = loginSnap.data();
            lastLogin = loginData.lastLogin;
            streak = loginData.streak || 0;
          }
        } catch (error) {
          console.error('Error fetching login streak for user:', userDoc.id, error);
        }

        // Fetch total funds
        let totalFunds = 0;
        try {
          const fundsRef = doc(db, userDoc.id, 'Total Funds');
          const fundsSnap = await getDoc(fundsRef);
          
          if (fundsSnap.exists()) {
            totalFunds = fundsSnap.data().amount || 0;
          }
        } catch (error) {
          console.error('Error fetching total funds for user:', userDoc.id, error);
        }
        
        // Combine all data from the main document
        const user = {
          id: userDoc.id,
          email: userData.email || '',
          admin: userData.admin || false,
          developer: userData.developer || false,
          isActive: userData.isActive !== false,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          school: userData.school || '',
          class: userData.class || '',
          groupCode: userData.groupCode || '',
          role: userData.role || 'user',
          userUID: userDoc.id,
          lastLogin: lastLogin || userData.lastLogin || null,
          streak: streak,
          createdAt: userData.createdAt || null,
          totalFunds: totalFunds
        };

        console.log('Processing user:', user); // Debug log for each user
        usersData.push(user);
      }

      console.log('All fetched users:', usersData); // Debug log for all users
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      trackError('FETCH_USERS_ERROR', error.message, 'AdminUserManagement');
      setLoading(false);
    }
  }, []);

  // Track feature view once on mount
  useEffect(() => {
    trackFeatureView('admin_user_management');
  }, []);

  // Fetch users once on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserAction = async (action, user) => {
    setSelectedUser(user);
    
    switch (action) {
      case 'edit':
        setShowEditModal(true);
        break;
      case 'toggle-status':
        setModalConfig({
          title: user.isActive ? 'Deactivate User' : 'Activate User',
          message: `Are you sure you want to ${user.isActive ? 'deactivate' : 'activate'} ${user.email}?`,
          type: 'warning',
          action: 'toggle-status'
        });
        break;
      case 'toggle-admin':
        setModalConfig({
          title: user.admin ? 'Remove Admin' : 'Make Admin',
          message: `Are you sure you want to ${user.admin ? 'remove admin rights from' : 'make admin'} ${user.email}?`,
          type: 'warning',
          action: 'toggle-admin'
        });
        break;
      case 'toggle-developer':
        setModalConfig({
          title: user.developer ? 'Remove Developer' : 'Make Developer',
          message: `Are you sure you want to ${user.developer ? 'remove developer rights from' : 'make developer'} ${user.email}?`,
          type: 'warning',
          action: 'toggle-developer'
        });
        break;
      case 'delete':
        setModalConfig({
          title: 'Delete User',
          message: `Are you sure you want to delete ${user.email}? This action cannot be undone.`,
          type: 'danger',
          action: 'delete'
        });
        break;
      default:
        return;
    }
    
    setShowModal(true);
  };

  const handleEditSave = async (updatedData) => {
    await fetchUsers(); // Refresh the user list after edit
    trackAdminAction('edit_user', {
      userId: selectedUser.id,
      changes: Object.keys(updatedData).join(', ')
    });
  };

  const handleConfirmAction = async () => {
    if (!selectedUser) return;

    try {
      const userRef = doc(db, 'Users', selectedUser.id);
      const userProfileRef = doc(db, selectedUser.id, 'Profile');
      
      switch (modalConfig.action) {
        case 'toggle-status':
          console.log('Toggling status for user:', selectedUser.id);
          await updateDoc(userRef, {
            isActive: !selectedUser.isActive
          });
          // Update Profile document
          await updateDoc(userProfileRef, {
            isActive: !selectedUser.isActive
          });
          trackAdminAction('toggle_user_status', {
            userId: selectedUser.id,
            newStatus: !selectedUser.isActive
          });
          break;
        
        case 'toggle-admin':
          console.log('Toggling admin for user:', selectedUser.id);
          const newAdminStatus = !selectedUser.admin;
          await updateDoc(userRef, {
            admin: newAdminStatus,
            user: !newAdminStatus
          });
          // Update Profile document
          await updateDoc(userProfileRef, {
            admin: newAdminStatus,
            user: !newAdminStatus
          });
          trackAdminAction('toggle_admin_status', {
            userId: selectedUser.id,
            newStatus: newAdminStatus
          });
          break;

        case 'toggle-developer':
          console.log('Toggling developer for user:', selectedUser.id);
          const newDevStatus = !selectedUser.developer;
          await updateDoc(userRef, {
            developer: newDevStatus,
            user: !newDevStatus
          });
          // Update Profile document
          await updateDoc(userProfileRef, {
            developer: newDevStatus,
            user: !newDevStatus
          });
          trackAdminAction('toggle_developer_status', {
            userId: selectedUser.id,
            newStatus: newDevStatus
          });
          break;
        
        case 'delete':
          console.log('Deleting user:', selectedUser.id);
          try {
            // Delete the Profile document first
            await deleteDoc(userProfileRef);
            
            // Then delete the main user document
            await deleteDoc(userRef);
            
            trackAdminAction('delete_user', {
              userId: selectedUser.id
            });
          } catch (deleteError) {
            console.error('Error during delete:', deleteError);
            throw deleteError;
          }
          break;
        
        default:
          break;
      }

      // Show success message
      alert(`Action ${modalConfig.action} completed successfully`);

      // Refresh the user list after any changes
      await fetchUsers();
      setShowModal(false);
      setSelectedUser(null);
      
    } catch (error) {
      console.error('Error updating user:', error);
      alert(`Error: ${error.message}`);
      trackError('USER_UPDATE_ERROR', error.message, 'AdminUserManagement');
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="adminusers-loading">
        <div className="adminusers-loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="adminusers-container">
      <header className="adminusers-header">
        <button 
          onClick={() => navigate('/admin')} 
          className="adminusers-back-button"
        >
          <FaArrowLeft size={20} />
          <span>Back to Admin Panel</span>
        </button>
        <div className="adminusers-header-content">
          <h1 className="adminusers-title">
            <FaUserShield className="adminusers-title-icon" />
            User Management
          </h1>
          <p className="adminusers-subtitle">Manage user accounts and permissions</p>
        </div>
      </header>

      <main className="adminusers-main">
        <div className="adminusers-controls">
          <div className="adminusers-search">
            <FaSearch className="adminusers-search-icon" />
            <input
              type="text"
              placeholder="Search by name, email, school, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="adminusers-search-input"
            />
          </div>
          <div className="adminusers-stats">
            <div className="adminusers-stat">
              <strong>{users.length}</strong> Total Users
            </div>
            <div className="adminusers-stat">
              <strong>{users.filter(u => u.admin).length}</strong> Admins
            </div>
            <div className="adminusers-stat">
              <strong>{users.filter(u => u.developer).length}</strong> Developers
            </div>
            <div className="adminusers-stat">
              <strong>{users.filter(u => u.isActive).length}</strong> Active
            </div>
          </div>
        </div>

        <div className="adminusers-table-container">
          <table className="adminusers-table">
            <thead>
              <tr>
                <th>User Info</th>
                <th>School</th>
                <th>Class & Group</th>
                <th>Roles</th>
                <th>Last Login</th>
                <th>Total Funds</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td className="adminusers-user-info">
                    <div className="adminusers-user-details">
                      <span className="adminusers-name" title={`${user.firstName} ${user.lastName}`}>
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="adminusers-email" title={user.email}>
                        {user.email}
                      </span>
                      <span className="adminusers-uid" title={`User ID: ${user.userUID}`}>
                        ID: {user.userUID}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="adminusers-school" title={user.school}>
                      {user.school || 'Not specified'}
                    </span>
                  </td>
                  <td>
                    <div className="adminusers-class-group">
                      <span className="adminusers-class" title={`Class: ${user.class}`}>
                        {user.class || 'Not specified'}
                      </span>
                      {user.groupCode && (
                        <span className="adminusers-group" title={`Group: ${user.groupCode}`}>
                          Group: {user.groupCode}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="adminusers-roles">
                      {user.admin ? (
                        <span className="adminusers-role admin">Admin</span>
                      ) : user.developer ? (
                        <span className="adminusers-role developer">Developer</span>
                      ) : (
                        <span className="adminusers-role user">User</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="adminusers-login-info">
                      <span className="adminusers-last-login">
                        {user.lastLogin || 'Never'}
                      </span>
                      {user.streak > 0 && (
                        <span className="adminusers-streak" title="Current login streak">
                          🔥 {user.streak} days
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="adminusers-funds">
                      £{user.totalFunds.toFixed(2)}
                    </span>
                  </td>
                  <td className="adminusers-actions">
                    <button
                      onClick={() => handleUserAction('edit', user)}
                      className="adminusers-action-button edit"
                      title="Edit User"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleUserAction('toggle-status', user)}
                      className={`adminusers-action-button ${user.isActive ? 'deactivate' : 'activate'}`}
                      title={user.isActive ? 'Deactivate User' : 'Activate User'}
                    >
                      {user.isActive ? <FaBan /> : <FaCheck />}
                    </button>
                    <button
                      onClick={() => handleUserAction('toggle-admin', user)}
                      className={`adminusers-action-button ${user.admin ? 'remove-admin' : 'make-admin'}`}
                      title={user.admin ? 'Remove Admin' : 'Make Admin'}
                    >
                      {user.admin ? <FaUserCog /> : <FaStar />}
                    </button>
                    <button
                      onClick={() => handleUserAction('toggle-developer', user)}
                      className={`adminusers-action-button ${user.developer ? 'remove-developer' : 'make-developer'}`}
                      title={user.developer ? 'Remove Developer' : 'Make Developer'}
                    >
                      <FaCode />
                    </button>
                    <button
                      onClick={() => handleUserAction('delete', user)}
                      className="adminusers-action-button delete"
                      title="Delete User"
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

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmAction}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />

      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        userId={selectedUser?.id}
        onSave={handleEditSave}
      />
    </div>
  );
};

export default AdminUserManagement; 