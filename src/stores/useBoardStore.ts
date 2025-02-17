import { create } from "zustand";
import {
  getBoardWithTodoId,
  getBoardWithBoardIdOrTodoId,
  moveTodoToAnotherBoard,
  moveTodoWithinBoard,
  moveBoard,
} from "@/utils/drag";
import { BoardData, TodoData } from "@/types";

interface BoardStore {
  boardList: BoardData[];
  setBoardList: (boardList: BoardData[]) => void;
  startDrag: (activeId: string, overId: string) => void;
  endDrag: (activeId: string, overId: string) => void;
  addBoard: (board: BoardData) => void;
  updateBoard: (id: string, title: string) => void;
  deleteBoard: (id: string) => void;
  addTodo: (boardId: string, todo: TodoData) => void;
  updateTodo: (boardId: string, todoId: string, updatedTodo: TodoData) => void;
  deleteTodo: (boardId: string, todoId: string) => void;
}

/**
 * 보드 및 Todo 목록 관리
 */
const useBoardStore = create<BoardStore>((set) => ({
  /** 보드 목록 */
  boardList: [],
  /** 보드 목록 설정 함수 */
  setBoardList: (boardList) => set({ boardList }),

  /**
   * Todo를 다른 보드로 옮길 때, 드래그한 요소를 원하는 위치로 이동을 처리하는 함수
   * @param activeId - 드래그한 요소의 id
   * @param overId - 이동할 위치의 id
   */
  startDrag: (activeId, overId) => {
    set((state) => {
      const activeBoard = getBoardWithTodoId(state.boardList, activeId);
      const overBoard = getBoardWithBoardIdOrTodoId(state.boardList, overId);

      // 이동이 없는 경우 (같은)
      if (!activeBoard || !overBoard || activeBoard === overBoard) return state;

      return {
        boardList: moveTodoToAnotherBoard(
          state.boardList,
          activeBoard,
          overBoard,
          activeId,
          overId
        ),
      };
    });
  },

  /**
   * 드래그가 끝났을 때, 드래그한 대상이 보드인지 todo인지에 따라 이동을 처리하는 함수
   * @param activeId - 선택한 요소의 id
   * @param overId - 이동할 위치의 id
   */
  endDrag: (activeId, overId) => {
    set((state) => {
      const activeBoard = getBoardWithBoardIdOrTodoId(
        state.boardList,
        activeId
      );
      const overBoard = getBoardWithBoardIdOrTodoId(state.boardList, overId);

      // 이동이 없는 경우
      if (!activeBoard || !overBoard) return state;

      // 1. 보드 자체를 이동하는 경우
      if (activeBoard.id === activeId && overBoard.id === overId) {
        return { boardList: moveBoard(state.boardList, activeId, overId) };
      }

      // 2. 같은 보드 내에서 todo를 이동한 경우
      if (activeBoard.id === overBoard.id) {
        return {
          boardList: moveTodoWithinBoard(
            state.boardList,
            overBoard,
            activeId,
            overId
          ),
        };
      }

      // 3. 다른 보드로 todo를 이동한 경우
      return {
        boardList: moveTodoToAnotherBoard(
          state.boardList,
          activeBoard,
          overBoard,
          activeId,
          overId
        ),
      };
    });
  },

  /**
   * 새로운 보드를 추가하는 함수
   * @param board - 추가할 보드 객체
   */
  addBoard: (board) =>
    set((state) => ({ boardList: [...state.boardList, board] })),

  /**
   *  보드 제목을 수정하는 함수
   * @param boardId - 수정할 보드의 ID
   * @param title - 변경할 보드 제목
   * @returns
   */
  updateBoard: (boardId, title) =>
    set((state) => ({
      boardList: state.boardList.map((board) =>
        board.id === boardId ? { ...board, title } : board
      ),
    })),

  /**
   * 보드를 삭제하는 함수
   * @param boardId 삭제할 보드의 ID
   */
  deleteBoard: (boardId) =>
    set((state) => ({
      boardList: state.boardList.filter((board) => board.id !== boardId),
    })),

  /**
   * 보드에 Todo를 추가하는 함수
   * @param boardId - Todo를 추가할 보드의 ID
   * @param todo - 추가할 Todo 객체
   */
  addTodo: (boardId, todo) =>
    set((state) => ({
      boardList: state.boardList.map((board) =>
        board.id === boardId
          ? { ...board, todos: [...board.todos, todo] }
          : board
      ),
    })),

  /**
   * 특정 Todo를 수정하는 함수
   * @param boardId - Todo가 속한 보드의 ID
   * @param todoId - 수정할 Todo의 ID
   * @param updatedTodo - 변경된 Todo 객체
   */
  updateTodo: (boardId, todoId, updatedTodo) =>
    set((state) => ({
      boardList: state.boardList.map((board) =>
        board.id === boardId
          ? {
              ...board,
              todos: board.todos.map((todo) =>
                todo.id === todoId ? updatedTodo : todo
              ),
            }
          : board
      ),
    })),

  /**
   * 특정 Todo를 삭제하는 함수
   * @param boardId - Todo가 속한 보드의 ID
   * @param todoId - 삭제할 Todo의 ID
   */
  deleteTodo: (boardId, todoId) =>
    set((state) => ({
      boardList: state.boardList.map((board) =>
        board.id === boardId
          ? {
              ...board,
              todos: board.todos.filter((todo) => todo.id !== todoId),
            }
          : board
      ),
    })),
}));

export default useBoardStore;
