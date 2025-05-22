import React, { useState } from 'react';
import styled from '@emotion/styled';
import { format, parseISO } from 'date-fns';
import { useDiary } from '../contexts/DiaryContext';

const ListContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 20px;
`;

const ListTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const EntryCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const Date = styled.span`
  color: #7f8c8d;
  font-size: 1rem;
  font-weight: 500;
`;

const Content = styled.p`
  color: #34495e;
  line-height: 1.8;
  margin: 15px 0;
  white-space: pre-wrap;
  font-size: 1.1rem;
`;

const ImageContainer = styled.div`
  margin: 15px 0;
  border-radius: 8px;
  overflow: hidden;
  
  img {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
  }
`;

const MusicPreview = styled.div`
  margin: 15px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  
  a {
    color: #3498db;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const DeleteButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: #c0392b;
    transform: translateY(-1px);
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #7f8c8d;
  font-size: 1.2rem;
  margin-top: 3rem;
  line-height: 1.6;
`;

const DiaryList: React.FC = () => {
  const { entries, deleteEntry } = useDiary();
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (showConfirmDelete === id) {
      deleteEntry(id);
      setShowConfirmDelete(null);
    } else {
      setShowConfirmDelete(id);
    }
  };

  if (entries.length === 0) {
    return (
      <ListContainer>
        <EmptyMessage>
          No diary entries yet. Start writing your first entry! ✍️
        </EmptyMessage>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      <ListTitle>📂 My Diary Entries</ListTitle>
      {entries.map(entry => (
        <EntryCard key={entry.id}>
          <EntryHeader>
            <Date>{format(parseISO(entry.date), 'MMMM d, yyyy')}</Date>
            <DeleteButton
              onClick={() => handleDelete(entry.id)}
              style={{
                backgroundColor: showConfirmDelete === entry.id ? '#c0392b' : '#e74c3c'
              }}
            >
              {showConfirmDelete === entry.id ? 'Click again to confirm' : '🗑️ Delete'}
            </DeleteButton>
          </EntryHeader>
          
          <Content>{entry.content}</Content>
          
          {entry.image && (
            <ImageContainer>
              <img src={entry.image} alt="Diary" />
            </ImageContainer>
          )}
          
          {entry.musicLink && (
            <MusicPreview>
              🎵 <a href={entry.musicLink} target="_blank" rel="noopener noreferrer">
                Listen to attached music
              </a>
            </MusicPreview>
          )}
        </EntryCard>
      ))}
    </ListContainer>
  );
};

export default DiaryList; 