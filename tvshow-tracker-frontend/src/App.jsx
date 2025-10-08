import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: 'blue' }}>🚀 TV Show Tracker - TEST</h1>
      <p>Se você está vendo isso, o React está funcionando!</p>
      <button 
        style={{ 
          backgroundColor: 'green', 
          color: 'white', 
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px'
        }}
        onClick={() => alert('Funcionando!')}
      >
        Clique para testar
      </button>
    </div>
  );
}

export default App;