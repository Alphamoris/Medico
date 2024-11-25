import apiInstance from './ApiInstance';
import { Medicine } from '@/components/BuyMedicines';

// No need to explicitly mention interceptors here since they are handled in ApiInstance
export const getMedicines = async (): Promise<any> => {
    try {
        const response = await apiInstance.get("/medicines", {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;  // Return data to be used in the component
    } catch (error) {
        throw new Error // Let the component handle the error
    }
};


export const getFeed = async (): Promise<any> => {
    try {
        const response = await apiInstance.get("/feed", {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;  // Return data to be used in the component
    } catch (error) {
        throw new Error // Let the component handle the error
    }
};



export const getDoctors = async (): Promise<any> => {
    try {
        const response = await apiInstance.get("/finddoctors", {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;  // Return data to be used in the component
    } catch (error) {
        throw new Error // Let the component handle the error
    }
};
