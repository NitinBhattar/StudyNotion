const Quote = () => {
    return (
        <div className=" text-xl md:text-4xl font-semibold mx-auto py-5 pb-20 text-center text-white">
            We are passionate about revolutionizing the way we learn. Our
            innovative platform
            <span className="font-bold text-transparent bg-clip-text bg-linear-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]">
                {" "}combines technology
            </span>
            ,
            <span className="bg-linear-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold">
                {" "}expertise{" "}
            </span>
            , and community to create an
            <span className="bg-linear-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold">
                {" "}
                unparalleled educational experience.
            </span> 
        </div>
    )
};

// Export
export default Quote;
