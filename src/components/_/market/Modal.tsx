"use client";

import Image from "next/image";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  children: React.ReactNode;
};

export type ModalType = {
  open: () => void;
  close: () => void;
};

const Modal = forwardRef<ModalType, ModalProps>(({ children }, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  return createPortal(
    <dialog
      ref={dialogRef}
      className="w-[250px] backdrop:bg-black/50 rounded-[10px] p-3 overflow-hidden"
    >
      <form method="dialog">
        <button className="block ml-auto hover:scale-125">
          <Image
            width={24}
            height={24}
            alt="close icon"
            src="/icons/icon_x_black.svg"
          />
        </button>
      </form>
      <div className="flex flex-col justify-center items-center gap-3 py-4">
        {children}
      </div>
    </dialog>,
    document.getElementById("modal-root") || document.body
  );
});

Modal.displayName = "Modal";

export default Modal;
