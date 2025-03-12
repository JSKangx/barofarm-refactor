"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

export type ModalType = {
  open: () => void;
  close: () => void;
};

const Modal = forwardRef(({ children }, ref) => {
  const dialogRef = useRef<HTMLDialogElement | null>();

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
          <img src="/icons/icon_x_black.svg" className="w-6 " />
        </button>
      </form>
      <div className="flex flex-col justify-center items-center gap-3 py-4">
        {children}
      </div>
    </dialog>,
    document.getElementById("modal-root") || document.body
  );
});

export default Modal;
