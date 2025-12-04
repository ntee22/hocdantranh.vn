import React from 'react';
import PropTypes from 'prop-types';
import './StatusBadge.css';

/**
 * StatusBadge component for displaying student status
 * 
 * @param {Object} props
 * @param {string} props.status - Status: 'critical', 'warning', or 'normal'
 * @param {string} props.label - Optional custom label (defaults to status-based label)
 */
const StatusBadge = ({ status, label }) => {
  const getLabel = () => {
    if (label) return label;
    
    const labels = {
      critical: 'Cần chú ý',
      warning: 'Cảnh báo',
      normal: 'Bình thường'
    };
    return labels[status] || 'Bình thường';
  };

  return (
    <span className={`status-badge status-badge-${status}`}>
      {getLabel()}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.oneOf(['critical', 'warning', 'normal']).isRequired,
  label: PropTypes.string,
};

export default StatusBadge;
