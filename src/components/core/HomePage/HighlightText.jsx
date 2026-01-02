const HighlightText = ({text}) => {
  return (
    <span className= "font-bold text-transparent bg-clip-text bg-linear-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]">
        {" "}
        {text}
        {" "}
    </span>
  )
};

// Export
export default HighlightText;
