import React from 'react';
import { HiAnnotation } from 'react-icons/hi';

function MyNotesEmptyState({ title, description }) {
  return (
    <div className="my-notes-empty">
      <HiAnnotation />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export default MyNotesEmptyState;
