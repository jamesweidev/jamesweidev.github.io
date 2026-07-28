import { Chessboard } from "react-chessboard";


export default function ChessWorksheet({ puzzles, pageName, pageNumber }) {
    var squareStyles = {};


    const lightSquare = 'rgb(255,255,255)';
    const darkSquare = 'rgb(200, 200, 200)';

    var fileColor = false;
    for (var fileASCII = 97; fileASCII <= 104; fileASCII++) {
        fileColor = !fileColor;

        var rankColor = fileColor;
        for (var rankASCII = 49; rankASCII <= 56; rankASCII++) {
            rankColor = !rankColor
            squareStyles[String.fromCharCode(fileASCII) + String.fromCharCode(rankASCII)] = {
                backgroundColor: rankColor ? lightSquare : darkSquare
            };
        }
    }

    const hollowTriangle = <svg className="w-4 h-4" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon className="fill-transparent stroke-black stroke-[4px]"
            points="50,5 95,95 5,95" />
    </svg>

    const filledTriangle = <svg className="w-4 h-4" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon className="fill-black stroke-black stroke-[4px]"
            points="50,5 95,95 5,95" />
    </svg>

    return (
        <div className="p-8 flex flex-col items-center bg-gray-100 min-h-screen print:bg-white 
        print:p-0 print:pt-10 print:[-webkit-print-color-adjust:exact] print:[print-color-adjust:exact]">


            <div
                className="bg-white p-12 shadow-lg w-198.5 min-h-280.75 flex flex-col 
                print:shadow-none print:w-full print:min-h-0 print:p-0 "
            >
                <header className="mb-8 border-b-2 pb-4 border-gray-500 flex justify-between items-end">
                    <h2 className="text-3xl font-bold text-black">{pageName}</h2>
                    <span className="italic text-black">Name: ______________________</span>
                </header>

                <div className="grid grid-cols-2 gap-y-6">
                    {puzzles.map((puzzle, index) => {
                        const chessboardOptions = {
                            position: puzzle,
                            allowDragging: false,
                            showNotation: false,
                            squareStyles: squareStyles
                        };

                        return (
                            <div
                                key={index}
                                className={`flex px-4 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-57 border">
                                        <Chessboard options={chessboardOptions} />
                                    </div>
                                    <h3 className="self-end mr-5">
                                        {puzzle.split(" ")[1] === 'w' ?
                                            hollowTriangle : filledTriangle}
                                    </h3>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <footer className="mt-5 pt-4 text-center text-sm border-t text-gray-500">
                    {pageNumber}
                </footer>
            </div>

        </div>
    );
}