import React from 'react';
import {useForm} from 'react-hook-form';
import {Link, useNavigate} from 'react-router-dom';
import {useAuthStore} from '../hooks/useAuthStore';
import type {LoginCredentials} from '../services/apiTypes';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<LoginCredentials>();
    const navigate = useNavigate();
    const {login} = useAuthStore();

    const onSubmit = async (data: LoginCredentials) => {
        try {
            await login(data);
            toast.success('Logged in successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Failed to login. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent">
            <div className="max-w-md w-full glassmorphism rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-white mb-2">KS|Design</h2>
                <p className="text-center text-slate-300 mb-8">Welcome back! Please sign in.</p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register('email', {required: 'Email is required'})}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-slate-800/50 text-white`}
                        />
                        {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-slate-300"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register('password', {required: 'Password is required'})}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-slate-600'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-slate-800/50 text-white`}
                        />
                        {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;