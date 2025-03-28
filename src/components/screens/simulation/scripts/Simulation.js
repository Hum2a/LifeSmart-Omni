import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Chart } from 'chart.js/auto';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import '../styles/Simulation.css';

// Custom hook for chart management
const useChart = (groups, simulationYears, fixedColors) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const destroyChart = useCallback(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }
  }, []);

  const calculateYAxisScale = useCallback((data) => {
    // Find the minimum and maximum values across all groups
    const allValues = data.flatMap(group => group.totalPortfolioValues.quarters);
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);

    // Calculate the scale
    const minScale = Math.max(0, minValue - 10000); // £10,000 below the minimum
    const maxScale = maxValue + 10000; // £10,000 above the maximum

    // Ensure £100,000 is in the middle of the scale
    const targetMiddle = 100000;
    const currentMiddle = (minScale + maxScale) / 2;
    const adjustment = targetMiddle - currentMiddle;

    return {
      min: Math.max(0, minScale + adjustment),
      max: maxScale + adjustment
    };
  }, []);

  const initializeChart = useCallback(() => {
    // Destroy existing chart before creating a new one
    destroyChart();

    const canvasElement = document.getElementById('portfolioChart');
    if (!canvasElement) return;

    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;

    const labels = ['Initial Value', ...Array.from({ length: simulationYears * 4 }, (_, i) => `Q${i + 1}`)];
    
    const datasets = groups.map((group, index) => ({
      label: group.name,
      data: [...group.totalPortfolioValues.quarters],
      borderColor: fixedColors[index % fixedColors.length],
      fill: false,
      cubicInterpolationMode: 'monotone',
      tension: 0.4,
      borderDash: index > 5 ? [5, 5] : [],
    }));

    const yAxisScale = calculateYAxisScale(groups);

    const chartConfig = {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { size: 18, weight: 'bold' },
              color: '#333',
            },
          },
          title: {
            display: true,
            text: 'Total Portfolio Value Over Time',
          },
          tooltip: {
            enabled: true,
            titleFont: { size: 18 },
            bodyFont: { size: 16 },
            footerFont: { size: 14 },
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: £${context.parsed.y.toLocaleString()}`;
              }
            }
          },
        },
        scales: {
          x: { 
            grid: { display: false },
            ticks: {
              font: { size: 14 }
            }
          },
          y: {
            min: yAxisScale.min,
            max: yAxisScale.max,
            ticks: {
              callback: function(value) {
                return '£' + value.toLocaleString();
              },
              font: { size: 14 }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
              drawBorder: false
            }
          }
        },
        maintainAspectRatio: true,
        animation: {
          duration: 0,
          easing: 'linear'
        },
      },
    };

    chartInstanceRef.current = new Chart(ctx, chartConfig);
  }, [groups, simulationYears, fixedColors, destroyChart, calculateYAxisScale]);

  const updateChart = useCallback(() => {
    if (!chartInstanceRef.current) return;

    const labels = ['Initial Value', ...Array.from({ length: simulationYears * 4 }, (_, i) => `Q${i + 1}`)];
    
    const datasets = groups.map((group, index) => ({
      label: group.name,
      data: [...group.totalPortfolioValues.quarters],
      borderColor: fixedColors[index % fixedColors.length],
      fill: false,
      cubicInterpolationMode: 'monotone',
      tension: 0.4,
      borderDash: index > 5 ? [5, 5] : [],
    }));

    const yAxisScale = calculateYAxisScale(groups);

    chartInstanceRef.current.data.labels = labels;
    chartInstanceRef.current.data.datasets = datasets;
    chartInstanceRef.current.options.scales.y.min = yAxisScale.min;
    chartInstanceRef.current.options.scales.y.max = yAxisScale.max;
    chartInstanceRef.current.update('none');
  }, [groups, simulationYears, fixedColors, calculateYAxisScale]);

  useEffect(() => {
    initializeChart();
    return () => {
      destroyChart();
    };
  }, [initializeChart, destroyChart]);

  return { updateChart, chartRef };
};

// Custom hook for simulation state
const useSimulation = (groups, assetChanges, simulationYears, setGroups, simulationSpeed) => {
  const [currentQuarterIndex, setCurrentQuarterIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [allQuarters, setAllQuarters] = useState([]);
  const simulationRef = useRef(null);
  const isUpdatingRef = useRef(false);

  const calculateAllQuarters = useCallback(() => {
    const totalQuarters = simulationYears * 4;
    const quarters = ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'];
    const calculatedQuarters = [];

    // Initialize with current values
    calculatedQuarters.push(groups);

    // Calculate all quarters upfront
    for (let quarterIndex = 0; quarterIndex < totalQuarters; quarterIndex++) {
      const year = Math.floor(quarterIndex / 4);
      const quarter = quarterIndex % 4;
      const currentQuarter = quarters[quarter];
      const assetChangesForQuarter = assetChanges[year]?.[currentQuarter];

      if (!assetChangesForQuarter) continue;

      const updatedGroups = calculatedQuarters[quarterIndex].map(group => {
        let totalValue = 0;
        const newQuarterlyValues = { ...group.quarterlyValues };

        Object.keys(assetChangesForQuarter).forEach(assetType => {
          const growthRate = assetChangesForQuarter[assetType] / 100;
          const assetKey = assetType.toLowerCase();
          const currentValue = group.quarterlyValues[assetKey][quarterIndex];
          const newValue = currentValue * (1 + growthRate);
          newQuarterlyValues[assetKey].push(newValue);
          totalValue += newValue;
        });

        return {
          ...group,
          quarterlyValues: newQuarterlyValues,
          totalPortfolioValues: {
            ...group.totalPortfolioValues,
            quarters: [...group.totalPortfolioValues.quarters, totalValue]
          }
        };
      });

      calculatedQuarters.push(updatedGroups);
    }

    setAllQuarters(calculatedQuarters);
  }, [groups, assetChanges, simulationYears]);

  useEffect(() => {
    calculateAllQuarters();
    return () => {
      if (simulationRef.current) {
        clearTimeout(simulationRef.current);
      }
    };
  }, [calculateAllQuarters]);

  const updateToQuarter = useCallback((targetIndex) => {
    if (targetIndex >= allQuarters.length || isUpdatingRef.current) return;
    
    isUpdatingRef.current = true;
    setGroups(allQuarters[targetIndex]);
    setCurrentQuarterIndex(targetIndex);
    
    // Reset the updating flag after a short delay
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 50);
  }, [allQuarters, setGroups]);

  const nextQuarter = useCallback(() => {
    if (isUpdatingRef.current) return;
    updateToQuarter(currentQuarterIndex + 1);
  }, [currentQuarterIndex, updateToQuarter]);

  const runFullSimulation = useCallback(() => {
    if (isSimulating || isUpdatingRef.current) return;
    setIsSimulating(true);

    const totalQuarters = simulationYears * 4;
    let currentIndex = currentQuarterIndex;

    const runNextQuarter = () => {
      if (currentIndex < totalQuarters && !isUpdatingRef.current) {
        currentIndex++;
        updateToQuarter(currentIndex);
        simulationRef.current = setTimeout(runNextQuarter, simulationSpeed);
      } else {
        setIsSimulating(false);
      }
    };

    runNextQuarter();
  }, [isSimulating, simulationYears, currentQuarterIndex, updateToQuarter, simulationSpeed]);

  const pauseSimulation = useCallback(() => {
    setIsSimulating(false);
    if (simulationRef.current) {
      clearTimeout(simulationRef.current);
      simulationRef.current = null;
    }
  }, []);

  return {
    currentQuarterIndex,
    isSimulating,
    nextQuarter,
    setIsSimulating: pauseSimulation,
    runFullSimulation
  };
};

const Simulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [uid, setUid] = useState(null);
  const [latestSimulationIndex, setLatestSimulationIndex] = useState(null);
  const [groups, setGroups] = useState([]);
  const [simulationYears, setSimulationYears] = useState(1);
  const [assetChanges, setAssetChanges] = useState([]);
  const [simulationSpeed, setSimulationSpeed] = useState(750);

  const fixedColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#8B0000', '#00FF7F', '#FFD700', '#4682B4'
  ];

  const { updateChart, chartRef } = useChart(groups, simulationYears, fixedColors);
  const {
    currentQuarterIndex,
    isSimulating,
    nextQuarter,
    setIsSimulating,
    runFullSimulation
  } = useSimulation(groups, assetChanges, simulationYears, setGroups, simulationSpeed);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        
        if (location.state) {
          const { groups: passedGroups } = location.state;
          const transformedGroups = passedGroups.map(group => ({
            id: group.name,
            name: group.name,
            initialValues: {
              equity: parseFloat(group.equity) || 0,
              bonds: parseFloat(group.bonds) || 0,
              realestate: parseFloat(group.realestate) || 0,
              commodities: parseFloat(group.commodities) || 0,
              other: parseFloat(group.other) || 0
            },
            quarterlyValues: {
              equity: [parseFloat(group.equity) || 0],
              bonds: [parseFloat(group.bonds) || 0],
              realestate: [parseFloat(group.realestate) || 0],
              commodities: [parseFloat(group.commodities) || 0],
              other: [parseFloat(group.other) || 0]
            },
            totalPortfolioValues: {
              initial: Object.values({
                equity: parseFloat(group.equity) || 0,
                bonds: parseFloat(group.bonds) || 0,
                realestate: parseFloat(group.realestate) || 0,
                commodities: parseFloat(group.commodities) || 0,
                other: parseFloat(group.other) || 0
              }).reduce((acc, val) => acc + val, 0),
              quarters: [Object.values({
                equity: parseFloat(group.equity) || 0,
                bonds: parseFloat(group.bonds) || 0,
                realestate: parseFloat(group.realestate) || 0,
                commodities: parseFloat(group.commodities) || 0,
                other: parseFloat(group.other) || 0
              }).reduce((acc, val) => acc + val, 0)]
            }
          }));
          
          setGroups(transformedGroups);
        }

        const index = await fetchLatestSimulationIndex(user.uid);
        setLatestSimulationIndex(index);
        if (index) {
          await fetchAssetChanges(user.uid, index);
        }
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate, location.state]);

  const fetchLatestSimulationIndex = async (userId) => {
    const db = getFirestore();
    const simulationsRef = collection(db, userId, "Asset Market Simulations", "Simulations");
    const querySnapshot = await getDocs(simulationsRef);
    return querySnapshot.empty ? 1 : querySnapshot.size;
  };

  const fetchAssetChanges = async (userId, index) => {
    const db = getFirestore();
    const docRef = doc(db, 'Quiz', 'Asset Market Simulations', 'Simulations', `Simulation ${index}`, 'Simulation Controls', 'Controls');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setAssetChanges(data.assetChanges);
      setSimulationYears(data.years || 1);
    }
  };

  const finishSimulation = async () => {
    const finalValues = groups.map(group => ({
      name: group.name,
      equity: group.quarterlyValues.equity[group.quarterlyValues.equity.length - 1],
      bonds: group.quarterlyValues.bonds[group.quarterlyValues.bonds.length - 1],
      realestate: group.quarterlyValues.realestate[group.quarterlyValues.realestate.length - 1],
      commodities: group.quarterlyValues.commodities[group.quarterlyValues.commodities.length - 1],
      other: group.quarterlyValues.other[group.quarterlyValues.other.length - 1],
    }));

    const quarterResults = groups.map(group => ({
      name: group.name,
      equity: group.quarterlyValues.equity,
      bonds: group.quarterlyValues.bonds,
      realestate: group.quarterlyValues.realestate,
      commodities: group.quarterlyValues.commodities,
      other: group.quarterlyValues.other,
    }));

    const db = getFirestore();
    try {
      await setDoc(doc(db, uid, 'Asset Market Simulations', 'Simulations', 'Simulation 1', "Results", "Final"), { finalValues });
      await setDoc(doc(db, uid, 'Asset Market Simulations', 'Simulations', 'Simulation 1', "Results", "Quarters"), { quarterResults });
      navigate('/simulation-results');
    } catch (error) {
      console.error("Error saving simulation results:", error);
    }
  };

  return (
    <div>
      <header className="header">
        <img src="/images/LifeSmartLogo.png" alt="Logo" className="logo" />
      </header>

      <div className="sim-chart-container">
        <canvas id="portfolioChart" ref={chartRef}></canvas>
        <button 
          onClick={nextQuarter} 
          className="modern-button"
          disabled={currentQuarterIndex >= simulationYears * 4}
        >
          Next Quarter
        </button>
        <button 
          onClick={runFullSimulation} 
          className="modern-button"
          disabled={isSimulating}
        >
          Run Full Simulation
        </button>
        <button 
          onClick={() => setIsSimulating(false)} 
          className="modern-button" 
          style={{ display: isSimulating ? 'block' : 'none' }}
        >
          Pause Simulation
        </button>
        <button 
          onClick={runFullSimulation} 
          className="modern-button" 
          style={{ display: isSimulating ? 'none' : 'block' }}
        >
          Resume Simulation
        </button>
        <input 
          type="number" 
          value={simulationSpeed} 
          onChange={(e) => setSimulationSpeed(Number(e.target.value))}
          min="100" 
          step="100" 
          title="Simulation Speed (ms)"
        />
      </div>

      <button onClick={finishSimulation} className="modern-button">
        Finish Simulation
      </button>
    </div>
  );
};

export default Simulation; 