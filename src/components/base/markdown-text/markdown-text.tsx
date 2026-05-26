// d:/projects/kai-front/src/components/base/markdown-text/markdown-text.tsx
import React, { JSX } from 'react';

interface MarkdownTextProps {
  text: string;
}

const MarkdownText: React.FC<MarkdownTextProps> = ({ text }) => {
  const renderTextWithMarkdown = (inputText: string) => {
    // Regular expression to find **bold text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    inputText.replace(boldRegex, (match, content, offset) => {
      // Add the text before the current match
      if (offset > lastIndex) {
        parts.push(inputText.substring(lastIndex, offset));
      }
      // Add the bolded content
      parts.push(<strong key={offset}>{content}</strong>);
      lastIndex = offset + match.length;
      return match; // Return match to satisfy replace callback signature
    });

    // Add any remaining text after the last match
    if (lastIndex < inputText.length) {
      parts.push(inputText.substring(lastIndex));
    }

    return <>{parts}</>;
  };

  return <div>{renderTextWithMarkdown(text)}</div>;
};

export default MarkdownText;