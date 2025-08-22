import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';
import type { RegisterCredentials } from '../services/apiTypes';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterCredentials>();
    const navigate = useNavigate();
    const { register: registerUser } = useAuthStore();

    const onSubmit = async (data: RegisterCredentials) => {
        try {
            await registerUser(data);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
            toast.error(errorMessage);
        }
    };

    const inputClasses = (hasError: boolean) =>
        `mt-1 block w-full px-3 py-2 border ${hasError ? 'border-red-500' : 'border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-slate-800/50 text-white`;

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent">
            <div className="max-w-md w-full glassmorphism rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-white mb-2">Create Account</h2>
                <p className="text-center text-slate-300 mb-8">Join KS|Design to manage your finances.</p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-slate-300">First Name</label>
                            <input
                                id="firstName"
                                type="text"
                                {...register('firstName', { required: 'First name is required' })}
                                className={inputClasses(!!errors.firstName)}
                            />
                            {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-slate-300">Last Name</label>
                            <input
                                id="lastName"
                                type="text"
                                {...register('lastName', { required: 'Last name is required' })}
                                className={inputClasses(!!errors.lastName)}
                            />
                            {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email address</label>
                        <input
                            id="email"
                            type="email"
                            {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }})}
                            className={inputClasses(!!errors.email)}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
                        <input
                            id="password"
                            type="password"
                            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' }})}
                            className={inputClasses(!!errors.password)}
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                    >
                        {isSubmitting ? 'Creating account...' : 'Sign up'}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;