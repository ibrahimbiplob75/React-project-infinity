import React from "react";
import { useDrag, useDrop } from "react-dnd";
import PropTypes from "prop-types";

import galleryList from "../src/Components/data.js";
import logo from "../src/assets/logo.png";


const Header = ({ selectedCount }) => {
  return (
    <header>
      {selectedCount === 0 ? (
        <img src={logo} alt="" />
      ) : (
        <div className="header">
          <h1>{selectedCount} Files Selected</h1>
          <button  className="flex btn">
            Delet
          </button>
        </div>
      )}
    </header>
  );
};


const Card = ({ src, title, id, index, moveImage, selected, toggleSelect }) => {
  const ref = React.useRef(null);

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
    toggleSelect(id); // Toggle the selected state of the card
  };

  return (
    <div
      ref={ref}
      style={{
        opacity,
        border: selected ? "2px solid red" : "2px solid transparent",
      }}
      className="card"
      onClick={handleCardClick}
    >
      <img src={src} alt={title} />
    </div>
  );
};

const App = () => {
  const [images, setImages] = React.useState(galleryList);
  const [selectedCount, setSelectedCount] = React.useState(0);

  // Initialize the selected state for each image to false
  const [selectedImages, setSelectedImages] = React.useState(
    galleryList.map((image) => ({ id: image.id, selected: false }))
  );


  const moveImage = React.useCallback((dragIndex, hoverIndex) => {
    setImages((prevCards) => {
      const clonedCards = [...prevCards];
      const removedItem = clonedCards.splice(dragIndex, 1)[0];

      clonedCards.splice(hoverIndex, 0, removedItem);
      return clonedCards;
    });
  }, []);
  const toggleSelect = (imageId) => {
    setSelectedImages((prevSelectedImages) => {
      const updatedSelectedImages = prevSelectedImages.map((image) => {
        if (image.id === imageId) {
          return { ...image, selected: !image.selected };
        }
        return image;
      });

      const newSelectedCount = updatedSelectedImages.filter(
        (image) => image.selected
      ).length;
      setSelectedCount(newSelectedCount);

      return updatedSelectedImages;
    });
  };

  return (
    <diV>
      <Header selectedCount={selectedCount} />

      <main>
        {React.Children.toArray(
          images.map((image, index) => (
            <Card
              src={image.img}
              title={image.title}
              id={image.id}
              index={index}
              moveImage={moveImage}
              selected={
                selectedImages.find((selected) => selected.id === image.id)
                  ?.selected
              }
              toggleSelect={toggleSelect}
            />
          ))
        )}
      </main>
    </diV>
  );
};
Card.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string,
  id: PropTypes.number,
  index: PropTypes.number,
  selected:PropTypes.bool,
  toggleSelect:PropTypes.bool,
  moveImage: PropTypes.func,
};

Header.propTypes = {
  selectedCount: PropTypes.number,
};

export default App;
