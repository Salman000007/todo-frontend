import api from '../api/axios';

export const fetchTodos = async () => {
  const { data } = await api.get('/todos');
  return data;
};

export const createTodo = async todo => {
  const { data } = await api.post('/todos', todo);
  return data;
};

export const updateTodo = async (id, updatedTodo) => {
  const { data } = await api.put(`/todos/${id}`, updatedTodo);
  return data;
};

export const deleteTodo = async id => {
  await api.delete(`/todos/${id}`);
};
