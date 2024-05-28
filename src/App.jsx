import RangeSelector from "./TimeRangeSelector/RangeSelector";
import moment from "moment";

function App() {
  const initialRange = {
    start: moment("12:50", "HH:mm").toISOString(),
    end: moment("16:50", "HH:mm").toISOString(),
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <RangeSelector
        textColor="#333333"
        fontStyle="monospace, sans-serif"
        textSize="1.6rem"
        reservedSlot={{
          color: "#FE5C58",
          opacity: 0.8,
          ranges:[initialRange]
        }}
        SliderProps={{
          height: "3rem",
          width: "0.5rem",
          color: "#333333",
          fillColor: "#55ADC3",
          borderColor: "#55ADC3",
        }}
        isTwelveHour={true}
      />
    </div>
  );
}

export default App;
