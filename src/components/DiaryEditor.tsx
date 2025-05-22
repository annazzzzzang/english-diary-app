import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { format } from 'date-fns';
import { useDiary } from '../contexts/DiaryContext';
import { checkGrammar } from '../services/grammarCheck';

interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
  image?: string;
  musicLink?: string;
}

const EditorContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const EditorTitle = styled.h2`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 1.8rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: #34495e;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Textarea = styled.textarea`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  min-height: 200px;
  font-size: 16px;
  resize: vertical;
  line-height: 1.6;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const ImagePreview = styled.div<{ hasImage: boolean }>`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  border: 2px dashed ${props => props.hasImage ? '#2ecc71' : '#ddd'};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  background: ${props => props.hasImage ? '#f8f9fa' : '#fff'};
  cursor: pointer;

  &:hover {
    border-color: #3498db;
  }

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const MusicInput = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const Button = styled.button`
  padding: 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background-color: #2980b9;
    transform: translateY(-1px);
  }
`;

const Message = styled.div<{ type: 'success' | 'error' }>`
  padding: 12px;
  border-radius: 8px;
  background-color: ${props => props.type === 'success' ? '#d4edda' : '#f8d7da'};
  color: ${props => props.type === 'success' ? '#155724' : '#721c24'};
  margin-bottom: 1rem;
`;

const GrammarSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const GrammarButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const Correction = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const CorrectionTitle = styled.h4`
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
`;

const ExplanationList = styled.ul`
  margin: 0.5rem 0;
  padding-left: 1.5rem;
  color: #34495e;
`;

const CorrectedText = styled.p`
  color: #27ae60;
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: #f1f8f1;
  border-radius: 4px;
  white-space: pre-wrap;
`;

const ApplyButton = styled.button`
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-top: 0.5rem;

  &:hover {
    background-color: #219a52;
  }
`;

const DiaryEditor: React.FC = () => {
  const { addEntry } = useDiary();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [entry, setEntry] = useState<Partial<DiaryEntry>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    content: '',
    mood: 'happy',
    musicLink: '',
  });
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [grammarResult, setGrammarResult] = useState<{
    correctedText: string;
    explanations: string[];
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!entry.content) {
      setMessage({ text: 'Please write your diary entry', type: 'error' });
      return;
    }

    try {
      addEntry({
        ...entry,
        image: image || undefined,
      } as Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>);
      
      setMessage({ text: 'Diary entry saved successfully!', type: 'success' });
      
      // Reset form
      setEntry({
        date: format(new Date(), 'yyyy-MM-dd'),
        content: '',
        mood: 'happy',
        musicLink: '',
      });
      setImage(null);
      setGrammarResult(null);

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      setMessage({ text: 'Failed to save diary entry', type: 'error' });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleGrammarCheck = async () => {
    if (!entry.content) return;

    setIsChecking(true);
    try {
      const result = await checkGrammar(entry.content);
      setGrammarResult(result);
    } catch (error) {
      setMessage({ 
        text: 'Failed to check grammar. Please make sure your API key is configured correctly.', 
        type: 'error' 
      });
    } finally {
      setIsChecking(false);
    }
  };

  const applyCorrection = () => {
    if (grammarResult) {
      setEntry(prev => ({
        ...prev,
        content: grammarResult.correctedText
      }));
      setGrammarResult(null);
    }
  };

  return (
    <EditorContainer>
      <EditorTitle>📘 My English Diary</EditorTitle>
      {message && (
        <Message type={message.type}>
          {message.text}
        </Message>
      )}
      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>📝 Today's Diary</SectionTitle>
          <Textarea
            name="content"
            placeholder="Write your diary entry here..."
            value={entry.content}
            onChange={e => setEntry(prev => ({ ...prev, content: e.target.value }))}
          />
          <GrammarButton
            type="button"
            onClick={handleGrammarCheck}
            disabled={!entry.content || isChecking}
          >
            {isChecking ? '🔄 Checking...' : '✍️ Check Grammar'}
          </GrammarButton>

          {grammarResult && (
            <GrammarSection>
              <Correction>
                <CorrectionTitle>Grammar Check Results</CorrectionTitle>
                <CorrectedText>{grammarResult.correctedText}</CorrectedText>
                <ExplanationList>
                  {grammarResult.explanations.map((explanation, index) => (
                    <li key={index}>{explanation}</li>
                  ))}
                </ExplanationList>
                <ApplyButton type="button" onClick={applyCorrection}>
                  Apply Corrections
                </ApplyButton>
              </Correction>
            </GrammarSection>
          )}
        </Section>

        <Section>
          <SectionTitle>📸 Upload Photo</SectionTitle>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <ImagePreview hasImage={!!image} onClick={handleImageClick}>
            {image ? (
              <img src={image} alt="Preview" />
            ) : (
              'Click to upload image'
            )}
          </ImagePreview>
        </Section>

        <Section>
          <SectionTitle>🎵 Music Link</SectionTitle>
          <MusicInput
            type="text"
            placeholder="https://open.spotify.com/track/..."
            value={entry.musicLink}
            onChange={e => setEntry(prev => ({ ...prev, musicLink: e.target.value }))}
          />
        </Section>

        <Button type="submit">
          💾 Save Entry
        </Button>
      </Form>
    </EditorContainer>
  );
};

export default DiaryEditor; 