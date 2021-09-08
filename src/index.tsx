import { render } from "./react-like";

const Title = (props: any) => (
  <h1 {...props} style={{ color: "red", marginBottom: "10px" }}>
    {props.children}
  </h1>
);

/** @jsxImportSource ./react-like */
const App = () => (
  <div>
    <Title className="title">Hello world!</Title>
    <ul>
      <li>a</li>
      <li>b</li>
      <li>c</li>
    </ul>
    <h2>test</h2>
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  </div>
);

console.log("App", App);
// @ts-ignore
render(<App />, document.getElementById("root"));
