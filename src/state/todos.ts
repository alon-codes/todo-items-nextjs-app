"use client"
import { atom, selector } from "recoil";

export interface TodoItem {
    id: string;
    last_updated?: string;
    created_at?: string;
    text: string;
    synced_text?: string;
    completed: Boolean;
    order: number;
    index?: number;
    color?: number;
}

export const todoItemsState = atom({
    key: "todos/items",
    default: []
});

export const activeTodoState = atom<TodoItem>({
    key: "todos/activeItem",
    default: {
        text: "",
        completed: false,
        order: 1,
        id: ""
    }
});

export const allTodosState = atom<Array<TodoItem>>({
    key: "todos/all",
    default: []
})

export const sortedTodosSelector = selector<Array<TodoItem>>({
    key: "todos/sorted",
    get: ({ get }) => {
        return [...get(allTodosState)].sort((a, b) => b.order - a.order)
    }
})