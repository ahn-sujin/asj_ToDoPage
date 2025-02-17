"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
} from "react-icons/ai";

import { TodoData } from "@/types";
import useBoardStore from "@/stores/useBoardStore";
import { useOnKeyDown } from "@/hooks/useEventHandler";

interface TodosProps {
  boardId: string;
  todo: TodoData;
}

export default function Todos({ boardId, todo }: TodosProps) {
  const { id, todo: text } = todo;
  const inputRef = useRef<HTMLInputElement>(null);

  const [newTodo, setNewTodo] = useState<TodoData>(todo);
  const [isUpdating, setIsUpdating] = useState(false);

  const { updateTodo, deleteTodo } = useBoardStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const isTodoEmpty = useMemo(() => newTodo.todo.trim() === "", [newTodo]);

  // 투두 수정중
  const onChangeTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo((prevTodo) => ({ ...prevTodo, todo: e.target.value }));
  };

  // 투두 수정 완료
  const onClickUpdateTodo = () => {
    updateTodo(boardId, id, newTodo);
    setIsUpdating(false);
  };

  // 투두 수정 취소
  const onClickCancelUpdate = () => {
    setIsUpdating(false);
    setNewTodo(todo);
  };

  // 투두 삭제
  const onClickDeleteTodo = () => {
    deleteTodo(boardId, id);
  };

  const onKeyDown = useOnKeyDown(onClickUpdateTodo);

  const styleWrapper = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    if (isUpdating) {
      inputRef.current?.focus();
    }
  }, [isUpdating]);

  return (
    <div
      style={styleWrapper}
      ref={setNodeRef}
      {...attributes}
      className="flex gap-2 items-center"
    >
      {!isUpdating ? (
        <>
          <div
            {...listeners}
            className="flex-grow p-2 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            {text}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsUpdating(true)}
              aria-label="TODO 수정"
            >
              <AiOutlineEdit size="16" />
            </button>
            <button
              type="button"
              onClick={onClickDeleteTodo}
              className="text-red-500"
              aria-label="TODO 삭제"
            >
              <AiOutlineDelete size="16" />
            </button>
          </div>
        </>
      ) : (
        <div className="flex gap-2 w-full">
          <input
            className="flex-grow h-[42px] py-1 px-2 border border-gray-300 rounded focus:outline-none"
            ref={inputRef}
            onChange={onChangeTodo}
            onKeyDown={onKeyDown}
            placeholder={newTodo.todo}
          />
          <div className="flex gap-2">
            <button
              className={`${isTodoEmpty && "opacity-30"} text-green-500`}
              onClick={onClickUpdateTodo}
              disabled={isTodoEmpty}
              aria-label="TODO 수정 완료"
            >
              <AiOutlineCheck size="16" />
            </button>
            <button onClick={onClickCancelUpdate} aria-label="TODO 수정 취소">
              <AiOutlineClose size="16" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
