import axios from 'axios';

const API_URL = 'http://localhost:5001/api/equipment';

const getEquipment = () => axios.get(API_URL);
const createEquipment = (data) => axios.post(API_URL, data);
const updateEquipment = (id, data) => axios.put(`${API_URL}/${id}`, data);
const deleteEquipment = (id) => axios.delete(`${API_URL}/${id}`);

export default {
    getEquipment,
    createEquipment,
    updateEquipment,
    deleteEquipment
};
