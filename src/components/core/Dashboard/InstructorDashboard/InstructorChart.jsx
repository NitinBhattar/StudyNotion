// Import
import { useState } from "react";
import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";

// Chart config, resgisters all the component it needs
Chart.register(...registerables);

const InstructorChart = ({ courses }) => {
    // State to keep track of the currently selected chart
    const [currChart, setCurrChart] = useState("students");

    // Function to generate random colors for the chart
    const generateRandomColors = (numColors) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
            colors.push(color);
        }

        return colors;
    };

    // Student information chart
    const chartDataStudents = {
        // Label and its colours
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => course.totalStudentsEnrolled),
                backgroundColor: generateRandomColors(courses.length)
            }
        ]
    };

    // Income information chart
    const chartIncomeData = {
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => course.totalAmountGenerated),
                backgroundColor: generateRandomColors(courses.length),
            }
        ]
    };

    // Options for the chart
    const options = {
        maintainAspectRatio: false
    };

    return (
        <div className= "flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
            <h3 className= "text-lg font-bold text-richblack-5">Visualize</h3>

            {/* Student chart switch */}
            <div className= "space-x-4 font-semibold">
                <button
                    onClick= {() => setCurrChart("students")}
                    className= {`rounded-sm p-1 px-3 transition-all duration-200
                                ${currChart === "students"
                                ? "bg-richblack-700 text-yellow-50"
                                : "text-yellow-400"}`}
                >
                    Students
                </button>

                {/* Income chart switch */}
                <button
                    onClick= {() => setCurrChart("income")}
                    className= {`rounded-sm p-1 px-3 transition-all duration-200
                                ${currChart === "income"
                                ? "bg-richblack-700 text-yellow-50"
                                : "text-yellow-400"}`}
                >
                    Income
                </button>
            </div>

            {/* Pie-Chart */}
            <div className= "relative mx-auto h-full w-full">
                <Pie
                    data={currChart === "students" ? chartDataStudents : chartIncomeData}
                    options={options}
                />
            </div>
        </div>
    )
};

// Export
export default InstructorChart;
