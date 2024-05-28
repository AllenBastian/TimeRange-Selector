import { useState, useEffect, useRef } from "react";
import moment from "moment";


const RangeSelector = ({
  textColor = "black",
  textSize = "30",
  fontStyle = "Arial, sans-serif",
  reservedSlot = { ranges: [],color: "rgba(100, 200, 100, 200)", opacity: 1 },
  SliderProps = {
    height: "40px",
    width: "10px",
    color: "black",
    fillColor: "yellow",
    borderColor: "red",
  },
  isTwelveHour = false,
  showTime = true,

}) => {

  const [startTime, setStartTime] = useState(0);
  const [reservedSlots, setReservedSlots] = useState([]);
  const [endTime, setEndTime] = useState(1439);
  const sliderRef = useRef(null);

  const ranges = reservedSlot.ranges.map((slot) => ({
    start: parseInt(moment(slot.start).format('HH')) * 60 + parseInt(moment(slot.start).format('mm')),
    end: parseInt(moment(slot.end).format('HH')) * 60 + parseInt(moment(slot.end).format('mm'))
  }));

  const handleDrag = (event, handleType) => {
    console.log("hbe")
    const clientX = event.clientX || event.touches[0].clientX;
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const newPosition = Math.max(
      0,
      Math.min(
        1439,
        Math.floor(((clientX - sliderRect.left) / sliderRect.width) * 1440)
      )
    );

    if (handleType === "start") {
      if (newPosition < endTime) {
        setStartTime(newPosition);
      }
    } else {
      if (newPosition > startTime) {
        setEndTime(newPosition);
      }
    }
  };

  const handleKeyDown = (event, handleType) => {
    if (handleType === "start") {
      if (event.key === "ArrowLeft" && startTime > 0) {
        setStartTime(startTime - 1);
      } else if (event.key === "ArrowRight" && startTime < endTime - 1) {
        setStartTime(startTime + 1);
      }
    } else {
      if (event.key === "ArrowLeft" && endTime > startTime + 1) {
        setEndTime(endTime - 1);
      } else if (event.key === "ArrowRight" && endTime < 1439) {
        setEndTime(endTime + 1);
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
        className="relative w-full bg-gray-200 rounded"
        ref={sliderRef}
        style={{
          height: SliderProps.height,
          border: `1px solid ${SliderProps.borderColor}`,
        }}
      >
        {ranges.map((range, index) => (
          <div key={index}>
            <div
              className="absolute h-full z-10 "
              style={{
                left: `${(range.start / 1440) * 100}%`,
                right: `${100 - (range.end / 1440) * 100}%`,
                backgroundColor: reservedSlotColor.color,
                opacity: reservedSlotColor.opacity,
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
          className="absolute md:w-1 w-5 rounded  cursor-pointer z-20 square-handle"
          style={{
            left: `${(startTime / 1440) * 100}%`,
            transform: "translate(-50%, -50%)",
            top: "50%",
            height: SliderProps.height,
            width: SliderProps.width,
            backgroundColor: SliderProps.color,
          }}
          onMouseDown={(event) => {
            const onMouseMove = (event) => handleDrag(event, "start");
            const onMouseUp = () => {
              window.removeEventListener("mousemove", onMouseMove);
              window.removeEventListener("mouseup", onMouseUp);
            };
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
          }}
          onTouchStart={(event) => {
            const onTouchMove = (event) => handleDrag(event.touches[0], "start");
            const onTouchEnd = () => {
              window.removeEventListener("touchmove", onTouchMove);
              window.removeEventListener("touchend", onTouchEnd);
            };
            window.addEventListener("touchmove", onTouchMove);
            window.addEventListener("touchend", onTouchEnd);
          }}
          tabIndex={0}
          onKeyDown={(event) => handleKeyDown(event, "start")}
        />
        <div
          className="absolute md:w-1 cursor-pointer rounded z-20 square-handle"
          style={{
            left: `${(endTime / 1440) * 100}%`,
            transform: "translate(-50%, -50%)",
            top: "50%",
            height: SliderProps.height,
            width: SliderProps.width,
            backgroundColor: SliderProps.color,
          }}
          onMouseDown={(event) => {
            const onMouseMove = (event) => handleDrag(event, "end");
            const onMouseUp = () => {
              window.removeEventListener("mousemove", onMouseMove);
              window.removeEventListener("mouseup", onMouseUp);
            };
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
          }}
          onTouchStart={(event) => {
            const onTouchMove = (event) => handleDrag(event.touches[0], "end");
            const onTouchEnd = () => {
              window.removeEventListener("touchmove", onTouchMove);
              window.removeEventListener("touchend", onTouchEnd);
            };
            window.addEventListener("touchmove", onTouchMove);
            window.addEventListener("touchend", onTouchEnd);
          }}
          tabIndex={0}
          onKeyDown={(event) => handleKeyDown(event, "end")}
        />
      </div>

      {showTime && (

      <div className="font-semibold mt-4" style={{ color: textColor, fontSize: `${textSize}px`, fontFamily: fontStyle }}>
        {formatTime(startTime)} - {formatTime(endTime)}
      </div>
      )}
    </div>
  );
};

export default RangeSelector;
