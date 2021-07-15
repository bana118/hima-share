import React from "react";
import { Modal, Button } from "react-bootstrap";

type ConfirmModalProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  headerText: string;
  bodyText: string;
  confirmButtonText: string;
  onClickConfirmButton: () => void;
};

export const ConfirmModal = ({
  show,
  setShow,
  headerText,
  bodyText,
  confirmButtonText,
  onClickConfirmButton,
}: ConfirmModalProps): JSX.Element => {
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{headerText}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{bodyText}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          キャンセル
        </Button>
        <Button variant="main" onClick={onClickConfirmButton}>
          {confirmButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
