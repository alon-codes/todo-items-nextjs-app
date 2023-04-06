import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google';
import { Container } from '@mui/system'
import { Button, Grid, List, ListItem, ListItemButton, ListItemText, Stack, TextField, useTheme } from '@mui/material'
import { useState } from 'react';
import { CreateOutlined } from '@mui/icons-material';
import { activeTodoState, TodoItem, todoItemsState } from '@/state/todos';
import { useRecoilState } from 'recoil';
import axios from 'axios';

const inter = Inter({ subsets: ['latin'] })

// Active todo item - TodoItem

export default function Home() {
  const [items, setItems] = useState<Array<TodoItem>>([]);
  const [activeTodo, setActiveTodo] = useRecoilState(activeTodoState);

  const theme = useTheme();

  const discard = () => {
    // Restores last synced state
    setActiveTodo({ ...activeTodo, text: activeTodo.text });
  }

  return (
    <>
      <Head>
        <title>TODO List</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container fixed>
        <Grid container>
          <Grid justifyItems="center" justifyContent="center" item md={4} xs={12}>
            <Stack direction="column" sx={{ padding: theme.spacing(2) }}>
              <TextField onChange={e => setActiveTodo({ ...activeTodo, text: e.currentTarget.value })} minRows={5} maxRows={20} multiline variant="filled" fullWidth label="Write down you task" />
              <Stack justifyContent="space-around" alignContent="space-evenly" direction="row">
                <Button disabled={!activeTodo.text.length} variant="text">Save</Button>
                <Button onClick={e => setItems([...items, { ...activeTodo }])} disabled={!activeTodo?.synced_text || activeTodo?.synced_text !== activeTodo?.text} variant="text">Discard changes</Button>
              </Stack>
            </Stack>
          </Grid>
          <Grid justifyItems="center" justifyContent="center" item md={8} xs={12}>
            <List>
              {items.map((cur_todo_item, index) => (
                <ListItem key={index}>
                  <ListItemText>{cur_todo_item.text}</ListItemText>
                  <ListItemButton>
                    <Button>
                      <CreateOutlined />
                    </Button>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
