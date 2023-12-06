import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

const API = import.meta.env.VITE_API_URL || ''

export type Todo = {
  id: number|string
  title: string
}

export type TodoCreateDto = {
  title: Todo['title']
}

export type UseTodoOptions = {
  addMutation?: {
    onError?: (error: string) => void
  }
}

const todoApi = {
  findTodos: (): Promise<Todo[]> => 
    axios.get(`${API}/todos`).then(res => res.data),
  addTodo: (body: TodoCreateDto): Promise<Todo> => 
    axios.post(`${API}/todos`, body).then(res => res.data),
  deleteTodo: (id: Todo['id']): Promise<Todo> => 
    axios.delete(`${API}/todos/${id}`).then(res => res.data),
}

export const useTodo = (options?: UseTodoOptions) => {
  const queryKey = ['todos']
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey,
    queryFn: todoApi.findTodos,
  })
  const todos = query.data ?? []

  const addMutation = useMutation({
    mutationFn: todoApi.addTodo,
    onSuccess: (data) => {
      queryClient.setQueriesData({ 
        queryKey 
      }, [...todos, data])
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError(error: AxiosError<any, any>) {
      console.error(error.response?.data)
      options?.addMutation?.onError && options?.addMutation?.onError(error.response?.data?.message.join(''))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: todoApi.deleteTodo,
    onSuccess: (data) => {
      queryClient.setQueriesData({ 
        queryKey 
      }, todos.filter(item => item.id !== data.id))
    },
  })

  return {
    todos,
    query,
    addMutation,
    deleteMutation,
  }
}
