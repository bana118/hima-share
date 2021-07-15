import React, { useState, useRef } from "react";
import { Button, Form, Overlay, Tooltip } from "react-bootstrap";

type EventMessageProps = {
  dateText: string;
  freeChatIds: string[];
  unEnteredChatIds: string[];
  invitationId?: string;
};

export const EventMessage = ({
  dateText,
  freeChatIds,
  unEnteredChatIds,
  invitationId,
}: EventMessageProps): JSX.Element => {
  const eventMessageInputRef = useRef(null);

  const appUrl = typeof window !== "undefined" ? document.location.origin : "";
  const invitationUrl =
    invitationId == null ? appUrl : `${appUrl}/join/${invitationId}`;
  const appLinkMessage = `- Hima Share(β) あなたの暇な日をシェアしよう ${invitationUrl}`;
  // TODO グループ設定で変更可能にする
  const eventMessage = `${dateText}に一緒に〇〇しませんか？ ${appLinkMessage}`;
  const initFullMessage =
    freeChatIds.length == 0
      ? `${eventMessage}`
      : `${freeChatIds.join(" ")} ${eventMessage}`;

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
      const freeChatIdsMessage =
        freeChatIds.length == 0 ? "" : `${freeChatIds.join(" ")} `;
      const unEnteredChatIdsMessage =
        unEnteredChatIds.length == 0 ? "" : `${unEnteredChatIds.join(" ")} `;
      const message = `${freeChatIdsMessage}${unEnteredChatIdsMessage}${eventMessage}`;
      setFullMessage(message);
    } else {
      const message =
        freeChatIds.length == 0
          ? `${eventMessage}`
          : `${freeChatIds.join(" ")} ${eventMessage}`;
      setFullMessage(message);
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
      <textarea
        id="hima-share-event-message"
        rows={5}
        ref={eventMessageInputRef}
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
