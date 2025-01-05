import axios from 'axios';

const api_url = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

export const fetchData = async (endpoints) => {
    try {
        const response = await api_url.get(endpoints);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw error;
    }
};

export const postData = async (endpoint, data) => {
    try {
        const response = await api_url.post(endpoint, data);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'envoi des données:', error);
        throw error;
    }
};

export const putData = async (endpoint, data) => {
    try {
        const response = await api_url.put(endpoint, data);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour des données:', error);
        throw error;
    }
};

export const deleteData = async (endpoint) => {
    try {
        const response = await api_url.delete(endpoint);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression des données:', error);
        throw error;
    }
};
