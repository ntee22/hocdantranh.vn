import React from 'react';
import PropTypes from 'prop-types';
import './StatusBadge.css';

/**
 * StatusBadge component for displaying student status
 * 
 * @param {Object} props
 * @param {string} props.status - Status: 'critical', 'warning', or 'normal'
 * @param {string} props.label - Optional custom label (defaults to status-based label)
 * @param {string} props.reason - Optional reason for the status (shown on hover)
 */
const StatusBadge = ({ status, label, reason }) => {
  const getLabel = () => {
    if (label) return label;
    
    const labels = {
      critical: 'Cần chú ý',
      warning: 'Cảnh báo',
      normal: 'Bình thường'
    };
    return labels[status] || 'Bình thường';
  };

  const tooltipText = reason || getLabel();

  return (
    <span 
      className={`status-badge status-badge-${status}`}
      title={tooltipText}
    >
      {getLabel()}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.oneOf(['critical', 'warning', 'normal']).isRequired,
  label: PropTypes.string,
  reason: PropTypes.string,
};

export default StatusBadge;
