

# Kanban-style Todo List
이 프로젝트는 **칸반 스타일의 todo list** 를 구현했습니다.


<img width="1429" alt="스크린샷 2025-02-17 오후 10 34 56" src="https://github.com/user-attachments/assets/5151a974-3dc3-43ee-a63a-d10d3593301d" />


## 구현 기능

- 보드를 생성, 수정, 삭제, 이동할 수 있습니다.
- 할 일을 생성, 수정, 삭제할 수 있습니다.
- 할 일의 순서를 변경할 수 있습니다.
- 할 일을 보드 간에 이동시킬 수 있습니다.

## 사용 기술

- Typescript, Next.js(15.1.7), Tailwind CSS(3.4.1)
- Zustand, dnd-kit

## 실행 방법

1. 프로젝트 clone or Download ZIP
2. 의존성 설치
   ```
   npm install
   ```
3. 개발 서버 실행
   ```
   npm run dev
   ```

## 프로젝트 구조

```
├─ README.md
├─ eslint.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
├─ src
│  ├─ app
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ components
│  │  ├─ Board.tsx
│  │  ├─ Loader.tsx
│  │  ├─ Todo.tsx
│  │  └─ TodoInput.tsx
│  ├─ hooks
│  │  └─ useEventHandler.ts
│  ├─ stores
│  │  └─ useBoardStore.ts
│  ├─ types.ts
│  └─ utils
│     ├─ array.ts
│     └─ drag.ts
├─ tailwind.config.ts
└─ tsconfig.json
```

### src/app

- `layout.tsx`
  - 전체 페이지 레이아웃 정의
- `page.tsx`
  - 프로젝트 메인 페이지
  - 보드 생성, 보드 및 할 일 드래그 앤 드롭 기능 구현

### src/components

- `Board.tsx`
  - 보드 컴포넌트
  - 보드 수정, 삭제 기능 구현
  - 할 일 및 할 일 입력 컴포넌트 랜더링
- `Loader.tsx`
  - 데이터 로딩 컴포넌트 
- `Todo.tsx`
  - 할 일 컴포넌트
  - 할 일 수정 및 삭제 기능 구현
- `TodoInput.tsx`
  - 새로운 할 일 등록 컴포넌트
  - 할 일 생성 기능 구현

### src/hooks

- `useEventHandler.ts`
  - 이벤트 핸들링 관련 로직을 담고 있는 커스텀 훅

### src/stores

- `useBoardStore.ts`
  - zustand를 이용한 전역 상태 관리
  - 보드 및 할 일의 상태를 관리하고, 상태 변경 로직을 처리

### src/types.ts

- 프로젝트에서 사용되는 타입 정의

### src/utils

- `array.ts`
  - 배열 관련 유틸리티 함수들을 정의
- `drag.ts`
  - 드래그 앤 드롭 기능과 관련된 유틸리티 함수들을 정의
