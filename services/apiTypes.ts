import type { User } from '../types';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    firstName: string;
    lastName: string;
}

export type UserUpdateData = Partial<Pick<User, 'firstName' | 'lastName' | 'currency'>>;