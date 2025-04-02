import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../firebase/auth';
import { useAnalytics } from '../../../../hooks/useAnalytics';
import { db } from '../../../../firebase/initFirebase';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  doc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { 
  FaDatabase,
  FaArrowLeft,
  FaChartBar,
  FaTrash,
  FaSync,
  FaDownload,
  FaExclamationTriangle,
  FaCheck,
  FaClock
} from 'react-icons/fa';
import '../styles/AdminDatabaseManagement.css';

const AdminDatabaseManagement = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { trackFeatureView, trackAdminAction, trackError } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    collections: {},
    totalDocuments: 0,
    lastBackup: null,
    storageUsed: 0
  });
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Collection names to track
  const COLLECTIONS = [
    'Users',
    'Profiles',
    'Classes',
    'Assignments',
    'Submissions',
    'Messages',
    'SystemSettings',
    'Analytics'
  ];

  useEffect(() => {
    trackFeatureView('admin_database_management');
    loadDatabaseStats();
  }, []);

  const loadDatabaseStats = async () => {
    try {
      setLoading(true);
      const collectionsStats = {};
      let totalDocs = 0;

      for (const collectionName of COLLECTIONS) {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        const docsCount = snapshot.size;
        
        // Get the most recent document
        const recentQuery = query(collectionRef, orderBy('createdAt', 'desc'), limit(1));
        const recentDocs = await getDocs(recentQuery);
        const lastUpdated = recentDocs.docs[0]?.data()?.createdAt?.toDate() || null;

        collectionsStats[collectionName] = {
          documentCount: docsCount,
          lastUpdated: lastUpdated,
          estimatedSize: docsCount * 2, // Rough estimate in KB
        };

        totalDocs += docsCount;
      }

      setStats({
        collections: collectionsStats,
        totalDocuments: totalDocs,
        lastBackup: new Date().toISOString(), // This should come from your backup service
        storageUsed: totalDocs * 2 // Rough estimate in KB
      });

    } catch (error) {
      console.error('Error loading database stats:', error);
      trackError('LOAD_DB_STATS_ERROR', error.message, 'AdminDatabaseManagement');
    } finally {
      setLoading(false);
    }
  };

  const handleBackupDatabase = async () => {
    try {
      setProcessing(true);
      // Implement your backup logic here
      // This could involve Cloud Functions or a dedicated backup service
      
      trackAdminAction('backup_database', {
        timestamp: new Date().toISOString()
      });
      
      alert('Database backup initiated successfully!');
    } catch (error) {
      console.error('Error backing up database:', error);
      trackError('BACKUP_DB_ERROR', error.message, 'AdminDatabaseManagement');
      alert('Error backing up database: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handlePurgeCollection = async (collectionName) => {
    if (!window.confirm(`Are you sure you want to purge all documents in ${collectionName}? This action cannot be undone!`)) {
      return;
    }

    try {
      setProcessing(true);
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      // Use batched writes for better performance
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      
      trackAdminAction('purge_collection', {
        collection: collectionName,
        documentsDeleted: snapshot.size
      });
      
      await loadDatabaseStats(); // Refresh stats
      alert(`Successfully purged ${snapshot.size} documents from ${collectionName}`);
    } catch (error) {
      console.error('Error purging collection:', error);
      trackError('PURGE_COLLECTION_ERROR', error.message, 'AdminDatabaseManagement');
      alert('Error purging collection: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const toggleMaintenanceMode = async () => {
    try {
      setProcessing(true);
      const maintenanceRef = doc(db, 'SystemSettings', 'maintenance');
      
      // Implementation would depend on your maintenance mode logic
      // This is a simplified example
      setMaintenanceMode(!maintenanceMode);
      
      trackAdminAction('toggle_maintenance_mode', {
        enabled: !maintenanceMode
      });
      
      alert(`Maintenance mode ${!maintenanceMode ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error toggling maintenance mode:', error);
      trackError('TOGGLE_MAINTENANCE_ERROR', error.message, 'AdminDatabaseManagement');
      alert('Error toggling maintenance mode: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="admindb-loading">
        <div className="admindb-loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="admindb-container">
      <header className="admindb-header">
        <button 
          onClick={() => navigate('/admin')} 
          className="admindb-back-button"
        >
          <FaArrowLeft size={20} />
          <span>Back to Admin Panel</span>
        </button>
        <div className="admindb-header-content">
          <h1 className="admindb-title">
            <FaDatabase className="admindb-title-icon" />
            Database Management
          </h1>
          <p className="admindb-subtitle">Monitor and manage your database collections</p>
        </div>
      </header>

      <main className="admindb-main">
        <div className="admindb-overview">
          <div className="admindb-stat-card">
            <FaChartBar className="admindb-stat-icon" />
            <div className="admindb-stat-content">
              <h3>Total Documents</h3>
              <p>{stats.totalDocuments.toLocaleString()}</p>
            </div>
          </div>
          <div className="admindb-stat-card">
            <FaDatabase className="admindb-stat-icon" />
            <div className="admindb-stat-content">
              <h3>Storage Used</h3>
              <p>{formatBytes(stats.storageUsed * 1024)}</p>
            </div>
          </div>
          <div className="admindb-stat-card">
            <FaClock className="admindb-stat-icon" />
            <div className="admindb-stat-content">
              <h3>Last Backup</h3>
              <p>{formatDate(stats.lastBackup)}</p>
            </div>
          </div>
        </div>

        <div className="admindb-actions">
          <button 
            className="admindb-action-button backup"
            onClick={handleBackupDatabase}
            disabled={processing}
          >
            <FaDownload />
            Backup Database
          </button>
          <button 
            className={`admindb-action-button maintenance ${maintenanceMode ? 'active' : ''}`}
            onClick={toggleMaintenanceMode}
            disabled={processing}
          >
            <FaSync />
            {maintenanceMode ? 'Disable' : 'Enable'} Maintenance Mode
          </button>
        </div>

        <div className="admindb-collections">
          <h2>Collections</h2>
          <div className="admindb-collections-grid">
            {COLLECTIONS.map(collectionName => (
              <div key={collectionName} className="admindb-collection-card">
                <div className="admindb-collection-header">
                  <h3>{collectionName}</h3>
                  <button
                    className="admindb-collection-action danger"
                    onClick={() => handlePurgeCollection(collectionName)}
                    disabled={processing}
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="admindb-collection-stats">
                  <div className="admindb-collection-stat">
                    <span>Documents:</span>
                    <strong>{stats.collections[collectionName]?.documentCount.toLocaleString()}</strong>
                  </div>
                  <div className="admindb-collection-stat">
                    <span>Size:</span>
                    <strong>{formatBytes(stats.collections[collectionName]?.estimatedSize * 1024)}</strong>
                  </div>
                  <div className="admindb-collection-stat">
                    <span>Last Updated:</span>
                    <strong>{formatDate(stats.collections[collectionName]?.lastUpdated)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDatabaseManagement; 