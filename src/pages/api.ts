"use client"
import { TodoItem } from "@/state/todos";
import axios from "axios";

export async function updateTodo(id: string, activeTodo: TodoItem) {
    try {
        const { data } = await axios.put(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/todos/${id}`, { ...activeTodo, rand: Math.random() });
        if(!!data && !!data.last_updated){
            return data;
        }

        return null;
    }
    catch(e){
        return null;
    }
}

export async function createTodo(activeTodo: TodoItem) {
    try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/todos/`, { ...activeTodo });
        if(!!data && !!data.created_at){
            return data;
        }

        return null;
    }
    catch(e){
        return null;
    }
}

export async function deleteTodo(id: string) {
    try {
        const { data } = await axios.delete(`/api/todos/${id}`);
        if(!!data){
            return true;
        }

        return false;
    }
    catch(e){
        return false;
    }
}