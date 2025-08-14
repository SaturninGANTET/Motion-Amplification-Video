// components/CloseButton.jsx
const CloseB = ({ onClick } : any) => {
  return (
    <button onClick={onClick} className="text-white">
      &#10006; {/* This is the HTML entity for the '×' symbol */}
    </button>
  );
};

export default CloseB;