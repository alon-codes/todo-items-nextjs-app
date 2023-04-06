"use client"
import { atom } from "recoil";

export interface TodoItem {
    id?: string;
    last_synced?: Date;
    text: string;
    synced_text?: string;
    completed: Boolean;
}

export const todoItemsState = atom({
    key: "todos/items",
    default: []
});

export const activeTodoState = atom<TodoItem>({
    key: "todos/activeItem",
    default: {
        text: "",
        completed: false
    }
});