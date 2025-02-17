"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

import { TodoData } from "@/types";
import useBoardStore from "@/stores/useBoardStore";
import { useOnKeyDown } from "@/hooks/useEventHandler";

interface TodoInputProps {
  boardId: string;
}

export default function TodoInput({ boardId }: TodoInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [newTodo, setNewTodo] = useState("");
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  const { addTodo } = useBoardStore();

  const isTodoEmpty = useMemo(() => newTodo.trim() === "", [newTodo]);

  // 투두 입력중
  const onChangeTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  // 투두 추가
  const onClickAddTodo = () => {
    if (!isTodoEmpty) {
      const newTodoData: TodoData = {
        id: `todo-${Date.now()}`,
        todo: newTodo,
      };

      addTodo(boardId, newTodoData);

      setNewTodo("");
      setIsAddingTodo(false);
    }
  };

  const onKeyDown = useOnKeyDown(onClickAddTodo);

  useEffect(() => {
    if (isAddingTodo) {
      inputRef.current?.focus();
    }
  }, [isAddingTodo]);

  return (
    <div className="p-2 text-gray-500 border border-gray-300 rounded-lg">
      {isAddingTodo ? (
        <div className="flex gap-2">
          <input
            className="flex-grow  border-none rounded focus:outline-none"
            ref={inputRef}
            onChange={onChangeTodo}
            onKeyDown={onKeyDown}
            placeholder="할 일을 입력해주세요"
          />
          <div className="flex gap-2">
            <button
              className={`${isTodoEmpty && "opacity-30"} text-green-500`}
              onClick={onClickAddTodo}
              aria-label="TODO 등록"
            >
              <AiOutlineCheck size="16" />
            </button>
            <button
              onClick={() => setIsAddingTodo(false)}
              aria-label="TODO 등록 닫기"
            >
              <AiOutlineClose size="16" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAddingTodo(true)}
          className="w-full"
        >
          + 할 일 등록하기
        </button>
      )}
    </div>
  );
}
