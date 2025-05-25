import { useState, useRef, useEffect, useCallback } from 'react';
import { VariableSizeList as List } from 'react-window';
import { FormContainer, InputField } from '../components/textInput/textInputForm';
import SubmitButton from '../components/buttons/SubmitButton';
import Header from '../components/body/Header';
import MainBody from '../components/body/MainBody';
import ConversationCard from '../components/textOutput/conversationCard';
import { BubbleContainer, SenderBubble, ReceiverBubble } from '../components/textOutput/MessageBubble';
import axios from 'axios';

const RESPONSE_ID = Math.floor(Math.random()*100000000);

const Example = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [personalityValue, setPersonalityValue] = useState("");
    const listRef = useRef();
    const rowHeights = useRef({});
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (inputValue.trim()) {
        setMessages([...messages, { text: inputValue, isSender: true }]);
        setInputValue("");
        try {
            const response = await axios.post('http://localhost:3001/chat', {
                ID: (RESPONSE_ID).toString(),
                personality: personalityValue === "" ? 'Default Personality' : personalityValue,
                message: inputValue
            });
            const { responseType, content } = response.data;
            setMessages(prevMessages => [...prevMessages, { text: content, isSender: false, responseType: responseType }]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
      }
    };
    const handleTextToSpeech = async (e) => {
      e.preventDefault();
      if (inputValue.trim()) {
        setMessages([...messages, { text: inputValue, isSender: true }]);
        setInputValue("");
        try {
            const response = await axios.post('http://localhost:3001/text-to-speech', {
                ID: (RESPONSE_ID).toString(),
                personality: personalityValue === "" ? 'Default Personality' : personalityValue,
                message: inputValue
            });
            const { responseType, content } = response.data;
            setMessages(prevMessages => [...prevMessages, { text: content, isSender: false, responseType: responseType }]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
      }
    };
    const handleImageLoad = (index) => {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[index].imageLoaded = true;
        return updatedMessages;
      });
    };

    const getRowHeight = useCallback((index) => {
        return rowHeights.current[index] ? rowHeights.current[index] + 20 : 100;
    }, []);

    const Row = ({ index, style }) => {
        const msg = messages[index];
        const rowRef = useRef();
        useEffect(() => {
            if (rowRef.current) {
                const height = rowRef.current.getBoundingClientRect().height;
                rowHeights.current[index] = height;
                listRef.current.resetAfterIndex(index);
            }
        }, [index, msg, msg.imageLoaded]);
        return (
            <div style={style}>
                <div ref={rowRef}>
                    <BubbleContainer key={index}>
                        {msg.isSender ? (
                            <SenderBubble>{msg.text}</SenderBubble>
                        ) : (
                            <ReceiverBubble content={msg.text} responseType={msg.responseType} handleLoad={() => handleImageLoad(index)}/>
                        )}
                    </BubbleContainer>
                </div>
            </div>
        );
    };

    return(
        <MainBody>
            <Header>Hola mundo</Header>
            <InputField
                type="text"
                placeholder="¿Qué personalidad tengo?"
                value={personalityValue}
                onChange={(e) => setPersonalityValue(e.target.value)}
            />
            <ConversationCard>
                <List
                    height={700}
                    itemCount={messages.length}
                    itemSize={getRowHeight}
                    width={'100%'}
                    ref={listRef}
                >
                    {Row}
                </List>
            </ConversationCard>
            <FormContainer onSubmit={handleSubmit}>
                <InputField
                    type="text"
                    placeholder="Enter your text here"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <SubmitButton type="submit">Submit</SubmitButton>
                <SubmitButton type="button" onClick={handleTextToSpeech}>¡Text-To-Speech!</SubmitButton>
            </FormContainer>
        </MainBody>
    );
};

export default Example;
