import { useState, useRef,useEffect } from "react";
import moment from "moment";

const RangeSelector = ({
  textColor = "#333333",
  fontStyle = "monospace, sans-serif",
  textSize = "1.6rem",
  reservedSlot = {
    color: "#FE5C58",
    opacity: 0.8,
    ranges: [],
  },
  SliderProps = {
    height: "3rem",
    width: "0.5rem",
    color: "#333333",
    fillColor: "#DBF3FB",
    borderColor: "#55ADC3",
    start: null,
    end: null,
  },
  isTwelveHour = true,
  showTime = true,
  step = 5,
}) => {
  const initialStartTime =
    SliderProps.start !== null
      ? parseInt(moment(SliderProps.start).format("HH")) * 60 +
        parseInt(moment(SliderProps.start).format("mm"))
      : 0;

  const initialEndTime =
    SliderProps.end !== null
      ? parseInt(moment(SliderProps.end).format("HH")) * 60 +
        parseInt(moment(SliderProps.end).format("mm"))
      : 1435;

  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const sliderRef = useRef(null);

  useEffect(() => {
    console.log(SliderProps.start, SliderProps.end);
    if (SliderProps.start) {
      let formattedStart =
        parseInt(moment(SliderProps.start).format("HH")) * 60 +
        parseInt(moment(SliderProps.start).format("mm"));
      setStartTime(formattedStart);
    }

    if (SliderProps.end) {
      let formattedEnd =
        parseInt(moment(SliderProps.end).format("HH")) * 60 +
        parseInt(moment(SliderProps.end).format("mm"));
      setEndTime(formattedEnd);
    }
  }, [SliderProps.start, SliderProps.end]);

  // Format ranges in ISO string to minutes
  const ranges = reservedSlot?.ranges?.map((slot) => ({
    start:
      parseInt(moment(slot.start).format("HH")) * 60 +
      parseInt(moment(slot.start).format("mm")),
    end:
      parseInt(moment(slot.end).format("HH")) * 60 +
      parseInt(moment(slot.end).format("mm")),
  }));

  const roundToStep = (value) => Math.round(value / step) * step;

  const handleMouseDown = (event, type) => {
    const onMouseMove = (event) => handleDrag(event, type);
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleTouchStart = (event, type) => {
    const onTouchMove = (event) => handleDrag(event.touches[0], type);
    const onTouchEnd = () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
  };

  const handleDrag = (event, handleType) => {
    const clientX = event.clientX || event.touches[0].clientX;
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const newPosition = Math.max(
      0,
      Math.min(
        1439,
        Math.floor(((clientX - sliderRect.left) / sliderRect.width) * 1440)
      )
    );

    const roundedPosition = roundToStep(newPosition);

    if (handleType === "start") {
      if (roundedPosition < endTime) {
        setStartTime(roundedPosition);
      }
    } else {
      if (roundedPosition > startTime) {
        setEndTime(roundedPosition);
      }
    }
  };

  const handleKeyDown = (event, handleType) => {
    if (handleType === "start") {
      if (event.key === "ArrowLeft" && startTime > 0) {
        setStartTime((prev) => Math.max(0, prev - step));
      } else if (event.key === "ArrowRight" && startTime < endTime - step) {
        setStartTime((prev) => Math.min(endTime - step, prev + step));
      }
    } else {
      if (event.key === "ArrowLeft" && endTime > startTime + step) {
        setEndTime((prev) => Math.max(startTime + step, prev - step));
      } else if (event.key === "ArrowRight" && endTime < 1439) {
        setEndTime((prev) => Math.min(1439, prev + step));
      }
    }
  };

  const formatTime = (value) => {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    if (!isTwelveHour) {
      const formattedHours = hours < 10 ? `0${hours}` : hours;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${formattedHours}:${formattedMinutes}`;
    } else {
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${formattedHours}:${formattedMinutes} ${period}`;
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white w-full max-w-lg mx-auto">
      <div
        className="relative w-full bg-gray-100 rounded shadow-md"
        ref={sliderRef}
        style={{
          height: SliderProps.height,
          border: `1px solid ${SliderProps.borderColor}`,
        }}
      >
        {ranges?.map((range, index) => (
          <div key={index}>
            <div
              className="absolute h-full z-10"
              style={{
                left: `${(range.start / 1440) * 100}%`,
                right: `${100 - (range.end / 1440) * 100}%`,
                backgroundColor: reservedSlot.color,
                opacity: reservedSlot.opacity,
              }}
            />
          </div>
        ))}
        <div
          className="absolute h-full rounded"
          style={{
            left: `${(startTime / 1440) * 100}%`,
            right: `${100 - (endTime / 1440) * 100}%`,
            backgroundColor: SliderProps.fillColor,
          }}
        />
        <div
          className="absolute rounded-md cursor-pointer z-20 transform -translate-y-1/2 -translate-x-1/2 transition-transform duration-200 ease-in-out hover:scale-110"
          style={{
            left: `${(startTime / 1440) * 100}%`,
            top: "50%",
            height: SliderProps.height,
            width: SliderProps.width,
            backgroundColor: SliderProps.color,
          }}
          onMouseDown={(event) => handleMouseDown(event, "start")}
          onTouchStart={(event) => handleTouchStart(event, "start")}
          tabIndex={0}
          onKeyDown={(event) => handleKeyDown(event, "start")}
        />
        <div
          className="absolute rounded-md cursor-pointer z-20 transform -translate-y-1/2 -translate-x-1/2 transition-transform duration-200 ease-in-out hover:scale-110"
          style={{
            left: `${(endTime / 1440) * 100}%`,
            top: "50%",
            height: SliderProps.height,
            width: SliderProps.width,
            backgroundColor: SliderProps.color,
          }}
          onMouseDown={(event) => handleMouseDown(event, "end")}
          onTouchStart={(event) => handleTouchStart(event, "end")}
          tabIndex={0}
          onKeyDown={(event) => handleKeyDown(event, "end")}
        />
      </div>

      {showTime && (
        <div
          className="font-semibold mt-4 text-center"
          style={{
            color: textColor,
            fontSize: `${textSize}px`,
            fontFamily: fontStyle,
          }}
        >
          {formatTime(startTime)} - {formatTime(endTime)}
        </div>
      )}
    </div>
  );
};

export default RangeSelector;
