import colors from "../utils/colorPalette";
import styled from "styled-components";

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

const SenderBubble = styled(BubbleBase)`
  background-color: ${colors.primaryButton};
  border-radius: 15px 15px 0 15px;
  margin-left: auto;
  margin-right: 15px;
`;

const ReceiverBubble = styled(BubbleBase)`
  background-color: ${colors.secondaryColor};
  color: white;
  border-radius: 15px 15px 15px 0;
  padding: 10px 15px;
  display: inline-block;
  max-width: 70%;
  margin-right: auto;
  margin-left: 15px;
  word-wrap: break-word;
`;

export {BubbleContainer, SenderBubble, ReceiverBubble}

