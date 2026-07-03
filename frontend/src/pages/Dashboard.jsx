import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [newEmoji, setNewEmoji] = useState('🛒')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/categories', {
        headers: { authorization: `Bearer ${token}` }
      })
      setCategories(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const addCategory = async () => {
    if (!newCategory) return
    try {
      await axios.post('http://localhost:8000/api/categories',
        { name: newCategory, emoji: newEmoji },
        { headers: { authorization: `Bearer ${token}` } }
      )
      setNewCategory('')
      fetchCategories()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/categories/${id}`, {
        headers: { authorization: `Bearer ${token}` }
      })
      fetchCategories()
    } catch (err) {
      console.error(err)
    }
  }

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-bold">🛒 GroceryMate</h1>
        <button onClick={logout} className="text-sm bg-blue-700 px-3 py-1 rounded-lg">Logout</button>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">My Lists</h2>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Emoji"
            value={newEmoji}
            onChange={(e) => setNewEmoji(e.target.value)}
            className="w-16 border border-gray-300 rounded-lg px-2 py-2 text-center"
          />
          <input
            type="text"
            placeholder="Category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
          />
          <button
            onClick={addCategory}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
          >+</button>
        </div>

        {categories.map(cat => (
          <div
            key={cat.id}
            className="bg-white rounded-xl shadow-sm p-4 mb-3 flex items-center gap-3 cursor-pointer"
          >
            <div
              onClick={() => navigate(`/category/${cat.id}`)}
              className="flex items-center gap-3 flex-1"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="font-medium text-gray-700">{cat.name}</span>
            </div>
            <button
              onClick={() => deleteCategory(cat.id)}
              className="text-red-400 text-sm"
            >🗑</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard