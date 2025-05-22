interface GrammarCheckResult {
  correctedText: string;
  explanations: string[];
}

export async function checkGrammar(text: string): Promise<GrammarCheckResult> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  const prompt = `Please check the following English text for grammar and spelling errors. 
Provide corrections and explanations in the following format:
Corrected text: [The corrected version of the entire text]
Explanations:
- [First correction explanation]
- [Second correction explanation]
etc.

Text to check:
${text}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to check grammar');
    }

    const data = await response.json();
    const result = data.choices[0].message.content;

    // Parse the response
    const correctedTextMatch = result.match(/Corrected text: ([\s\S]*?)(?=\nExplanations:)/);
    const explanationsMatch = result.match(/Explanations:\n([\s\S]*$)/);

    const correctedText = correctedTextMatch ? correctedTextMatch[1].trim() : text;
    const explanations = explanationsMatch
      ? explanationsMatch[1]
          .split('\n')
          .map(line => line.replace(/^-\s*/, ''))
          .filter(line => line.trim())
      : [];

    return {
      correctedText,
      explanations,
    };
  } catch (error) {
    console.error('Grammar check error:', error);
    throw new Error('Failed to check grammar');
  }
} 