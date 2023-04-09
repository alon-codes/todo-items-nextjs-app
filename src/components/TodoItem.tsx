import { activeTodoState, allTodosState, TodoItem } from "@/state/todos"
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { CalendarTodayOutlined, DeleteForeverOutlined, UndoOutlined } from "@mui/icons-material";
import { ListItemText, Typography, Stack, IconButton, Button, Box, Card, CardContent, CardActions, Checkbox, Grid, FormControlLabel } from "@mui/material";
import { deleteTodo, updateTodo } from "@/pages/api";
import TaskAltSharpIcon from '@mui/icons-material/TaskAltSharp';
import { useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { amber, blue, blueGrey, green, grey, indigo, orange, pink, red, yellow } from "@mui/material/colors";
import CreateIconOutlined from "@mui/icons-material/Create";
import HistoryIcon from '@mui/icons-material/History';
import { format, formatDistance, parseISO } from "date-fns";

enum DragTypes {
    todo = 'todo'
}

interface TodoItemProps {
    index: number;
    item: TodoItem;
    moveTodo: (a: number, b: number) => void
}

const colors = [
    red, yellow, green, blue, indigo, amber, pink, orange
  ]

export default function TodoListItem({ item, index, moveTodo }: TodoItemProps) {
    const ref = useRef(null)
    const [items, setItems] = useRecoilState(allTodosState);
    const setActiveTodo = useSetRecoilState(activeTodoState);
    const { id } = item;

    // @ts-ignore
    const [{ handlerId }, drop] = useDrop({
        accept: DragTypes.todo,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        // @ts-ignore
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
            // @ts-ignore
            moveTodo(dragIndex, hoverIndex);
        },
    })
    const [{ isDragging }, drag] = useDrag({
        type: DragTypes.todo,
        item: () => {
            return { id, index }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
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

    console.log({ colors });

    const created_at_str = formatDistance(parseISO(item?.created_at), new Date(), { includeSeconds: true, addSuffix: true });
    const updated_at_str = formatDistance(parseISO(item?.last_updated), new Date(), { includeSeconds: true, addSuffix: true })
    
    const cur_color = colors[item.order % colors.length][50];
    const cur_color_btn = colors[item.order % colors.length][100];
    const cur_border_btn = colors[item.order % colors.length][200];
    
    return (
        <Grid padding={2} ref={ref} item md={4} sm={6} xs={12} data-handler-id={handlerId}>
            <Card sx={{ borderRadius: '10px', backgroundColor: !isDragging ? cur_color : '#fff', minHeight: "180px", width: "100%", marginTop: 0, marginBottom: 3, marginRight: 3, cursor: "grabbing" }} >
                <CardContent>
                    <Stack alignItems="flex-start" alignContent="center" direction="row">
                        <Stack direction="row" justifyItems="center" alignItems="center">
                            <DragIndicatorIcon />
                            <FormControlLabel sx={{ textDecoration: !!item.completed ? "line-through" : "initial" }} control={<Checkbox onChange={e => toggleDone(item)} checked={!!item.completed} />} label="" />
                            
                        </Stack>
                        <Typography sx={{ paddingTop: 1, textDecoration: !!item.completed ? "line-through" : undefined}} paragraph>{item.text}</Typography>
                    </Stack>
                    
                    <Stack justifyContent="center" spacing={1} padding={1} width={"100%"} columnGap={1} paddingY={1} marginTop={2} direction="column">
                        <Stack spacing={1} direction="row">
                            <CalendarTodayOutlined />
                            <Typography variant="caption" sx={{ textDecoration: !!item.completed ? "line-through" : "initial" }}>{created_at_str}</Typography>
                        </Stack>
                        <Stack spacing={1} direction="row">
                            <HistoryIcon />
                            <Typography variant="caption" sx={{ textDecoration: !!item.completed ? "line-through" : "initial" }}>{updated_at_str}</Typography>
                        </Stack>
                        <Stack paddingY={1} paddingX={1} justifyContent="space-between" direction="row">
                            <Button
                                variant="outlined"
                                onClick={e => toggleDone(item)}
                                color="inherit"
                                sx={{ backgroundColor: cur_color_btn }}
                                startIcon={!item.completed ? <TaskAltSharpIcon /> : <UndoOutlined />}>
                                {item.completed !== true ? "Done" : "Undo"}
                                </Button>
                            <Button
                                variant="outlined"
                                color="inherit"
                                sx={{ backgroundColor: cur_color_btn }}
                                onClick={e => setActiveTodo({ ...item, synced_text: item.text })}
                                startIcon={<CreateIconOutlined />}>
                                Edit
                            </Button>

                            <Button
                                variant="outlined"
                                color="inherit"
                                sx={{ backgroundColor: cur_color_btn }}
                                onClick={async e => {
                                    await deleteTodo(item.id);
                                    setItems([...items.filter(i => i.id !== item.id)])
                                }}
                                startIcon={<DeleteForeverOutlined color="error" />}>
                                Delete
                            </Button>
                            
                        
                    </Stack>
                    </Stack>
                    
                </CardContent>
            </Card>
        </Grid>
    )
}