import { useState } from 'react';

export const useForm = (initialState, onSubmit) => {
    const [formData, setFormData] = useState(initialState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (onSubmit) {
            return await onSubmit(formData);
        }
    };

    const resetForm = () => {
        setFormData(initialState);
    };

    const setFieldValue = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return {
        formData,
        handleChange,
        handleSubmit,
        resetForm,
        setFieldValue
    };
};