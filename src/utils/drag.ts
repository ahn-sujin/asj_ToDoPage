import { BoardData } from "@/types";
import { removeAtIndex, insertAtIndex, arrayMove } from "@/utils/array";

/**
 * todo가 속한 보드 찾기 (시작)
 * @param boardList - 현재 보드 목록
 * @param todoId - 선택한 todo id
 * @returns 선택한 todo가 속한 보드 객체
 */
export const getBoardWithTodoId = (boardList: BoardData[], todoId: string) =>
  boardList.find((board) => board.todos.some((todo) => todo.id === todoId));

/**
 * 선택한 보드 또는 선택한 todo가 속한 보드 찾기 (목표)
 * @param boardList - 햔제 보드 목록
 * @param id - 선택한 보드 id 또는 선택한 todo id
 * @returns - 주어진 id(보드 or todo)에 해당하는 보드 객체
 */
export const getBoardWithBoardIdOrTodoId = (
  boardList: BoardData[],
  id: string
) =>
  boardList.find(
    (board) => board.id === id || board.todos.some((todo) => todo.id === id)
  );

/**
 * todo를 다른 보드로 이동시키는 함수
 * @param boardList - 현재 보드 목록
 * @param activeBoard - todo가 속한 현재 보드
 * @param overBoard - todo를 이동시킬 목표 보드
 * @param activeId - 이동할 todo의 id
 * @param overId - 이동시킬 목표 위치의 todo id
 * @returns 이동된 결과를 반영한 새로운 보드 목록
 */
export const moveTodoToAnotherBoard = (
  boardList: BoardData[],
  activeBoard: BoardData,
  overBoard: BoardData,
  activeId: string,
  overId: string | null
) => {
  const activeIndex = activeBoard.todos.findIndex(
    (todo) => todo.id === activeId
  );
  const movedTodo = activeBoard.todos[activeIndex];

  return boardList.map((board) => {
    if (board.id === activeBoard.id) {
      return { ...board, todos: removeAtIndex(board.todos, activeIndex) };
    }
    if (board.id === overBoard.id) {
      return {
        ...board,
        todos: insertAtIndex(
          board.todos,
          overId ? board.todos.findIndex((todo) => todo.id === overId) : 0,
          movedTodo
        ),
      };
    }
    return board;
  });
};

/**
 * 같은 보드 내에서 todo를 이동시키는 함수
 * @param boardList - 현재 보드 목록
 * @param board - todo가 속한 보드
 * @param activeId - 이동할 todo의 id
 * @param overId - 이동시킬 목표 위치의 todo id
 * @returns 이동된 결과를 반영한 새로운 보드 목록
 */
export const moveTodoWithinBoard = (
  boardList: BoardData[],
  board: BoardData,
  activeId: string,
  overId: string
) => {
  return boardList.map((b) =>
    b.id === board.id
      ? {
          ...b,
          todos: arrayMove(
            board.todos,
            board.todos.findIndex((todo) => todo.id === activeId),
            board.todos.findIndex((todo) => todo.id === overId)
          ),
        }
      : b
  );
};

/**
 * 보드 자체를 이동시키는 함수
 * @param boardList - 현재 보드 목록
 * @param activeId - 이동할 보드의 id
 * @param overId - 이동시킬 목표 위치의 보드 id
 * @returns
 */
export const moveBoard = (
  boardList: BoardData[],
  activeId: string,
  overId: string
) => {
  return arrayMove(
    boardList,
    boardList.findIndex((board) => board.id === activeId),
    boardList.findIndex((board) => board.id === overId)
  );
};
