import React from 'react';
import styled from '@emotion/styled';

interface DiaryItemProps {
  text: string;
  date?: string;
  mood?: string;
  image?: string;
  musicLink?: string;
}

const ItemContainer = styled.div`
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DiaryItem: React.FC<DiaryItemProps> = ({ text, date, mood, image, musicLink }) => {
  return (
    <ItemContainer>
      {date && <p>Date: {date}</p>}
      <div>{text}</div>
      {mood && <p>Mood: {mood}</p>}
      {image && <img src={image} alt="Diary" style={{ maxWidth: '100%', marginTop: '1rem' }} />}
      {musicLink && (
        <div style={{ marginTop: '1rem' }}>
          <a href={musicLink} target="_blank" rel="noopener noreferrer">
            🎵 Listen to Music
          </a>
        </div>
      )}
    </ItemContainer>
  );
};

export default DiaryItem; 