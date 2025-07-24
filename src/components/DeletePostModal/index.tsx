"use client";
import clsx from "clsx";
import { Button } from "../Button";

type DeletePostModalProps = {
  title: string;
  description: React.ReactNode;
  buttonText1: string;
  buttonText2: string;
  isVisible?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  disabled: boolean;
};

export function DeletePostModal({
  title,
  description,
  buttonText1,
  buttonText2,
  isVisible = false,
  onConfirm,
  onCancel,
  disabled = false,
}: DeletePostModalProps) {
  function handleCancel() {
    if (disabled) return;

    onCancel();
  }

  return (
    isVisible && (
      <div
        className={clsx(
          "fixed inset-0 bg-black/70 backdrop-blur-xs",
          "flex items-center justify-center",
          "z-50"
        )}
        onClick={handleCancel}
      >
        <div
          className={clsx(
            "bg-blue-100 max-w-2xl p-6 mx-4 rounded-xl",
            "gap-6 flex flex-col",
            "shadow-lg shadow-black/30"
          )}
          role="dialog"
          aria-modal={true}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 id="modal-title" className="text-xl font-bold">
            {title}
          </h3>
          <p id="modal-description">{description}</p>
          <div className="flex items-center justify-around">
            <Button variant="danger" onClick={onConfirm} disabled={disabled}>
              {buttonText1}
            </Button>
            <Button
              variant="ghost"
              autoFocus
              onClick={handleCancel}
              disabled={disabled}
            >
              {buttonText2}
            </Button>
          </div>
        </div>
      </div>
    )
  );
}
