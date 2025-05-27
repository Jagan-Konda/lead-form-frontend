import React, { useState } from 'react'
import './App.css'

const API_URL = 'https://lead-form-backend.onrender.com'


const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })

  const [errors, setErrors] = useState({})
  const [showPopup, setShowPopup] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    return newErrors
  }

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        const data = await res.json()

        if (res.ok) {
          setShowPopup(true)
          setFormData({ name: '', email: '', company: '', message: '' })
        } else {
          alert(data.error || 'Submission failed')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Something went wrong. Try again later.')
      }
    }
  }

  const closePopup = () => setShowPopup(false)

  return (
    <>
      <form className="lead-form" onSubmit={handleSubmit}>
        <h2>Contact Us</h2>

        <label>Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error">{errors.name}</span>}

        <label>Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <label>Company</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
        />

        <label>Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
      </form>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
            <p>Your response has been successfully submitted.</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </>
  )
}



export default App;
