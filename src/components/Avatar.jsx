import React from 'react';

const COLORS = [
  '#007AFF', '#FF3B30', '#34C759', '#FF9500', '#AF52DE',
  '#FF2D55', '#5856D6', '#00C7BE', '#FF6482', '#30B0C7'
];

function getColor(name) {
  if (!name) return COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
}

export default function Avatar({ name, size = 'md', style = {} }) {
  const sizeClass = size === 'sm' ? 'avatar-sm' : size === 'lg' ? 'avatar-lg' : size === 'xl' ? 'avatar-xl' : '';

  return (
    <div
      className={`avatar ${sizeClass}`}
      style={{ backgroundColor: getColor(name), ...style }}
    >
      {getInitials(name)}
    </div>
  );
}
