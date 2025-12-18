import React, { useState, useEffect } from 'react';
import './App.css';
import api from './services/api';
import EquipmentList from './components/EquipmentList';
import EquipmentForm from './components/EquipmentForm';


function App() {
  // Store equipment list
  const [equipment, setEquipment] = useState([]);

  // Toggle between list view and form view
  const [view, setView] = useState('list'); // 'list' | 'form'

  // Store the item currently being edited (null if adding new)
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data when the component loads
  useEffect(() => {
    fetchEquipment();
  }, []);

  // Helper function to call the API
  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const res = await api.getEquipment();
      setEquipment(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch equipment.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setCurrentItem(null);
    setView('form');
  };

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setView('form');
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.deleteEquipment(id);
        fetchEquipment();
      } catch (err) {
        console.error(err);
        alert('Failed to delete equipment.');
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (currentItem) {
        await api.updateEquipment(currentItem.id, formData);
      } else {
        await api.createEquipment(formData);
      }
      fetchEquipment();
      setView('list');
    } catch (err) {
      console.error(err);
      alert('Failed to save equipment.');
    }
  };

  const handleCancel = () => {
    setView('list');
    setCurrentItem(null);
  };

  const filteredEquipment = equipment.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Equipment Tracker</h1>
      </header>
      <main className="App-main">
        {error && <div className="error-banner">{error}</div>}

        {view === 'list' && (
          <>
            <div className="actions-bar">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button className="btn-add" onClick={handleAddClick}>+ Add Equipment</button>
            </div>
            {loading ? <p>Loading...</p> : (
              <EquipmentList
                equipment={filteredEquipment}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            )}
          </>
        )}

        {view === 'form' && (
          <EquipmentForm
            currentItem={currentItem}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </main>
    </div>
  );
}

export default App;
