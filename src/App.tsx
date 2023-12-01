import { Button, ChipDelete, CircularProgress, CssBaseline, FormControl, IconButton, Input, List, ListItem, Sheet, Tooltip, Typography } from '@mui/joy';
import { useForm, Controller } from 'react-hook-form';
import { FC, useState } from 'react';

type Todo = {
  id: number|string
  title: string
}

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

  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, title: 'Dummy' },
    { id: 2, title: 'Yummy' },
    { id: 3, title: 'Gummy' },
    { id: 4, title: 'Tummy' },
  ])

  function addTodo(data: TodoFormInput): void {
    const { title } = data 

    if (title.length <= 0) {
      setError(true)
      return
    }

    const todo: Todo = {
      id: crypto.randomUUID(),
      title,
    }

    setLoading(true)
    setTodos(prev => [...prev, todo])

    setTimeout(() => {
      setError(false)
      setLoading(false)
      reset()
    }, 1000)
  }

  function deleteTodo(id: Todo['id']): void {
    setTodos(prev => prev.filter(item => item.id !== id))
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
            <FormControl error={error} disabled={loading}>
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
                        {!loading && <Button variant='soft' type='submit'>Add</Button>}
                        {loading && <IconButton disabled><CircularProgress /></IconButton>}
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
            {todos.length <= 0 && (
              <Sheet sx={{ textAlign: 'center', p: '1em', color: 'GrayText' }}>
                Empty tummy
              </Sheet>
              )}
            {todos.length > 0 && (
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
