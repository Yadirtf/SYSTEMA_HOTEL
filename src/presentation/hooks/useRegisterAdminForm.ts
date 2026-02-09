import { useState } from 'react';
import { useAuth } from './useAuth';

interface RegisterAdminFormData {
    firstName: string;
    lastName: string;
    document: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const useRegisterAdminForm = (onSuccess: () => void) => {
    const { registerAdmin, loading, error } = useAuth();
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState<RegisterAdminFormData>({
        firstName: '',
        lastName: '',
        document: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isFormValid = Object.values(formData).every(val => val !== '') &&
        formData.password === formData.confirmPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Las claves no coinciden.');
            return;
        }
        try {
            await registerAdmin(formData);
            setShowSuccess(true);
        } catch (err) {
            // Error is handled by useAuth and returned as 'error' state
        }
    };

    const handleSuccessConfirm = () => {
        setShowSuccess(false);
        onSuccess();
    };

    return {
        formData,
        handleChange,
        handleSubmit,
        isFormValid,
        loading,
        error,
        showSuccess,
        handleSuccessConfirm,
        setShowSuccess // Exposed in case we need manual control, though mainly internal
    };
};
