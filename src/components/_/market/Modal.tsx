"use client";

import Image from "next/image";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
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
  const [mounted, setMounted] = useState(false);

  // 컴포넌트가 마운트된 이후에 document 객체에 접근해야 함
  useEffect(() => {
    // 컴포넌트가 마운트될 때 상태를 true로 설정
    setMounted(true);
    // 컴포넌트가 언마운트될 때 상태를 false로 설정
    return () => setMounted(false);
  }, []);

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  if (!mounted) {
    return null;
  }

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
