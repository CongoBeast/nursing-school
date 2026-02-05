import React from 'react';
import { CheckCircle } from 'lucide-react';

const ThankYouPage = () => {
  const colors = {
    primary: '#F0F7FF',
    secondary: '#DBEAFE',
    tertiary: '#3B82F6',
    accent: '#1E3A8A'
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      backgroundColor: colors.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 10px 40px rgba(30, 58, 138, 0.15)',
      padding: '60px 40px',
      maxWidth: '600px',
      width: '100%',
      textAlign: 'center'
    },
    iconContainer: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      backgroundColor: '#D1FAE5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 30px'
    },
    title: {
      color: colors.accent,
      fontSize: '2.5rem',
      fontWeight: '800',
      marginBottom: '20px'
    },
    message: {
      color: '#6B7280',
      fontSize: '1.1rem',
      lineHeight: '1.8',
      marginBottom: '30px'
    },
    warning: {
      backgroundColor: '#FEF3C7',
      border: '2px solid #F59E0B',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '30px'
    },
    warningText: {
      color: '#92400E',
      fontWeight: '600',
      fontSize: '1rem',
      margin: 0
    },
    closeButton: {
      backgroundColor: colors.accent,
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '15px 40px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)'
    }
  };

  const handleClose = () => {
    window.close();
    // Fallback if window.close() doesn't work (some browsers block it)
    setTimeout(() => {
      window.location.href = 'about:blank';
    }, 100);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <CheckCircle size={60} color="#10B981" strokeWidth={2.5} />
        </div>

        <h1 style={styles.title}>Thank You for Signing Up!</h1>

        <p style={styles.message}>
          Your account has been successfully created. Welcome to the Dormitory Management System!
        </p>

        <div style={styles.warning}>
          <p style={styles.warningText}>
            ⚠️ Important: Please save your password in a secure location before closing this page.
          </p>
        </div>

        <p style={{ ...styles.message, fontSize: '0.95rem', marginBottom: '40px' }}>
          You can now close this page and log in to your account using your credentials.
        </p>

        <button 
          style={styles.closeButton}
          onClick={handleClose}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#2563EB';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(30, 58, 138, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = colors.accent;
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(30, 58, 138, 0.2)';
          }}
        >
          Close Page
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;