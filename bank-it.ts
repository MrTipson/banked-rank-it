const THRESHOLD = 2;
export function add (user: string) {
    console.log('add');
    if (user in queue) {
        return;
    }
    queue.push(user);
    console.log('Users in queue', queue);
    if (queue.length >= THRESHOLD) {
        if (onQueue) {
            onQueue(queue.splice(0,THRESHOLD));
        }
    }
}

export function remove(user: string) {
    console.log('remove');
    const i = queue.indexOf(user);
    if (i >= 0) {
        queue = queue.splice(i, 1);
    }
}

type handlerFn = (users: string[]) => void;
let onQueue: handlerFn | null = null;
export function setHandler(handler: handlerFn) {
    onQueue = handler;
}

let queue: string[] = [];