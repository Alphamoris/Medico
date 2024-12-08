
import { number } from 'zod';
import apiInstance from './ApiInstance';

export const postRoom = async ( id : number , roomName: string, roomId: number, password: string ): Promise<any> => {
    try {
        const response = await apiInstance.post("/rooms/create_room", {id : id , room_name : roomName, join_code : roomId, password: password });
        return response.data;
    } catch (error) {
        throw new Error;
    }
};

export const postJoinRoom = async ( joinCode : number ): Promise<any> => {
    try {
        const response = await apiInstance.post("/rooms/join_room", { join_code: joinCode });
        return response.data;
    } catch (error) {
        throw new Error;
    }
};


export const postFeedback = async ( formData : any ): Promise<any> => {
    try {
        const response = await apiInstance.post("/feedback/", { name: formData.name, email: formData.email, feedback: formData.message });
        return response.data;
    } catch (error) {
        throw new Error;
    }
};

