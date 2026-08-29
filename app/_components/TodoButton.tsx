'use client';

import { ReactNode, useState } from "react";

export default function TodoButton({children}:{children: ReactNode}){
    const [viewtodo, setViewTodo] = useState(false);

    return (
        <div className="flex flex-col justify-center items-center gap-4 min-h-screen">
            <button onClick={()=>setViewTodo(!viewtodo)} className="bg-black text-white px-4 py-2 rounded-md">
                {viewtodo? "Hide Todos":"Show Todos"}
            </button>
            {viewtodo && children}
        </div>
    )
}