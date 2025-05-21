import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Chart, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { 
  FaCalculator, 
  FaCog, 
  FaCalendarAlt, 
  FaPencilAlt, 
  FaTrashAlt, 
  FaArrowRight,
  FaPlus,
  FaDice,
  FaChartLine,
  FaChartPie,
  FaEdit,
  FaTimes
} from 'react-icons/fa';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import SimulationControls from '../../simulation/scripts/SimulationControls';
import SimulationHistory from '../../simulation/scripts/PastSimulations';
import '../../simulation/styles/GroupCreation.css';
import LifeSmartLogo from '../../../../assets/icons/LifeSmartLogo.png';

Chart.register(ArcElement, Tooltip, Legend, Title);

const SimSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [showSimulationControls, setShowSimulationControls] = useState(false);
  const [showSimulationHistory, setShowSimulationHistory] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [currentSimulationIndex, setCurrentSimulationIndex] = useState(null);
  const [maxPortfolioValue, setMaxPortfolioValue] = useState(100000);
  const [roundTo, setRoundTo] = useState(5000);
  const [enableRandomGeneration, setEnableRandomGeneration] = useState(true);
  const [groups, setGroups] = useState([]);
  const [uid, setUid] = useState(null);
  const chartsRef = useRef([]);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.error('No user is logged in.');
      navigate('/');
      return;
    }

    setUid(currentUser.uid);
  }, [navigate]);

  useEffect(() => {
    const fetchTeamsFromFirebase = async () => {
      if (!uid) return;

      try {
        // First try to get teams from navigation state
        const teamsFromState = location.state?.teams;
        if (teamsFromState) {
          const teamsData = teamsFromState.map(team => ({
            name: team.name,
            points: team.points,
            assets: {
              equity: 0,
              bonds: 0,
              realestate: 0,
              commodities: 0,
              other: 0,
            },
            percentages: {
              equity: 0,
              bonds: 0,
              realestate: 0,
              commodities: 0,
              other: 0,
            },
            usePercentage: true,
            allocatedFunds: 0,
          }));
          setGroups(teamsData);
          setIsLoading(false);
          return;
        }

        // If no teams in state, fetch from Firebase
        const db = getFirestore();
        const teamsCollectionRef = collection(db, uid, 'Quiz Simulations', 'Teams');
        const querySnapshot = await getDocs(teamsCollectionRef);

        if (querySnapshot.empty) {
          console.error('No team data found in Firebase.');
          setIsLoading(false);
          return;
        }

        const teamsData = querySnapshot.docs.map(doc => ({
          name: doc.data().name,
          points: doc.data().points,
          assets: {
            equity: 0,
            bonds: 0,
            realestate: 0,
            commodities: 0,
            other: 0,
          },
          percentages: {
            equity: 0,
            bonds: 0,
            realestate: 0,
            commodities: 0,
            other: 0,
          },
          usePercentage: true,
          allocatedFunds: 0,
        }));

        setGroups(teamsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching team data:', error);
        setIsLoading(false);
      }
    };

    fetchTeamsFromFirebase();
  }, [uid, location.state]);

  const getTotalSpendableAmount = (points) => {
    return 100000 + (points * 5000);
  };

  const getRemainingSpendableAmount = (group) => {
    const totalSpendable = getTotalSpendableAmount(group.points);
    const totalAllocated = Object.values(group.assets).reduce(
      (sum, value) => sum + parseFloat(value || 0),
      0
    );
    return totalSpendable - totalAllocated;
  };

  const updateSpendableAmount = (index) => {
    setGroups(prevGroups => {
      const newGroups = [...prevGroups];
      const group = newGroups[index];
      const remaining = getRemainingSpendableAmount(group);
      newGroups[index].allocatedFunds = remaining;
      return newGroups;
    });
  };

  const handleAssetInputChange = (index, key, value) => {
    setGroups(prevGroups => {
      const newGroups = [...prevGroups];
      const group = newGroups[index];
      const totalSpendable = getTotalSpendableAmount(group.points);
      
      // Handle empty input
      if (value === '') {
        group.percentages[key] = '';
        group.assets[key] = 0;
        return newGroups;
      }
      
      const newPercentage = parseFloat(value);
      
      // Validate percentage is between 0 and 100
      if (newPercentage < 0 || newPercentage > 100) {
        alert('Percentage must be between 0 and 100');
        return prevGroups;
      }
      
      // Calculate the actual amount based on percentage
      const newAmount = (newPercentage / 100) * totalSpendable;
      
      // Calculate total percentage across all assets
      const currentTotalPercentage = Object.values(group.percentages).reduce(
        (sum, val) => sum + parseFloat(val || 0),
        0
      );
      const newTotalPercentage = currentTotalPercentage - (parseFloat(group.percentages[key]) || 0) + newPercentage;
      
      // If total percentage would exceed 100%, don't update
      if (newTotalPercentage > 100) {
        alert('Total allocation cannot exceed 100%');
        return prevGroups;
      }
      
      group.percentages[key] = newPercentage;
      group.assets[key] = newAmount;
      return newGroups;
    });
    updateSpendableAmount(index);
  };

  const generateRandomValues = (index) => {
    if (!enableRandomGeneration) return;
    
    setGroups(prevGroups => {
      const newGroups = [...prevGroups];
      const group = newGroups[index];
      const totalSpendable = getTotalSpendableAmount(group.points);
      
      let remainingPercentage = 100;
      const percentages = [];
      
      // Generate random percentages that sum to 100
      for (let i = 0; i < 4; i++) {
        const max = remainingPercentage - (4 - i);
        const percentage = Math.floor(Math.random() * max) + 1;
        percentages.push(percentage);
        remainingPercentage -= percentage;
      }
      percentages.push(remainingPercentage);
      
      // Shuffle the percentages
      for (let i = percentages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [percentages[i], percentages[j]] = [percentages[j], percentages[i]];
      }
      
      // Apply the percentages to each asset type
      const assetTypes = ['equity', 'bonds', 'realestate', 'commodities', 'other'];
      assetTypes.forEach((type, i) => {
        group.percentages[type] = percentages[i];
        group.assets[type] = (percentages[i] / 100) * totalSpendable;
      });
      
      return newGroups;
    });
  };

  const editGroupName = (index) => {
    const newName = prompt("Enter new group name:", groups[index].name);
    if (newName && newName.trim() !== '') {
      setGroups(prevGroups => {
        const newGroups = [...prevGroups];
        newGroups[index].name = newName.trim();
        return newGroups;
      });
    }
  };

  const removeGroup = (index) => {
    setGroups(prevGroups => {
      const newGroups = prevGroups.filter((_, i) => i !== index);
      if (chartsRef.current[index]) {
        chartsRef.current[index].destroy();
      }
      return newGroups;
    });
  };

  const addGroup = () => {
    setShowModal(true);
  };

  const confirmAddGroup = () => {
    if (newGroupName.trim() === '') {
      alert('Please enter a group name');
      return;
    }

    setGroups(prevGroups => [
      ...prevGroups,
      {
        name: newGroupName.trim(),
        points: 0,
        assets: {
          equity: 0,
          bonds: 0,
          realestate: 0,
          commodities: 0,
          other: 0,
        },
        percentages: {
          equity: 0,
          bonds: 0,
          realestate: 0,
          commodities: 0,
          other: 0,
        },
        usePercentage: true,
        allocatedFunds: 100000,
      }
    ]);

    setNewGroupName('');
    setShowModal(false);
  };

  const startSimulation = async () => {
    if (groups.length === 0) {
      alert('Please add at least one group before starting the simulation');
      return;
    }

    // Validate that all groups have allocated 100% of their funds
    const invalidGroups = groups.filter(group => {
      const totalPercentage = Object.values(group.percentages).reduce(
        (sum, val) => sum + parseFloat(val || 0),
        0
      );
      return totalPercentage !== 100;
    });

    if (invalidGroups.length > 0) {
      alert('All groups must allocate 100% of their funds before starting the simulation');
      return;
    }

    try {
      const db = getFirestore();
      const simulationData = {
        timestamp: new Date(),
        groups: groups.map(group => ({
          name: group.name,
          points: group.points,
          assets: group.assets,
          percentages: group.percentages
        }))
      };

      const docRef = await addDoc(collection(db, uid, 'Quiz Simulations', 'Simulations'), simulationData);
      navigate('/simulation', { 
        state: { 
          simulationId: docRef.id,
          groups: groups
        }
      });
    } catch (error) {
      console.error('Error starting simulation:', error);
      alert('Failed to start simulation. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sim-setup-container">
      <div className="sim-setup-header">
        <img src={LifeSmartLogo} alt="LifeSmart Logo" className="sim-setup-logo" />
        <h1>Simulation Setup</h1>
      </div>

      <div className="sim-setup-controls">
        <button 
          className="sim-setup-control-button"
          onClick={() => setShowSimulationControls(!showSimulationControls)}
        >
          <FaCog /> Simulation Controls
        </button>
        <button 
          className="sim-setup-control-button"
          onClick={() => setShowSimulationHistory(!showSimulationHistory)}
        >
          <FaCalendarAlt /> Past Simulations
        </button>
      </div>

      {showSimulationControls && (
        <SimulationControls
          maxPortfolioValue={maxPortfolioValue}
          setMaxPortfolioValue={setMaxPortfolioValue}
          roundTo={roundTo}
          setRoundTo={setRoundTo}
          enableRandomGeneration={enableRandomGeneration}
          setEnableRandomGeneration={setEnableRandomGeneration}
        />
      )}

      {showSimulationHistory && (
        <SimulationHistory
          currentSimulationIndex={currentSimulationIndex}
          setCurrentSimulationIndex={setCurrentSimulationIndex}
        />
      )}

      <div className="sim-setup-groups">
        <div className="sim-setup-groups-header">
          <h2>Groups</h2>
          <button className="sim-setup-add-group-button" onClick={addGroup}>
            <FaPlus /> Add Group
          </button>
        </div>

        {groups.map((group, index) => (
          <div key={index} className="sim-setup-group">
            <div className="sim-setup-group-header">
              <h3>{group.name}</h3>
              <div className="sim-setup-group-actions">
                <button onClick={() => editGroupName(index)}>
                  <FaEdit />
                </button>
                <button onClick={() => removeGroup(index)}>
                  <FaTrashAlt />
                </button>
              </div>
            </div>

            <div className="sim-setup-group-content">
              <div className="sim-setup-group-info">
                <p>Points: {group.points}</p>
                <p>Total Spendable: £{getTotalSpendableAmount(group.points).toLocaleString()}</p>
                <p>Remaining: £{getRemainingSpendableAmount(group).toLocaleString()}</p>
              </div>

              <div className="sim-setup-group-assets">
                {Object.entries(group.percentages).map(([key, value]) => (
                  <div key={key} className="sim-setup-asset-input">
                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => handleAssetInputChange(index, key, e.target.value)}
                      min="0"
                      max="100"
                      step="1"
                    />
                    <span>%</span>
                    <span className="sim-setup-asset-amount">
                      £{group.assets[key].toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <button 
                className="sim-setup-random-button"
                onClick={() => generateRandomValues(index)}
                disabled={!enableRandomGeneration}
              >
                <FaDice /> Generate Random Values
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="sim-setup-modal">
          <div className="sim-setup-modal-content">
            <h3>Add New Group</h3>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter group name"
            />
            <div className="sim-setup-modal-actions">
              <button onClick={confirmAddGroup}>Add</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <button 
        className="sim-setup-start-button"
        onClick={startSimulation}
        disabled={groups.length === 0}
      >
        Start Simulation <FaArrowRight />
      </button>
    </div>
  );
};

export default SimSetup; 