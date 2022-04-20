import * as React from "react";

export default function Root() {
  const [count, setCount] = React.useState(0);

  return (
    <html>
      <head>
        <title>React App</title>
      </head>
      <body>
        <h1>Hello, World!</h1>
        <button onClick={() => setCount(count + 1)}>Count: {count}</button>

        <script type="module" src="/build/entry.client.js" />
      </body>
    </html>
  );
}
