import React, { useState, useEffect } from 'react';

function App() {
  const [shakeCount, setShakeCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [error, setError] = useState('');
  const [refreshRate, setRefreshRate] = useState(100); // Refresh rate in milliseconds

  useEffect(() => {
    let lastShakeTime = 0;

    const handleShake = (event) => {
      const { accelerationIncludingGravity } = event;
      const { x, y, z } = accelerationIncludingGravity;
      const acceleration = Math.sqrt(x ** 2 + y ** 2 + z ** 2);

      const now = Date.now();

      // Only process event if enough time has passed since the last shake
      if (acceleration > 15 && now - lastShakeTime > refreshRate) {
        setShakeCount((prev) => prev + 1);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 300); // Reset animation state
        lastShakeTime = now; // Update last shake time
      }
    };

    const checkSensors = async () => {
      try {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
          const permission = await DeviceMotionEvent.requestPermission();
          if (permission !== 'granted') {
            setError('Permission for motion sensors was denied.');
            return;
          }
        }
        window.addEventListener('devicemotion', handleShake);
      } catch (err) {
        setError('Error accessing motion sensors.');
      }
    };

    checkSensors();

    return () => {
      window.removeEventListener('devicemotion', handleShake);
    };
  }, [refreshRate]);

  const resetCounter = () => {
    setShakeCount(0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Shake Counter</h1>
      <div className={`w-32 h-32 bg-green-500 transition-transform duration-300 ${isShaking ? 'transform scale-125 bg-red-500' : ''}`}>
      </div>
      <p className="text-2xl mt-4">Total Shakes: {shakeCount}</p>
      <button onClick={resetCounter} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Reset Counter
      </button>
      <div className="mt-4">
        <label className="text-lg">Adjust Refresh Rate (ms): {refreshRate}</label>
        <input
          type="range"
          min="100"
          max="1000"
          step="100"
          value={refreshRate}
          onChange={(e) => setRefreshRate(Number(e.target.value))}
          className="ml-2"
        />
      </div>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}

export default App;
