declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: string, ...args: any[]): void;
        invoke(channel: string, ...args: any[]): Promise<any>;
        on(
          channel: string,
          func: (...args: any[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: any[]) => void): void;
      };
    };
  }
}

export {};
