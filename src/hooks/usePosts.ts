import { useState } from "react";
import type { AsyncDataState, Post } from "./types";

export function usePosts() {
    const [ posts, setPosts ] = useState<Post[]>([]);
    const [ state, setState ] = useState<AsyncDataState>('pending');

    const reload = 
}