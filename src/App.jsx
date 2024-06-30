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
          color: "#ff6242",
          opacity: 0.5,
          ranges:[initialRange]
        }}
        SliderProps={{
          height: "3rem",
          width: "0.5rem",
          color: "#333333",
          fillColor: "#d1ffbd",
          borderColor: "black",
          start: null,
          end: null,
       
        }}
        isTwelveHour={false}
        step={5}
        workingHoursStart={0*60}
        workingHoursEnd={24*60}
      />
    </div>
  );
}

export default App;
