import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || ''

export type Todo = {
  id: number|string
  title: string
}

export type TodoCreateDto = {
  title: Todo['title']
}

const todoApi = {
  findTodos: (): Promise<Todo[]> => 
    axios.get(`${API}/todos`).then(res => res.data),
  addTodo: (body: TodoCreateDto): Promise<Todo> => 
    axios.post(`${API}/todos`, body).then(res => res.data),
  deleteTodo: (id: Todo['id']): Promise<Todo> => 
    axios.delete(`${API}/todos/${id}`).then(res => res.data),
}

export const useTodo = () => {
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
