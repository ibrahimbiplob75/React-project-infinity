import React from "react";
import { useDrag, useDrop } from "react-dnd";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
 import "react-toastify/dist/ReactToastify.css";
import galleryList from "../src/Components/data.js";
import logo from "../src/assets/logo.png";




const Header = ({ selectedCount, deleteSelected }) => {
  
  return (
    <header>
      {selectedCount === 0 ? (
        <img src={logo} alt="" />
      ) : (
        <div className="header">
          <h1>{selectedCount} Files Selected</h1>
          <button
            className="flex btn"
            onClick={deleteSelected}
          >
            Delete
          </button>
          
          
        </div>
      )}
    </header>
  );
};


const Card = ({ src, title, id, index, moveImage, selected, toggleSelect }) => {
  const ref = React.useRef(null);

  const notify = () => toast("Item's are selected !");
  

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
        border: selected ? "2px solid red" : "2px solid transparent",
      }}
      // className={`card ${featured ? "featured" : ""}`}
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


  //Deeleting Image
  const deleteSelected = () => {
     
    const updatedImages = images.filter((image) => {
      // Keep the images that are not selected
      return !selectedImages.find((selected) => selected.id === image.id)
        ?.selected;
    });

    setImages(updatedImages);

    // Clear the selection after deletion
    setSelectedImages(
      selectedImages.map((image) => ({
        id: image.id,
        selected: false,
      }))
    );
    
    setSelectedCount(0);
    
  };

  return (
    <div>
      <Header selectedCount={selectedCount} deleteSelected={deleteSelected} />

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
              return
              featured={index === 0}
            />
          ))
        )}

        <div className="upload-card">
          <h2>Upload file</h2>
        </div>
        <ToastContainer />
      </main>
    </div>
  );
};
Card.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string,
  id: PropTypes.number,
  index: PropTypes.number,
  selected: PropTypes.bool, // Correct if it's supposed to be a boolean
  toggleSelect: PropTypes.func, // Correct to PropTypes.func
  moveImage: PropTypes.func,
  
};


Header.propTypes = {
  selectedCount: PropTypes.number,
  deleteSelected: PropTypes.func,
};

export default App;
