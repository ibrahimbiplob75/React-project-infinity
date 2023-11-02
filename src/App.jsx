import React from "react";
import "react-toastify/dist/ReactToastify.css";
import galleryList from "../src/Components/data.js";
import Header from "../src/Components/Header.jsx"
import { ToastContainer } from "react-toastify";
import Card from "./Components/Card.jsx";


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


export default App;
