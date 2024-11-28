import apiInstance from './ApiInstance';

export const getMedicines = async (): Promise<any> => {
    try {
        const response = await apiInstance.get("/medicines", {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        throw new Error;
    }
};

export const getFeed = async (): Promise<any> => {
    try {
        const response = await apiInstance.get("/feed", {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        throw new Error;
    }
};

export const getDoctors = async (): Promise<any> => {
    try {
        const response = await apiInstance.get("/finddoctors", {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        throw new Error;
    }
};

export const getRoom = async (userId: number): Promise<any> => {
    try {
        const response = await apiInstance.get(`/rooms/get_room_details?id=${userId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        throw new Error;
    }
};