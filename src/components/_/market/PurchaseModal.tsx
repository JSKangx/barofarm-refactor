"use client";

import {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { createPortal } from "react-dom";

// props 타입 정의
type PurchaseModalProps = {
  children: React.ReactNode;
};

export type PurchaseModalType = {
  open: () => void;
  close: () => void;
};

// forwardRef<Ref 타입, props 타입>
const PurchaseModal = forwardRef<PurchaseModalType, PurchaseModalProps>(
  ({ children }, ref) => {
    // 모달 보이기 상태 관리
    const [isVisible, setIsVisible] = useState(false);
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    // 컴포넌트가 마운트된 이후에 Portal 생성하기
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    // showModal은 dialog 태그 안에 내장된 메서드
    const open = () => {
      setIsVisible(true);
      dialogRef.current?.showModal();
    };

    // open은 dialog 태그 안에 내장된 메서드
    const close = () => {
      setIsVisible(false);
      dialogRef.current?.close();
    };

    useImperativeHandle(ref, () => ({
      open,
      close,
    }));

    return (
      <>
        {mounted &&
          isVisible &&
          createPortal(
            <dialog
              ref={dialogRef}
              className="w-[390px] max-w-none backdrop:bg-black/50 border-t-[3px] border-btn-primary flex flex-col gap-8 p-5 pt-0 mb-0 fixed inset-0"
            >
              {/* <dialog> 요소는 내부에 method="dialog"를 가진 form이 있으면, 그 폼 안의 버튼을 클릭했을 때 자동으로 다이얼로그가 닫히도록 설계되어 있음 */}
              <form method="dialog">
                <button
                  type="button"
                  className="px-7 py-2 bg-btn-primary rounded-b-[10px] absolute top-0 left-1/2 transform -translate-x-1/2"
                  onClick={close}
                >
                  <img src="/icons/icon_down_thin.svg" className="w-6" />
                </button>
              </form>
              {children}
            </dialog>, // 모달을 modal-root ID를 가진 DOM 요소 안에 렌더링
            // 이렇게 하면 모달이 부모 컴포넌트의 스타일이나 위치에 영향을 받지 않고 독립적으로 표시됨.
            document.getElementById("modal-root") || document.body
          )}
      </>
    );
  }
);

export default PurchaseModal;
