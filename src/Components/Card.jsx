import React from "react";
import PropTypes from "prop-types";
import { useDrag, useDrop } from "react-dnd";
import { toast } from "react-toastify";

const Card = ({
  src,
  title,
  id,
  index,
  moveImage,
  selected,
  toggleSelect,
  featured,
}) => {
  const ref = React.useRef(null);
  console.log(featured);

  const notify = () => toast("Item's are Clicked!");

  const [, drop] = useDrop({
    accept: "image",
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveImage(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "image",
    item: () => {
      return { id, index };
    },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  const handleCardClick = () => {
    notify("Card clicked!");
    toggleSelect(id); // Toggle the selected state of the card
  };

  return (
    <div
      ref={ref}
      style={{
        opacity,
        border: selected ? "2px solid black" : "2px solid transparent",
      }}
      className={`card ${selected ? "checked" : ""}`}
      onClick={handleCardClick}
    >
      <div className="container">
        <label className="option_item"></label>
        {
          selected ? <input type="checkbox" checked className="checkbox"></input> : ""
        }
        
        <div className="option_inner">
          <img src={src} alt={title} />
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string,
  id: PropTypes.number,
  index: PropTypes.number,
  selected: PropTypes.bool,
  featured: PropTypes.bool,
  toggleSelect: PropTypes.func,
  moveImage: PropTypes.func,
};

export default Card;
