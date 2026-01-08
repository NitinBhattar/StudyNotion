const formatDate = (dateString) => {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    let hour = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12; // fixes 12 AM / 12 PM bug

    return `${formattedDate} | ${hour}:${minutes} ${period}`;
};

// Export
export default formatDate;
