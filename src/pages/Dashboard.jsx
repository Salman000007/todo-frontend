import { useEffect, useState } from "react";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../services/todoService";
import { logout } from "../services/authService";
import Loader from "../components/Loader";

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTodoData();
  }, []);
  const fetchTodoData = () => {
    fetchTodos()
      .then((data) => setTodos(data.data))
      .finally(() => setLoading(false));
  };

  const filteredTodos = todos.filter((todo) => {
    if (statusFilter === "all") return true;
    return todo.status === statusFilter;
  });

  const handleSubmit = async () => {
    if (isEditing) {
      const res = await updateTodo(editId, {
        title,
        description,
        dueDate,
      });
      const updated = res.data;
      setTodos((prev) => prev.map((t) => (t._id === editId ? updated : t)));
    } else {
      const res = await createTodo({
        title,
        description,
        dueDate,
        status: "pending",
      });
      const newTodo = res.data;
      console.log("newTodo", newTodo);
      setTodos((prev) => [...prev, newTodo]);
    }

    // Reset form
    setTitle("");
    setDescription("");
    setDueDate("");
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
  };

  const handleEditClick = (todo) => {
    setIsEditing(true);
    setEditId(todo._id);
    setTitle(todo.title);
    setDescription(todo.description);
    setDueDate(todo.dueDate?.slice(0, 16));
    setShowForm(true);
  };

  const handleMarkCompleted = async (id) => {
    const res = await updateTodo(id, { status: "completed" });
    const updated = res.data;
    setTodos(todos.map((t) => (t._id === id ? updated : t)));
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
    setTodos(todos.filter((t) => t._id !== id));
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  if (loading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...Array(6)].map((_, index) => (
          <Loader key={index} />
        ))}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6 w-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="mb-6">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setIsEditing(false);
            setTitle("");
            setDescription("");
            setDueDate("");
          }}
          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
        >
          {showForm ? "Cancel" : "Add New Todo"}
        </button>
      </div>

      {/* Filter Section */}
      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              {isEditing ? "Edit Todo" : "Add a New Todo"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              >
                {isEditing ? "Update Todo" : "Add Todo"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setIsEditing(false);
                  setEditId(null);
                }}
                className="w-full mt-4 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
       {/* Card*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredTodos?.map((todo) => (
          <div
            key={todo?._id}
            className="bg-gray-100 w-96 shadow-md rounded-lg p-6 flex flex-col space-y-4 border border-gray-200 hover:border-primary transition-all mb-8"
          >
            <div className="flex-1">
              <h3
                className={`text-xl font-semibold ${
                  todo?.status === "completed"
                    ? "line-through text-gray-500"
                    : "text-gray-900"
                }`}
              >
                {todo?.title}
              </h3>
              <p className="text-gray-700">{todo?.description}</p>
              <p className="text-sm text-gray-500">
                Due: {new Date(todo?.dueDate)?.toLocaleString()}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                  todo?.status === "pending"
                    ? "bg-yellow-100 text-yellow-500"
                    : todo?.status === "in-progress"
                    ? "bg-blue-100 text-blue-500"
                    : "bg-green-100 text-green-500"
                }`}
              >
                {todo?.status.charAt(0).toUpperCase() + todo?.status.slice(1)}
              </span>

              {todo?.status !== "completed" && (
                <button
                  onClick={() => handleMarkCompleted(todo._id)}
                  className="text-xs text-green-600 hover:underline"
                >
                  Mark as Completed
                </button>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEditClick(todo)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(todo._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
