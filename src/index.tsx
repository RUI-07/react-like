import { render } from "./react-like";
import { useState, useEffect } from "./react-like/hooks";

/** @jsxImportSource ./react-like */

const Title = (props: any) => {
  const [count, setCount] = useState(10);
  return (
    <h1
      onClick={() => setCount((v) => v + 1)}
      {...props}
      style={{ color: "red", marginBottom: "10px" }}
    >
      {props.children} {count}
    </h1>
  );
};

const Content = (
  <div>
    <span>test content</span>
  </div>
);

const Counter = () => {
  const [count, setCount] = useState(10);
  return <div onClick={() => setCount((v) => v + 1)}>{count}</div>;
};

const App = () => {
  const [show, setShow] = useState(false);

  return (
    <div>
      {show && <Counter />}
      <button onClick={() => setShow((v) => !v)}>click</button>
    </div>
  );
};

render(<App />, document.getElementById("root") as HTMLElement);

// let Content = (
//   <div>
//     <h1 style={{ color: "red", marginBottom: "10px" }}>Hello world!</h1>
//     <ul>
//       <li>a</li>
//       <li>b</li>
//       <li>c</li>
//     </ul>
//     <h2>test</h2>
//     <div className="App">
//       <h1>Hello CodeSandbox</h1>
//       <h2>Start editing to see some magic happen!</h2>
//     </div>
//   </div>
// );
//
// const countRef = { value: 0 };
// let clickHandler = [
//   () => console.log("1"),
//   () => console.log("2"),
//   () => console.log("3"),
// ];
// setTimeout(() => {
//   console.log("change");
//   Content = (
//     <div>
//       <button onClick={clickHandler[countRef.value % 3]}>Click!</button>
//       <h1 style={{ color: "red", marginBottom: "10px" }}>Hello world!</h1>
//       <ul>
//         <li>a</li>
//         <li>b</li>
//         <li>c</li>
//       </ul>
//       <h2>test</h2>
//       <div className="App">
//         <h1>Hello CodeSandbox</h1>
//         <h2 style={{ color: "blueviolet" }}>Changed!</h2>
//         <div>count: {countRef.value++}</div>
//       </div>
//     </div>
//   );
//
//   // @ts-ignore
//   render(Content, document.getElementById("root"));
// }, 1000);
//
// console.log("App", Content);
// // @ts-ignore
// render(Content, document.getElementById("root"));
