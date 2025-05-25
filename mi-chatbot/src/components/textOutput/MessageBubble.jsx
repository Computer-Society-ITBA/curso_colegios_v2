import colors from "../utils/colorPalette";
import styled from "styled-components";
import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';

const BubbleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin: 10px 0 10px;
`;

const BubbleBase = styled.div`
  color: white;
  padding: 10px 15px;
  display: inline-block;
  max-width: 70%;
  word-wrap: break-word;
  border-radius: 15px;
`;

const StyledSenderBubble = styled(BubbleBase)`
  color: ${colors.textPrimary};
  background-color: ${colors.primaryButton};
  border-radius: 15px 15px 0 15px;
  margin-left: auto;
  margin-right: 15px;
`;

const StyledReceiverBubble = styled(BubbleBase)`
  background-color: ${colors.secondaryColor};
  color: ${colors.textPrimary};
  border-radius: 15px 15px 15px 0;
  padding: 10px 15px;
  display: inline-block;
  max-width: 70%;
  margin-right: auto;
  margin-left: 15px;
  word-wrap: break-word;
  p, ul, ol, code, pre {
    margin: 0;
    color: inherit;
    font-family: inherit;
  }
  img {
    max-width: 400px;
    border-radius: 15px;
  }
  pre {
    background-color: rgba(255, 255, 255, 0.3);
    padding: 5px;
    border-radius: 8px;
    position: relative;
    z-index: 1;
  }
  code {
    background-color: rgba(255, 255, 255, 0.3);
    padding: 2px 4px;
    border-radius: 4px;
    color: ${colors.textSecondary};
    font-family: 'Courier New', Courier, monospace;
    position: relative;
    z-index: 2;
  }
`;

const SenderBubble = memo((props) => {
  return <StyledSenderBubble {...props} />;
});

const ReceiverBubble = memo(({ content, handleLoad, responseType }) => {
  const renderContent = () => {
    if (responseType === 'IMAGE') {
      return <img src={content} onLoad={handleLoad} alt="Response" />;
    }

    else if (responseType === 'TEXT') {
        return (
        <ReactMarkdown components={{ p: 'span', h1: 'strong', img: 'img' }}>
          {content}
        </ReactMarkdown>
        );
    }
    else if (responseType === 'AUDIO') {
      return (
        <audio controls>
          <source src={content} type="audio/ogg" />
          El browser no soporta el formato de audio!
        </audio>
      );
    }
    return null;
  };

    return <StyledReceiverBubble>{renderContent()}</StyledReceiverBubble>;
});

export {BubbleContainer, SenderBubble, ReceiverBubble}

