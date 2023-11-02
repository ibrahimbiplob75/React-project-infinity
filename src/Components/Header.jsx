import logo from "../assets/logo.png";
import PropTypes from "prop-types";


const Header = ({ selectedCount, deleteSelected }) => {
  return (
    <header>
      {selectedCount === 0 ? (
        <img src={logo} alt="" />
      ) : (
        <div className="header">
          <h1>{selectedCount} Files Selected</h1>
          <button className="flex btn" onClick={deleteSelected}>
            Delete
          </button>
        </div>
      )}
      <hr></hr>
    </header>
  );
};

Header.propTypes = {
  selectedCount: PropTypes.number,
  deleteSelected: PropTypes.func,
};

export default Header;
