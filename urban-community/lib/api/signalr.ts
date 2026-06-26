import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
  type HubConnection,
} from '@microsoft/signalr';
import { useAuthStore } from '@/features/auth';

let connection: HubConnection | null = null;

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';

export type SignalREventHandler = (data: unknown) => void;

const eventHandlers = new Map<string, Set<SignalREventHandler>>();

export function getSignalRConnection(): HubConnection | null {
  return connection;
}

export async function connectSignalR(): Promise<HubConnection> {
  if (connection?.state === HubConnectionState.Connected) {
    return connection;
  }

  const token = useAuthStore.getState().token;
  if (!token) {
    throw new Error('Cannot connect SignalR without authentication');
  }

  if (connection) {
    await connection.stop();
  }

  connection = new HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/hubs/notifications`, {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect([0, 2000, 5000, 10_000, 30_000])
    .configureLogging(LogLevel.Warning)
    .build();

  connection.onreconnecting(() => {
    console.log('SignalR reconnecting...');
  });

  connection.onreconnected(() => {
    console.log('SignalR reconnected');
  });

  connection.onclose(() => {
    console.log('SignalR connection closed');
  });

  eventHandlers.forEach((handlers, event) => {
    handlers.forEach((handler) => {
      connection?.on(event, handler);
    });
  });

  await connection.start();
  console.log('SignalR connected');
  return connection;
}

export async function disconnectSignalR(): Promise<void> {
  if (connection) {
    await connection.stop();
    connection = null;
  }
}

export function onSignalREvent(event: string, handler: SignalREventHandler): () => void {
  if (!eventHandlers.has(event)) {
    eventHandlers.set(event, new Set());
  }
  eventHandlers.get(event)!.add(handler);

  if (connection?.state === HubConnectionState.Connected) {
    connection.on(event, handler);
  }

  return () => {
    eventHandlers.get(event)?.delete(handler);
    connection?.off(event, handler);
  };
}
