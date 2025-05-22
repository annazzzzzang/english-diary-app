import React from 'react';
import DiaryEditor from './components/DiaryEditor';
import DiaryList from './components/DiaryList';
import { DiaryProvider } from './contexts/DiaryContext';
import './App.css';

function App() {
  return (
    <DiaryProvider>
      <div className="App">
        <h1>My English Diary</h1>
        <DiaryEditor />
        <DiaryList />
      </div>
    </DiaryProvider>
  );
}

export default App;
