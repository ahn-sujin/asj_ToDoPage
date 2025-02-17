"use client";

import { useMemo, useState } from "react";
import {
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineEdit,
} from "react-icons/ai";

import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { TodoData } from "@/types";
import useBoardStore from "@/stores/useBoardStore";
import { useOnKeyDown } from "@/hooks/useEventHandler";

import Todo from "./Todo";
import TodoInput from "./TodoInput";

interface BoardProps {
  boardId: string;
  title: string;
  todos: TodoData[];
}

export default function Board({ boardId: id, title, todos }: BoardProps) {
  const [newTitle, setNewTitle] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const { updateBoard, deleteBoard } = useBoardStore();
  const { setNodeRef } = useDroppable({ id });
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const isTitleEmpty = useMemo(() => newTitle.trim() === "", [newTitle]);

  // 보드 제목 수정중
  const onChangeBoardTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  // 보드 제목 수정 완료
  const onClickUpdateBoardTitle = (boardId: string) => {
    updateBoard(boardId, newTitle);
    setIsUpdating(false);
    setNewTitle("");
  };

  // 보드 제목 수정 취소
  const onClickCancleBoardTitle = () => {
    setIsUpdating(false);
    setNewTitle("");
  };

  // 보드 삭제
  const onClickDeleteBoard = (boardId: string) => {
    deleteBoard(boardId);
  };

  const onKeyDown = useOnKeyDown(() => onClickUpdateBoardTitle(id));

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={(node) => {
        setNodeRef(node);
        setSortableRef(node);
      }}
      {...attributes}
      style={style}
      className="flex flex-col gap-4 w-[300px]"
    >
      {/* 보드 제목 */}
      <div className="flex item-center gap-2">
        {!isUpdating ? (
          <>
            <h3 {...listeners} className="flex-grow text-lg font-medium">
              {title}
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsUpdating(true)}
                aria-label="보드 제목 수정"
              >
                <AiOutlineEdit size="16" />
              </button>
              <button
                type="button"
                onClick={() => onClickDeleteBoard(id)}
                className="text-red-500"
                aria-label="보드 삭제"
              >
                <AiOutlineDelete size="16" />
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              className="flex-grow py-1 px-2 border border-gray-300 rounded focus:outline-none"
              value={newTitle}
              onChange={onChangeBoardTitle}
              onKeyDown={onKeyDown}
              placeholder={title}
            />
            <div className="flex gap-2">
              <button
                type="button"
                className={`${isTitleEmpty && "opacity-30"} text-green-500`}
                onClick={() => onClickUpdateBoardTitle(id)}
                disabled={isTitleEmpty}
                aria-label="보드 제목 수정 완료"
              >
                <AiOutlineCheck size="16" />
              </button>
              <button
                type="button"
                onClick={onClickCancleBoardTitle}
                aria-label="보드 제목 수정 취소"
              >
                <AiOutlineClose size="16" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* 투두 목록  */}
      {!!todos.length && (
        <div className="flex flex-col gap-2 py-6 px-4 bg-gray-100 rounded-lg">
          {/* 등록한 투두 */}
          <SortableContext id={id} items={todos} strategy={rectSortingStrategy}>
            {todos.map((todo) => (
              <Todo key={todo.id} boardId={id} todo={todo} />
            ))}
          </SortableContext>
        </div>
      )}

      {/* 새로운 투두 등록하기 */}
      <TodoInput boardId={id} />
    </li>
  );
}
