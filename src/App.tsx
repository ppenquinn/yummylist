import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
    Button, ChipDelete, CircularProgress, CssBaseline, FormControl, IconButton, Input, List,
    ListItem, Sheet, Tooltip, Typography
} from '@mui/joy';

import { Todo, useTodo } from './todos';

type TodoItemProps = {
  text: string
  onDelete?: () => void
}

type TodoFormInput = {
  title: string
}

type DeleteTodoButtonProps = {
  onClick?: () => void
}

const DeleteTodoButton: FC<DeleteTodoButtonProps> = ({ onClick }) => (
  <Tooltip title="delete">
    <IconButton onClick={onClick}><ChipDelete /></IconButton>
  </Tooltip>
)

const TodoItem: FC<TodoItemProps> = ({ text, onDelete }) => (
  <ListItem endAction={<DeleteTodoButton onClick={onDelete} />}>
    {text}
  </ListItem>
)

function App() {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: ''
    }
  })

  const todo = useTodo()
  const todos = todo.query.data ?? []
  const {
    isPending,
  } = todo.query

  function addTodo(data: TodoFormInput): void {
    const { title } = data 

    todo.addMutation.mutate({ title })
    reset()
  }

  function deleteTodo(id: Todo['id']): void {
    todo.deleteMutation.mutate(id)
  }

  return (
    <CssBaseline>
      <main>
        <Sheet sx={{
          width: 300,
          mx: 'auto',
          my: 4,
          py: 3,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 'sm',
          boxShadow: 'md',
        }}>
          <Typography level='h4' component='h1'>Yummy List</Typography>
          <form onSubmit={handleSubmit(addTodo)}>
            <FormControl error={todo.addMutation.isError} disabled={todo.addMutation.isPending}>
              <Controller 
                name='title'
                control={control}
                render={({ field }) => (
                  <Input 
                    {...field}
                    type="text" 
                    placeholder='Enter yummy food' 
                    endDecorator={
                      <>
                        {!todo.addMutation.isPending && <Button variant='soft' type='submit'>Add</Button>}
                        {todo.addMutation.isPending && <IconButton disabled><CircularProgress /></IconButton>}
                      </>
                    }
                    />
                )}
                />
            </FormControl>
          </form>
          <Sheet 
            variant='outlined' 
            sx={{ borderRadius: 'sm', overflow: 'auto', maxHeight: 300 }}
          >
            {isPending && (
              <Sheet sx={{ textAlign: 'center', p: '1em', color: 'GrayText' }}>
                <CircularProgress />
              </Sheet>
            )}
            {!isPending && todos.length <= 0 && (
              <Sheet sx={{ textAlign: 'center', p: '1em', color: 'GrayText' }}>
                Empty tummy
              </Sheet>
              )}
            {!isPending && todos.length > 0 && (
              <List>
                {todos.map(todo => (
                  <TodoItem 
                    key={todo.id}
                    text={todo.title}
                    onDelete={() => deleteTodo(todo.id)}
                  />
                ))}
              </List>
              )}
          </Sheet>
        </Sheet>
      </main>
    </CssBaseline>
  )
}

export default App
