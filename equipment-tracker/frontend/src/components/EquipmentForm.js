import React, { useState, useEffect } from 'react';

const EquipmentForm = ({ currentItem, onSave, onCancel }) => {
    // Local state for the form fields
    const [formData, setFormData] = useState({
        name: '',
        type: 'Machine',
        status: 'Active',
        lastCleanedDate: ''
    });
    const [error, setError] = useState('');

    // If we are editing (currentItem exists), fill the form
    useEffect(() => {
        if (currentItem) {
            setFormData({
                name: currentItem.name,
                type: currentItem.type,
                status: currentItem.status,
                lastCleanedDate: currentItem.lastCleanedDate ? currentItem.lastCleanedDate.split('T')[0] : ''
            });
        } else {
            // Otherwise, reset to defaults
            setFormData({
                name: '',
                type: 'Machine',
                status: 'Active',
                lastCleanedDate: ''
            });
        }
    }, [currentItem]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Simple validation
        if (!formData.name.trim()) {
            setError('Name is required');
            return;
        }

        onSave(formData);
    };

    return (
        <div className="form-container">
            <h2>{currentItem ? 'Edit Equipment' : 'Add New Equipment'}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Equipment Name"
                    />
                </div>

                <div className="form-group">
                    <label>Type:</label>
                    <select name="type" value={formData.type} onChange={handleChange}>
                        <option value="Machine">Machine</option>
                        <option value="Vessel">Vessel</option>
                        <option value="Tank">Tank</option>
                        <option value="Mixer">Mixer</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Status:</label>
                    <select name="status" value={formData.status} onChange={handleChange}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Under Maintenance">Under Maintenance</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Last Cleaned Date:</label>
                    <input
                        type="date"
                        name="lastCleanedDate"
                        value={formData.lastCleanedDate}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-save">Save</button>
                    <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EquipmentForm;
