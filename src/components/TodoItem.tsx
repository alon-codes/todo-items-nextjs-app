import { activeTodoState, allTodosState, TodoItem } from "@/state/todos"
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { CalendarTodayOutlined, UndoOutlined } from "@mui/icons-material";
import { ListItemText, Typography, Stack, IconButton, Button, Box, Card, CardContent, CardActions, Checkbox } from "@mui/material";
import { updateTodo } from "@/pages/api";
import TaskAltSharpIcon from '@mui/icons-material/TaskAltSharp';
import { useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { blue, blueGrey, green, grey, yellow } from "@mui/material/colors";
import CreateIconOutlined from "@mui/icons-material/Create";
import HistoryIcon from '@mui/icons-material/History';
import { format, formatDistance, parseISO } from "date-fns";

enum DragTypes {
    todo = 'todo'
}

export default function TodoListItem({ item, index, moveTodo }: { index: number, item: TodoItem, moveTodo: (a: number, b: number) => void }) {
    const ref = useRef(null)
    const [items, setItems] = useRecoilState(allTodosState);
    const setActiveTodo = useSetRecoilState(activeTodoState);
    const { id } = item;

    const [{ handlerId }, drop] = useDrop({
        accept: DragTypes.todo,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        async drop(curItem: TodoItem, monitor) {
            console.log({ item, ref: ref.current, curItem, monitor })
            if (!ref.current) {
                return
            }
            const dragIndex = curItem.index;
            const hoverIndex = index;

            console.log({ dragIndex, hoverIndex });
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }

            moveTodo(dragIndex, hoverIndex);
        },
    })
    const [{ isDragging }, drag] = useDrag({
        type: DragTypes.todo,
        item: () => {
            return { id, index }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })
    const toggleDone = async (cur_item: TodoItem) => {
        try {
            if (!!cur_item.id) {
                const res = await updateTodo(cur_item.id, { ...cur_item, completed: !cur_item.completed });
                const curItemIndex = items.findIndex(t => t.id === cur_item.id);
                if (curItemIndex >= 0) {
                    let prev = [...items];
                    prev[curItemIndex] = { ...res };
                    setItems(prev);
                }
            }
        }
        catch (e) {

        }
    }
    const opacity = isDragging ? 0 : 1
    drag(drop(ref));

    return (

        <Card ref={ref} sx={{ width: "100%", marginTop: 0, marginBottom: 3, marginRight: 3, padding: 3, cursor: "grabbing", backgroundColor: !!isDragging ? grey[200] : blueGrey[50] }} data-handler-id={handlerId}>
            <CardContent>
                <Stack alignItems="center" justifyItems="flex-end" direction="row">
                    <DragIndicatorIcon />
                    <Checkbox onChange={e => toggleDone(item)} checked={!!item.completed} />

                    <ListItemText>
                        <Box fontSize={20} color="ActiveBorder" sx={{ textDecoration: !!item.completed ? "line-through" : "initial" }}>
                            {item.text}
                        </Box>
                    </ListItemText>
                    <Button sx={{ color: item.completed === true ? blueGrey[400] : blue[200] }}
                        onClick={e => toggleDone(item)}
                        startIcon={!item.completed ? <TaskAltSharpIcon /> : <UndoOutlined />}>
                        {item.completed !== true ? "Done" : "Undo"}
                    </Button>
                </Stack>
                <Stack columnGap={1} paddingY={1} justifyItems="center" marginTop={2} alignItems="center" direction="row">
                    <CalendarTodayOutlined />
                    <Typography>{!!item.created_at && formatDistance(parseISO(item?.created_at), new Date(), {includeSeconds: true, addSuffix: true})}</Typography>
                    <HistoryIcon />
                    <Typography>{!!item.last_updated && formatDistance(parseISO(item?.last_updated), new Date(), {includeSeconds: true, addSuffix: true})}</Typography>
                </Stack>
            </CardContent>
            <CardActions>
                <Button
                    onClick={e => setActiveTodo({ ...item, synced_text: item.text })}
                    sx={{ color: blueGrey[600] }}
                    startIcon={<CreateIconOutlined />}>
                    Edit
                </Button>
            </CardActions>
        </Card>
    )
}