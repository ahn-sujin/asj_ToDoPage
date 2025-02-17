import { create } from "zustand";
import { removeAtIndex, insertAtIndex, arrayMove } from "@/utils/array";
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
      const activeBoard = state.boardList.find((board) =>
        board.todos.some((todo) => todo.id === activeId)
      );
      const overBoard = state.boardList.find((board) =>
        board.todos.some((todo) => todo.id === overId)
      );

      if (activeBoard && overBoard && activeBoard !== overBoard) {
        const activeIndex = activeBoard.todos.findIndex(
          (todo) => todo.id === activeId
        );
        const overIndex = overBoard.todos.findIndex(
          (todo) => todo.id === overId
        );
        const movedTodo = activeBoard.todos[activeIndex];

        const updatedBoardList = state.boardList.map((board) => {
          if (board.id === activeBoard.id) {
            return {
              ...board,
              todos: removeAtIndex(board.todos, activeIndex),
            };
          }
          if (board.id === overBoard.id) {
            return {
              ...board,
              todos: insertAtIndex(board.todos, overIndex, movedTodo),
            };
          }
          return board;
        });

        return {
          boardList: updatedBoardList,
        };
      }
      return state;
    });
  },

  /**
   * 드래그가 끝났을 때, 드래그한 대상이 보드인지 todo인지에 따라 이동을 처리하는 함수
   * @param activeId - 선택한 요소의 id
   * @param overId - 이동할 위치의 id
   */
  endDrag: (activeId, overId) => {
    set((state) => {
      const activeBoard = state.boardList.find(
        (board) => board.id === activeId
      );
      const overBoard = state.boardList.find((board) => board.id === overId);

      if (activeBoard && overBoard && activeBoard !== overBoard) {
        // 보드 자체를 드래그한 경우
        return {
          boardList: arrayMove(
            state.boardList,
            state.boardList.findIndex((board) => board.id === activeBoard.id),
            state.boardList.findIndex((board) => board.id === overBoard.id)
          ),
        };
      } else {
        // 보드 내부 todo를 드래그한 경우
        const activeContainer = state.boardList.find((board) =>
          board.todos.some((todo) => todo.id === activeId)
        );
        const overContainer = state.boardList.find((board) =>
          board.todos.some((todo) => todo.id === overId)
        );

        if (activeContainer && overContainer) {
          return {
            boardList: state.boardList.map((board: BoardData) => {
              if (board.id === overContainer.id) {
                return {
                  ...board,
                  todos: arrayMove(
                    board.todos,
                    board.todos.findIndex((todo) => todo.id === activeId),
                    board.todos.findIndex((todo) => todo.id === overId)
                  ),
                };
              }
              return board;
            }),
          };
        }
      }

      return state;
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
