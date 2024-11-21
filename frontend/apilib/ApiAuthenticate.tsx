
import apiInstance from './ApiInstance';
import { SignupFormData , LoginFormData } from '@/interface';

export const signup = async (userData : SignupFormData) : Promise<any> => {
    try {
        const response = await apiInstance.post("/signup", userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;  // Return data to be used in the component
    } catch (error) {
        throw new Error // Let the component handle the error
    }
};



export const login = async (userData : LoginFormData) : Promise<any> => {
    const formData = new FormData()
    formData.append("username", userData.email)
    formData.append("password", userData.password)
    try {
        const response = await apiInstance.post("/login", formData , {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;  // Return data to be used in the component
    } catch (error) {
        throw new Error // Let the component handle the error
    }
};
