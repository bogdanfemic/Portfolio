import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

const TypingSpan = styled.span`
  display: inline-block;
  border-right: 3px solid ${props => props.theme.colors.primary};
  padding-right: 5px;
  animation: blink 0.7s infinite;
  
  @keyframes blink {
    0%, 100% { border-color: transparent; }
    50% { border-color: ${props => props.theme.colors.primary}; }
  }
`;

interface TypingEffectProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
}

const TypingEffect: React.FC<TypingEffectProps> = ({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenWords = 1000
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  // Use refs instead of state for timeouts to avoid re-renders
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use a ref to track if the component is mounted
  const isMounted = useRef(true);
  
  useEffect(() => {
    // Set isMounted to false when component unmounts
    return () => {
      isMounted.current = false;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    // Skip if no words are provided
    if (!words || words.length === 0) return;
    
    const currentWord = words[wordIndex];
    
    // Handle typing and deleting
    const handleTyping = () => {
      if (!isMounted.current) return;
      
      // Get the current word
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        // Deleting text
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        
        // If all text is deleted, start typing the next word
        if (displayText.length <= 1) {
          setIsDeleting(false);
          setWordIndex((wordIndex + 1) % words.length);
          
          // Delay before typing the next word
          typingTimeoutRef.current = setTimeout(handleTyping, delayBetweenWords);
          return;
        }
      } else {
        // Typing text
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        
        // If the word is complete, start deleting after a delay
        if (displayText.length === currentWord.length) {
          typingTimeoutRef.current = setTimeout(() => {
            if (isMounted.current) {
              setIsDeleting(true);
              handleTyping();
            }
          }, delayBetweenWords);
          return;
        }
      }
      
      // Schedule the next update
      typingTimeoutRef.current = setTimeout(
        handleTyping,
        isDeleting ? deletingSpeed : typingSpeed
      );
    };
    
    // Start the typing effect
    typingTimeoutRef.current = setTimeout(handleTyping, typingSpeed);
    
    // Clean up timeout on re-render
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [displayText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, delayBetweenWords]);
  
  return <TypingSpan>{displayText}</TypingSpan>;
};

export default TypingEffect;
