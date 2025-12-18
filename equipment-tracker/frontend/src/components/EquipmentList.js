import React from 'react';
import { format } from 'date-fns';

const EquipmentList = ({ equipment, onEdit, onDelete }) => {
    return (
        <div className="equipment-list">
            <h2>Equipment List</h2>
            {equipment.length === 0 ? (
                <p>No equipment found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Last Cleaned</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipment.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.type}</td>
                                <td>
                                    <span className={`status-badge status-${item.status.toLowerCase().replace(/\s/g, '-')}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td>{item.lastCleanedDate ? format(new Date(item.lastCleanedDate), 'MMM d, yyyy') : '-'}</td>
                                <td>
                                    <button className="btn-edit" onClick={() => onEdit(item)}>Edit</button>
                                    <button className="btn-delete" onClick={() => onDelete(item.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default EquipmentList;
