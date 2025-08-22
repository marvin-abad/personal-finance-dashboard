
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../hooks/useAuthStore';
import toast from 'react-hot-toast';

interface ProfileFormProps {
  onClose: () => void;
}

type FormData = {
  firstName: string;
  lastName: string;
  currency: string;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ onClose }) => {
  const { user, updateUser } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<FormData>();
  
  useEffect(() => {
    if (user) {
      setValue('firstName', user.firstName);
      setValue('lastName', user.lastName);
      setValue('currency', user.currency);
    }
  }, [user, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
        await updateUser(data);
        toast.success(`Profile updated successfully!`);
        onClose();
    } catch(e) {
        toast.error('An error occurred while updating your profile.');
    }
  };

  const inputClasses = "mt-1 block w-full p-2 border border-slate-600 rounded-md bg-slate-800/50 text-slate-200";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-2">
      <h2 className="text-xl font-bold text-slate-200">Edit Profile</h2>
       <div>
        <label className="block text-sm font-medium text-slate-300">First Name</label>
        <input {...register('firstName', { required: true })} className={inputClasses} />
         {errors.firstName && <p className="text-red-500 text-sm mt-1">First name is required.</p>}
      </div>
       <div>
        <label className="block text-sm font-medium text-slate-300">Last Name</label>
        <input {...register('lastName', { required: true })} className={inputClasses} />
         {errors.lastName && <p className="text-red-500 text-sm mt-1">Last name is required.</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300">Currency</label>
        <select {...register('currency')} className={inputClasses}>
          <option value="PHP">PHP - Philippines Peso</option>
          <option value="USD">US - US Currency</option>
          <option value="EUR">EUR - Euro</option>
          <option value="GBP">GBP - British Pound</option>
          <option value="JPY">JPY - Japanese Yen</option>
        </select>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 rounded-md hover:bg-slate-700 text-slate-200">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
      </div>
    </form>
  );
};

export default ProfileForm;