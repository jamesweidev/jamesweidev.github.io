import { useState, useRef, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard, ChessboardProvider, SparePiece, defaultPieces } from 'react-chessboard';
import './App.css';
import Worksheet from './Worksheet';

function App() {
  const gameRef = useRef(new Chess());

  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [sideToPlay, setSideToPlay] = useState('w');
  const [squareWidth, setSquareWidth] = useState(null);
  const [puzzles, setPuzzles] = useState([]);
  const [pageName, setPageName] = useState('');
  const [pageNumber, setPageNumber] = useState('')


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramFENs = JSON.parse(params.get("fen"));

    const paramPageNum = params.get("pageNum")

    if (paramPageNum) {
      setPageNumber(paramPageNum)
    }

    if (paramFENs?.length == 6) {
      setPuzzles(paramFENs);
    }
  }, [])

  // get the width of a square to use for the spare piece sizes
  useEffect(() => {
    const square = document.querySelector(`[data-column="a"][data-row="1"]`)?.getBoundingClientRect();
    setSquareWidth(square?.width ?? null);
  }, []);

  const onPieceDrop = (move) => {
    const game = gameRef.current;

    game.remove(move.sourceSquare);

    if (move.targetSquare) {
      const piece = move.piece.pieceType;
      game.put({ type: piece[1].toLowerCase(), color: piece[0] }, move.targetSquare);
    }

    setFen(game.fen());
  }

  // get the piece types for the black and white spare pieces
  const blackPieceTypes = [];
  const whitePieceTypes = [];
  for (const pieceType of Object.keys(defaultPieces)) {
    if (pieceType[0] === 'b') {
      blackPieceTypes.push(pieceType);
    } else {
      whitePieceTypes.push(pieceType);
    }
  }

  const chessboardOptions = {
    position: fen,
    onPieceDrop,
    showAnimations: false,
    draggingPieceGhostStyle: { opacity: 0 }
  };

  const changeFen = (newFen) => {
    const game = gameRef.current;

    game.load(newFen, { skipValidation: true });
    setFen(newFen);
  }

  const changeSideToPlay = () => {
    const game = gameRef.current;

    let newSideToPlay = 'b';
    if (!game.setTurn('b')) {
      game.setTurn('w');
      newSideToPlay = 'w';
    }

    setFen(game.fen());
    setSideToPlay(newSideToPlay);
  }


  return (
    <div className='w-3/4 flex flex-col'>
      <main className='flex flex-col min-h-fit items-center pb-20
        pt-10 gap-5 print:hidden'>

        <h1 className='self-center main-heading'>Chess Worksheet Generator</h1>

        <div className='flex justify-between'>

        </div>

        {/* Center Position Editing Section */}
        <div className='flex w-full items-start'>

          {/* Position Editor Board */}
          <div className='flex-1 flex flex-col pl-20 justify-center'>
            <ChessboardProvider options={chessboardOptions}>
              {squareWidth ? <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                width: 'fit-content',
                margin: '0 auto'
              }}>
                {blackPieceTypes.map(pieceType => <div key={pieceType} style={{
                  width: `${squareWidth}px`,
                  height: `${squareWidth}px`
                }}>
                  <SparePiece pieceType={pieceType} />
                </div>)}
              </div> : null}

              <Chessboard />

              {squareWidth ? <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                width: 'fit-content',
                margin: '0 auto'
              }}>
                {whitePieceTypes.map(pieceType => <div key={pieceType} style={{
                  width: `${squareWidth}px`,
                  height: `${squareWidth}px`
                }}>
                  <SparePiece pieceType={pieceType} />
                </div>)}
              </div> : null}

            </ChessboardProvider>

          </div>
          
          {/* Right Config Section */}
          <div className='flex-1 flex justify-start w-full pt-4'>
            <div className='flex flex-col py-10 gap-10 w-6/7 -ml-4
                  text-white items-center justify-center'>

              {/* Inputs */}
              <div className='flex flex-col w-full gap-1'>

                {/* FEN Input */}
                <div className='grid grid-cols-2 gap-2 text-lg'>
                  <p className='font-bold justify-self-end'>FEN: </p>
                  <input type="text" value={fen}
                    className='border rounded-md text-center px-2'
                    onChange={({ target }) => { changeFen(target.value) }} />
                </div>

                {/* Page Name Input */}
                <div className='grid grid-cols-2 gap-2 text-lg'>
                  <p className='font-bold justify-self-end'>Page Name: </p>
                  <input type="text" value={pageName}
                    className='border rounded-md text-center px-2'
                    onChange={({ target }) => { setPageName(target.value) }} />
                </div>

                {/* Page Number Input */}
                <div className='grid grid-cols-2 gap-2 text-lg'>
                  <p className='font-bold justify-self-end'>Page Number: </p>
                  <input type="text" value={pageNumber}
                    className='border rounded-md text-center max-w-1/5'
                    onChange={({ target }) => { setPageNumber(target.value) }} />
                </div>

              </div>


              <div className='flex flex-col gap-2 items-center  w-full'>
                <button onClick={changeSideToPlay} className='btn-primary'>
                  {`${(sideToPlay == 'w') ? 'White ' : 'Black '} to Play`}
                </button>
                <button className='btn-primary'
                  onClick={() => { changeFen('8/8/8/8/8/8/8/8 w - - 0 1') }}>
                  Clear Board</button>
                <button className='btn-primary'
                  onClick={() => { changeFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') }}>
                  Starting Position</button>
                <button className='btn-primary'
                  onClick={() => {
                    if (puzzles.length == 6) {
                      alert("there are already 6 saved puzzles");
                      return;
                    }
                    setPuzzles([...puzzles, fen]);
                  }}>Add to Puzzle</button>

                <button
                  onClick={() => window.print()}
                  className="btn-primary bg-blue-500 hover:bg-blue-600 border-none mt-10"
                >
                  Download as PDF
                </button>
              </div>


            </div>
          </div>
        </div>

        <hr className='border-2 border-white w-full' />

        {/* Shows added puzzles */}
        <div className='w-3/5 flex flex-col items-center mt-10 gap-5 hide'>

          <h2 className='second-heading'>{pageName}</h2>
          <div className='grid grid-cols-2 gap-y-e gap-x-7 w-full chessboards'>
            {puzzles.map((puzzle, index) => {
              const chessboardOptions = {
                position: puzzle,
                allowDragging: false,
                showNotation: false
              };

              // render the chessboard
              return (
                <div className='flex flex-col items-center w-full' key={index}>
                  <p className='text-lg font-bold text-gray-200'>
                    {index + 1}. {(puzzle.split(' ')[1] == 'w' ? 'white' : 'black')} to play
                  </p>
                  <Chessboard options={chessboardOptions} />

                  <div className='flex w-full justify-end gap-2 mt-2'>
                    <svg className="w-1/12 h-full stroke-white hover:stroke-blue-300 
                      hover:cursor-pointer" width="800px" height="800px" viewBox="0 0 24 24"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.3282 8.32837L15.8939 5.89405C14.7058 4.706 14.1118 4.11198 13.4268 3.88941C12.8243 3.69364 12.1752 3.69364 11.5727 3.88941C10.8877 4.11198 10.2937 4.706 9.10564 5.89405L7.49975 7.49994M3 20.9997L3.04745 20.6675C3.21536 19.4922 3.29932 18.9045 3.49029 18.3558C3.65975 17.8689 3.89124 17.4059 4.17906 16.9783C4.50341 16.4963 4.92319 16.0765 5.76274 15.237L17.4107 3.58896C18.1918 2.80791 19.4581 2.80791 20.2392 3.58896C21.0202 4.37001 21.0202 5.63634 20.2392 6.41739L8.37744 18.2791C7.61579 19.0408 7.23497 19.4216 6.8012 19.7244C6.41618 19.9932 6.00093 20.2159 5.56398 20.3879C5.07171 20.5817 4.54375 20.6882 3.48793 20.9012L3 20.9997Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <svg className="w-1/12 h-full stroke-white fill-white hover:fill-red-400
                      hover:stroke-red-400 hover:cursor-pointer"
                      onClick={() => {
                        setPuzzles((prev) => prev.filter((_, i) => i !== index));
                      }}
                      height="800px" width="800px" version="1.1" id="_x32_"
                      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 512 512" xml:space="preserve">
                      <g>
                        <path class="st0" d="M308.229,51.853C308,23.183,284.751,0.017,256,0c-28.734,0.017-52,23.183-52.228,51.853
      c-63.821,9.2-109.796,33.323-109.796,49.845v16.718c0,20.784,72.538,37.625,162.024,37.625c89.486,0,162.024-16.841,162.024-37.625
      v-16.718C418.024,85.176,372.049,61.053,308.229,51.853z M256,48.065c-6.245,0-12.376,0.196-18.433,0.498
      c0.735-3.715,2.547-6.996,5.144-9.616c3.445-3.437,8.049-5.494,13.289-5.51c5.257,0.017,9.845,2.073,13.306,5.51
      c2.595,2.62,4.408,5.902,5.135,9.616C268.384,48.261,262.245,48.065,256,48.065z"/>
                        <path class="st0" d="M256,178.335c-89.486,0-162.024-16.841-162.024-37.625l18.53,316.253C112.506,478.506,167.233,512,256,512
      c88.767,0,143.51-33.494,143.51-55.037l18.514-316.253C418.024,161.494,345.486,178.335,256,178.335z M158.588,421.682
      l-6.661-195.134c4.465,1.02,9.249,1.878,14.269,2.743l6.752,197.878C167.763,425.436,162.988,423.567,158.588,421.682z
      M217.176,436.98l-3.609-202.278c4.637,0.318,9.339,0.629,14.123,0.784l3.608,202.98C226.433,438.074,221.722,437.6,217.176,436.98
      z M294.824,436.98c-4.547,0.62-9.339,1.094-14.196,1.486l3.608-202.98c4.784-0.155,9.494-0.466,14.123-0.784L294.824,436.98z
      M353.412,421.682c-4.392,1.886-9.175,3.755-14.351,5.486l6.744-197.878c5.02-0.865,9.803-1.796,14.277-2.743L353.412,421.682z"/>
                      </g>
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <div className='hidden print:flex justify-center'>
        <Worksheet puzzles={puzzles} pageName={pageName} pageNumber={pageNumber}/>
      </div>
    </div>
  )
}

export default App;