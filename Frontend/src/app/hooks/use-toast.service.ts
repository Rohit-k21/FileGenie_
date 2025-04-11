import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, Observable } from 'rxjs';
import { scan, map } from 'rxjs/operators';

interface Toast {
  id: string;
  severity: 'success' | 'info' | 'warn' | 'error';
  summary?: string;
  detail?: string;
  action?: { label: string; onClick: () => void };
  open: boolean;
}

interface ToastAction {
  type: 'ADD_TOAST' | 'DISMISS_TOAST' | 'REMOVE_TOAST';
  toast?: Toast;
  toastId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UseToastService {
  private readonly TOAST_LIMIT = 1;
  private readonly TOAST_REMOVE_DELAY = 1000000; // 1000 seconds (adjust as needed)
  private toastActions$ = new Subject<ToastAction>();
  private toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

  // Observable for the current toasts
  toasts$: Observable<Toast[]> = this.toastActions$.pipe(
    scan((toasts: Toast[], action: ToastAction) => this.reducer(toasts, action), [] as Toast[]),
    map((toasts) => toasts.slice(0, this.TOAST_LIMIT))
  );

  constructor(private messageService: MessageService) {}

  private genId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private reducer(toasts: Toast[], action: ToastAction): Toast[] {
    switch (action.type) {
      case 'ADD_TOAST':
        return [action.toast!, ...toasts];

      case 'DISMISS_TOAST': {
        const { toastId } = action;
        if (toastId) {
          this.addToRemoveQueue(toastId);
        } else {
          toasts.forEach((toast) => this.addToRemoveQueue(toast.id));
        }
        return toasts.map((t) =>
          t.id === toastId || toastId === undefined ? { ...t, open: false } : t
        );
      }

      case 'REMOVE_TOAST':
        if (action.toastId === undefined) return [];
        return toasts.filter((t) => t.id !== action.toastId);

      default:
        return toasts;
    }
  }

  private addToRemoveQueue(toastId: string): void {
    if (this.toastTimeouts.has(toastId)) return;

    const timeout = setTimeout(() => {
      this.toastTimeouts.delete(toastId);
      this.remove(toastId);
    }, this.TOAST_REMOVE_DELAY);

    this.toastTimeouts.set(toastId, timeout);
  }

  // Public methods to trigger toasts
  toast(props: Omit<Toast, 'id' | 'open'>): { id: string; dismiss: () => void; update: (props: Partial<Toast>) => void } {
    const id = this.genId();
    const toast: Toast = { ...props, id, open: true };

    this.toastActions$.next({ type: 'ADD_TOAST', toast });
    this.messageService.add({
      key: 'global',
      severity: toast.severity,
      summary: toast.summary,
      detail: toast.detail,
    });

    const dismiss = () => this.dismiss(id);
    const update = (updatedProps: Partial<Toast>) =>
      this.toastActions$.next({ type: 'ADD_TOAST', toast: { ...toast, ...updatedProps } });

    return { id, dismiss, update };
  }

  dismiss(toastId?: string): void {
    this.toastActions$.next({ type: 'DISMISS_TOAST', toastId });
  }

  private remove(toastId: string): void {
    this.toastActions$.next({ type: 'REMOVE_TOAST', toastId });
  }

  // Convenience methods
  success(summary: string, detail?: string): void {
    this.toast({ severity: 'success', summary, detail });
  }

  error(summary: string, detail?: string): void {
    this.toast({ severity: 'error', summary, detail });
  }

  info(summary: string, detail?: string): void {
    this.toast({ severity: 'info', summary, detail });
  }

  warn(summary: string, detail?: string): void {
    this.toast({ severity: 'warn', summary, detail });
  }
}

// Utility type to mimic Omit
type omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
