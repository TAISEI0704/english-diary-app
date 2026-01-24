import { useEffect, useState } from 'react'
import api from './services/api'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState('Loading...')
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/test')
      .then(response => {
        setApiStatus(JSON.stringify(response.data, null, 2))
        setError(null)
      })
      .catch(error => {
        setApiStatus('')
        setError('API Error: ' + error.message)
      })
  }, [])

  return (
    <div className="App">
      <h1>English Diary App</h1>
      <h2>Development Environment Status</h2>
      <div style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
        <h3>API Connection Test:</h3>
        {error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          <pre style={{ background: '#f4f4f4', padding: '15px', borderRadius: '5px' }}>
            {apiStatus}
          </pre>
        )}
        <hr />
        <h3>Environment Details:</h3>
        <ul>
          <li><strong>Frontend:</strong> React 19 + Vite</li>
          <li><strong>Backend:</strong> Laravel 12 + FrankenPHP</li>
          <li><strong>Database:</strong> PostgreSQL 18</li>
          <li><strong>Containerization:</strong> Docker Compose</li>
        </ul>
      </div>
    </div>
  )
}

export default App
