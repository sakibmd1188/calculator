/* eslint-disable default-case */
import { useReducer } from "react";
import "./App.css";
import DigitButton from "./Digit";
import OperationB from "./OperationB";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CLEAR: "clear",
  CHOOSE_OPERATION: "choose_operation",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previosOperand == null)
        return state;
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previosOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previosOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previosOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previosOperand == null
      )
        return state;
      return {
        ...state,
        overwrite: true,
        previosOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
  }
}
function evaluate({ currentOperand, previosOperand, operation }) {
  const prev = parseFloat(previosOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
  }
  return computation.toString();
}
function App() {
  const [{ currentOperand, previosOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {previosOperand} {operation}
        </div>
        <div className="current-operand">{currentOperand}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button>DEL</button>

      <OperationB operation="÷" dispatch={dispatch} />
      {/* <button>1</button> */}
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationB operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationB operation="+" dispatch={dispatch} />

      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationB operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />

      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
