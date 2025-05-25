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
    const conversationRef = useRef(null);
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (inputValue.trim()) {
        setMessages([...messages, { text: inputValue, isSender: true }]);
        setInputValue("");
        try {
            const response = await axios.post('http://localhost:3001/chat', {
                ID: (RESPONSE_ID).toString(),
                personality: 'Default personality',
                message: inputValue
            });
            const { responseType, content } = response.data;
            setMessages(prevMessages => [...prevMessages, { text: content, isSender: false, responseType: responseType }]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
      }
    };
    useEffect(() => {
        if (conversationRef.current) {
          conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
        }
      }, [messages]);

    return(
        <MainBody>
            <Header>Hola mundo</Header>
            <ConversationCard ref={conversationRef}>
                {messages.length === 0 ? (
                    <p>No messages yet.</p>
                ) : (
                    messages.map((msg, index) => (
                        <BubbleContainer key={index}>
                            {msg.isSender ? ( <SenderBubble>{msg.text}</SenderBubble> ): ( <ReceiverBubble>{msg.text}</ReceiverBubble>)}
                        </BubbleContainer>
                    ))
                )}
            </ConversationCard>
            <FormContainer onSubmit={handleSubmit}>
                <InputField
                    type="text"
                    placeholder="Enter your text here"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <SubmitButton type="submit">Submit</SubmitButton>
            </FormContainer>
        </MainBody>
    );
};

export default Example;
