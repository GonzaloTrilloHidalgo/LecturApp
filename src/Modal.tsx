import React from 'react'

interface ModalProps {
  children: React.ReactNode
  onClose: () => void
}

const modalStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0, left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
}

const modalContentStyles: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '10px',
  maxWidth: '500px',
  width: '100%',
  boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div style={modalStyles} onClick={onClose}>
      <div style={modalContentStyles} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export default Modal
