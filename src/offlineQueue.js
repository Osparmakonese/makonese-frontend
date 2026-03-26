const QUEUE_KEY = "makonese_offline_queue";

export function enqueueAction(action) {
  const queue = getQueue();
  queue.push({ ...action, timestamp: Date.now(), id: Math.random().toString(36) });
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function getQueue() {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]"); }
  catch { return []; }
}

export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY);
}

export async function replayQueue(axiosInstance) {
  const queue = getQueue();
  if (queue.length === 0) return 0;
  let replayed = 0;
  const remaining = [];
  for (const action of queue) {
    try {
      await axiosInstance({ method: action.method, url: action.url, data: action.data });
      replayed++;
    } catch {
      remaining.push(action);
    }
  }
  localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
  return replayed;
}
