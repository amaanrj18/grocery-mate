import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

function CategoryDetail() {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState('piece')
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/items/${id}`, {
        headers: { authorization: `Bearer ${token}` }
      })
      setItems(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const addItem = async () => {
    if (!newItem) return
    try {
      await axios.post('http://localhost:8000/api/items',
        { name: newItem, quantity, unit, category_id: id },
        { headers: { authorization: `Bearer ${token}` } }
      )
      setNewItem('')
      setQuantity(1)
      fetchItems()
    } catch (err) {
      console.error(err)
    }
  }

  const checkItem = async (itemId) => {
    try {
      await axios.patch(`http://localhost:8000/api/items/${itemId}/check`, {},
        { headers: { authorization: `Bearer ${token}` } }
      )
      fetchItems()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8000/api/items/${itemId}`, {
        headers: { authorization: `Bearer ${token}` }
      })
      fetchItems()
    } catch (err) {
      console.error(err)
    }
  }

  const checkedCount = items.filter(i => i.is_checked).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/dashboard')} className="text-white">←</button>
        <h1 className="text-lg font-bold">Items</h1>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <p className="text-sm text-gray-500 mb-2">{checkedCount} of {items.length} done</p>
        <div className="bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: items.length ? `${(checkedCount / items.length) * 100}%` : '0%' }}
          ></div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <input
            type="text"
            placeholder="Item name"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
          />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-16 border border-gray-300 rounded-lg px-2 py-2 text-center"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-2"
          >
            <option>piece</option>
            <option>kg</option>
            <option>litre</option>
            <option>bunch</option>
          </select>
          <button
            onClick={addItem}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
          >+</button>
        </div>

        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 mb-3 flex items-center gap-3">
            <input
              type="checkbox"
              checked={item.is_checked}
              onChange={() => checkItem(item.id)}
              className="w-5 h-5 accent-blue-600"
            />
            <span className={`flex-1 ${item.is_checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
              {item.name}
            </span>
            <span className="text-sm text-gray-400">{item.quantity} {item.unit}</span>
            <button onClick={() => deleteItem(item.id)} className="text-red-400">🗑</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryDetail