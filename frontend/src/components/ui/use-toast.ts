import * as React from "react";

import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";

const TOAST_LIMIT = 10;
const TOAST_REMOVE_DELAY = 1000;

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export type ToastMessage = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

interface ToastState {
  toasts: ToastMessage[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToasts = (state: ToastState, toast: ToastMessage): ToastState => {
  return {
    ...state,
    toasts: [toast, ...state.toasts].slice(0, TOAST_LIMIT),
  };
};

const updateToasts = (state: ToastState, toast: ToastMessage): ToastState => {
  return {
    ...state,
    toasts: state.toasts.map((item) => (item.id === toast.id ? { ...item, ...toast } : item)),
  };
};

const dismissToastById = (state: ToastState, id?: string): ToastState => {
  if (!id) {
    state.toasts.forEach((toast) => scheduleToastRemoval(toast.id));
    return { ...state, toasts: [] };
  }

  scheduleToastRemoval(id);
  return {
    ...state,
    toasts: state.toasts.filter((toast) => toast.id !== id),
  };
};

const removeToastById = (state: ToastState, id?: string): ToastState => {
  if (!id) {
    return { ...state, toasts: [] };
  }
  return {
    ...state,
    toasts: state.toasts.filter((toast) => toast.id !== id),
  };
};

const toastReducer = (state: ToastState, action: any): ToastState => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return addToasts(state, action.toast);
    case actionTypes.UPDATE_TOAST:
      return updateToasts(state, action.toast);
    case actionTypes.DISMISS_TOAST:
      return dismissToastById(state, action.toastId);
    case actionTypes.REMOVE_TOAST:
      return removeToastById(state, action.toastId);
    default:
      return state;
  }
};

const listeners: Array<(state: ToastState) => void> = [];

let memoryState: ToastState = { toasts: [] };

function notifyListeners() {
  listeners.forEach((listener) => listener(memoryState));
}

function dispatch(action: any) {
  memoryState = toastReducer(memoryState, action);
  notifyListeners();
}

function scheduleToastRemoval(id: string) {
  if (toastTimeouts.has(id)) {
    return;
  }
  const timeout = setTimeout(() => {
    dispatch({ type: actionTypes.REMOVE_TOAST, toastId: id });
    toastTimeouts.delete(id);
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(id, timeout);
}

export function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast: createToast,
    dismiss: (id?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id }),
  };
}

export function createToast({ title, description, action }: Omit<ToastMessage, "id">) {
  const id = Math.random().toString(36).slice(2, 9);
  dispatch({ type: actionTypes.ADD_TOAST, toast: { id, title, description, action } });
  return id;
}

export const toast = createToast;