import TodoButton from "./_components/TodoButton";

export default function Home() {
  type Todo = {
    title: string,
    description: string
  }

  const todos: Todo[] = [
    {
      title: "Setup",
      description: "Setup a next.js project"
    },
    {
      title: "Dummy Code",
      description: "Write some dummy code to understand server side and client side in next"
    }
  ];

  return (
    <div>
      <TodoButton>
        <div className="flex flex-col justify-center items-center gap-4">
          {todos.map((todo)=>{
            return (
              <div key={todo.title} className="space-y-2">
                <div className="text-2xl font-medium text-black text-center">{todo.title}</div>
                <div className="text-base font-normal text-black text-center">{todo.description}</div>
              </div>
            )
          })}
        </div>
      </TodoButton>
    </div>
  );
}
