import { arrayMove as dndKitArrayMove } from "@dnd-kit/sortable";

/**
 * 배열에서 특정 인덱스의 요소를 제거하는 함수
 * @param array - 원본 배열
 * @param index - 제거할 요소의 인덱스
 * @returns 주어진 인덱스의 요소가 제거된 새로운 배열
 */
export const removeAtIndex = <T>(array: T[], index: number): T[] => {
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

/**
 * 배열의 특정 인덱스에 새로운 요소를 삽입하는 함수
 * @param array - 원본 배열
 * @param index - 요소를 삽입할 위치
 * @param item - 삽입할 요소
 * @returns 새로운 요소가 추가된 새로운 배열
 */
export const insertAtIndex = <T>(array: T[], index: number, item: T): T[] => {
  return [...array.slice(0, index), item, ...array.slice(index)];
};

/**
 * 배열 내 요소의 위치를 변경하는 함수
 * @param array - 원본 배열
 * @param oldIndex - 이동할 요소의 현재 인덱스
 * @param newIndex - 이동할 요소의 목표 인덱스
 * @returns 요소가 재배치된 새로운 배열
 */
export const arrayMove = <T>(
  array: T[],
  oldIndex: number,
  newIndex: number
): T[] => {
  return dndKitArrayMove(array, oldIndex, newIndex);
};
