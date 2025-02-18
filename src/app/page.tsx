"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { throttle } from "lodash";

import useBoardStore from "@/stores/useBoardStore";
import Board from "@/components/Board";
import Loader from "@/components/Loader";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { boardList, addBoard, startDrag, endDrag, setBoardList } =
    useBoardStore();

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 보드 추가
  const onClickAddBoard = () => {
    const newBoard = {
      id: `board-${Date.now()}`,
      title: `New Board ${boardList.length + 1}`,
      todos: [],
    };
    addBoard(newBoard);
  };

  // 드래그된 아이템이 다른 영역으로 이동할 때 호출
  const handleDragOver = throttle(({ active, over }: DragOverEvent) => {
    if (!over) return;
    startDrag(String(active.id), String(over.id));
  }, 200);

  // 드래그가 끝났을 때 호출
  const handleDragEnd = throttle(({ active, over }: DragEndEvent) => {
    if (!over) return;
    endDrag(String(active.id), String(over.id));
  }, 200);

  useEffect(() => {
    const savedBoardList = localStorage.getItem("boardList");
    if (savedBoardList) {
      setBoardList(JSON.parse(savedBoardList));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("boardList", JSON.stringify(boardList));
    }
  }, [boardList, isLoading]);

  return (
    <DndContext
      sensors={sensors}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-6 p-4 ">
        <header className="flex items-center justify-between pb-6 border-b border-gray-300">
          <h1 className="text-4xl font-bold">To-Do List</h1>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow"
            onClick={onClickAddBoard}
            aria-label="보드 생성하기"
          >
            보드 생성
          </button>
        </header>
        <section className="overflow-x-auto w-full">
          {isLoading && <Loader />}
          {!isLoading && boardList.length > 0 && (
            <SortableContext items={boardList.map((board) => board.id)}>
              <ul className="flex gap-6 items-start w-max">
                {boardList.map((board) => (
                  <Board
                    key={board.id}
                    boardId={board.id}
                    title={board.title}
                    todos={board.todos}
                  />
                ))}
              </ul>
            </SortableContext>
          )}
          {!isLoading && boardList.length === 0 && (
            <p className="text-gray-500">먼저 보드를 생성해주세요.</p>
          )}
        </section>
      </div>
    </DndContext>
  );
}
