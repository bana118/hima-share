import React, { useState, useRef } from "react";
import { Button, Form, Overlay, Tooltip } from "react-bootstrap";

interface EventMessageProps {
  dateText: string;
  freeChatIds: string[];
  unEnteredChatIds: string[];
}

export const EventMessage = ({
  dateText,
  freeChatIds,
  unEnteredChatIds,
}: EventMessageProps): JSX.Element => {
  const eventMessageInputRef = useRef(null);
  // TODO グループ設定で変更可能にする
  const eventMessage = `${dateText}に一緒に〇〇しませんか？`;
  const initFullMessage = `${freeChatIds.join(" ")} ${eventMessage}`;

  const [fullMessage, setFullMessage] = useState(initFullMessage);
  const [showTooltip, setShowTooltip] = useState(false);

  const copyMessage = () => {
    const eventMessageElement = document.getElementById(
      "hima-share-event-message"
    ) as HTMLInputElement;
    if (eventMessageElement != null) {
      eventMessageElement.select();
      document.execCommand("copy");
      setShowTooltip(true);
    }
  };
  const onChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    if (checked) {
      setFullMessage(
        `${freeChatIds.join(" ")} ${unEnteredChatIds.join(" ")} ${eventMessage}`
      );
    } else {
      setFullMessage(`${freeChatIds.join(" ")} ${eventMessage}`);
    }
  };

  return (
    <React.Fragment>
      <p>募集メッセージ</p>
      <Form.Check
        type="checkbox"
        label="未入力の人を含める"
        onChange={onChecked}
      />
      <Button variant="accent" size="sm" onClick={copyMessage}>
        コピー
      </Button>
      <input
        id="hima-share-event-message"
        ref={eventMessageInputRef}
        type="text"
        className="form-control"
        value={fullMessage}
        onChange={(event) => {
          setFullMessage(event.target.value);
        }}
        onBlur={() => {
          setShowTooltip(false);
        }}
      />
      <Overlay
        target={eventMessageInputRef.current}
        show={showTooltip}
        placement="top"
      >
        {(props) => (
          <Tooltip id="event-message-tooltip" {...props}>
            コピーしました！
          </Tooltip>
        )}
      </Overlay>
    </React.Fragment>
  );
};