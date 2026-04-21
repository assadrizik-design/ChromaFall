import { useEffect, useCallback, useState, useRef } from 'react';
import { SHAPES, LEVELS } from './constants';
import { audio } from './audio';

export type Tetrimino = keyof typeof SHAPES;
export type GameState = 'TUTORIAL' | 'PLAYING' | 'GAME_OVER' | 'LEVEL_UP' | 'AD' | 'PAUSED' | 'RESUMING';

const randomTetrimino = () => {
  const keys = Object.keys(SHAPES) as Tetrimino[];
  return keys[Math.floor(Math.random() * keys.length)];
};

const createEmptyGrid = (cols: number, rows: number) => {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
};

export const useTetris = () => {
  const [level, setLevel] = useState(1);
  const [state, setState] = useState<GameState>('TUTORIAL');
  const [grid, setGrid] = useState<any[][]>([]);
  const [activeShape, setActiveShape] = useState<any[][]>([]);
  const [activeType, setActiveType] = useState<Tetrimino | 0>(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [linesCleared, setLinesCleared] = useState(0);
  const [clearingRows, setClearingRows] = useState<number[]>([]);
  const [fastDrop, setFastDrop] = useState(false);
  
  const currentConfig = LEVELS.find(l => l.level === level) || LEVELS[0];
  
  const dropTime = useRef<number | null>(null);
  const dropTimer = useRef<number | null>(null);
  const gameStartTime = useRef<number>(0);

  const initGame = useCallback((targetLevel: number) => {
    const config = LEVELS.find(l => l.level === targetLevel) || LEVELS[0];
    setGrid(createEmptyGrid(config.cols, config.rows));
    setPos({ x: Math.floor(config.cols / 2) - 1, y: 0 });
    const type = randomTetrimino();
    setActiveType(type);
    setActiveShape(SHAPES[type]);
    setLevel(targetLevel);
    setState('PLAYING');
    if (targetLevel === 1) {
       setScore(0);
       setLinesCleared(0);
    }
    gameStartTime.current = Date.now();
    audio.startBGM();
  }, []);

  const checkCollision = useCallback((shape: any[][], x: number, y: number, currentGrid: any[][]) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] !== 0) {
          const newY = y + r;
          const newX = x + c;
          if (newY >= currentGrid.length || newX < 0 || newX >= currentGrid[0].length || (newY >= 0 && currentGrid[newY][newX] !== 0)) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  const movePlayer = useCallback((dir: number) => {
    if (state !== 'PLAYING' || clearingRows.length > 0) return;
    if (!checkCollision(activeShape, pos.x + dir, pos.y, grid)) {
      setPos(prev => ({ ...prev, x: prev.x + dir }));
      audio.playMove(); // Quiet sound
    }
  }, [state, clearingRows, activeShape, pos, grid, checkCollision]);

  const rotatePlayer = useCallback(() => {
    if (state !== 'PLAYING' || clearingRows.length > 0) return;
    const rotated = activeShape[0].map((_, index) =>
      activeShape.map(row => row[index]).reverse()
    );
    if (!checkCollision(rotated, pos.x, pos.y, grid)) {
      setActiveShape(rotated);
      audio.playRotate();
    }
  }, [state, clearingRows, activeShape, pos, grid, checkCollision]);

  const placePiece = useCallback(() => {
    const newGrid = [...grid.map(row => [...row])];
    let gameOver = false;

    for (let r = 0; r < activeShape.length; r++) {
      for (let c = 0; c < activeShape[r].length; c++) {
        if (activeShape[r][c] !== 0) {
          const y = pos.y + r;
          if (y < 0) {
            gameOver = true;
          } else {
            newGrid[y][pos.x + c] = activeType;
          }
        }
      }
    }

    if (gameOver) {
      setState('GAME_OVER');
      audio.stopBGM();
      return;
    }

    audio.playDrop();

    // Check for lines
    const linesToClear: number[] = [];
    newGrid.forEach((row, i) => {
      if (row.every(cell => cell !== 0)) {
        linesToClear.push(i);
      }
    });

    if (linesToClear.length > 0) {
      setClearingRows(linesToClear);
      audio.playClear();
      
      const newScore = score + [100, 300, 500, 800][linesToClear.length - 1] || 1000;
      const newLines = linesCleared + linesToClear.length;
      
      setTimeout(() => {
        const remainingRows = newGrid.filter((_, i) => !linesToClear.includes(i));
        const emptyRows = createEmptyGrid(currentConfig.cols, linesToClear.length);
        setGrid([...emptyRows, ...remainingRows]);
        setClearingRows([]);
        setScore(newScore);
        setLinesCleared(newLines);

        // Check level up
        if (newLines >= currentConfig.linesToNext && level < 10) {
          setState('LEVEL_UP');
          audio.stopBGM();
          audio.playLevelUp();
        } else {
          spawnPiece();
        }
      }, 300);
    } else {
      setGrid(newGrid);
      spawnPiece();
    }
  }, [activeShape, pos, grid, activeType, currentConfig, score, linesCleared, level]);

  const spawnPiece = useCallback(() => {
    setFastDrop(false);
    setPos({ x: Math.floor(currentConfig.cols / 2) - 1, y: 0 });
    const type = randomTetrimino();
    setActiveType(type);
    setActiveShape(SHAPES[type]);
    if (checkCollision(SHAPES[type], Math.floor(currentConfig.cols / 2) - 1, 0, grid)) {
      audio.stopBGM();
      const isLongGame = Date.now() - gameStartTime.current > 30000 || score > 300 || level > 1; // 30s or some points
      if (isLongGame) {
        setState('AD');
      } else {
        setState('GAME_OVER');
      }
    }
  }, [currentConfig, grid, checkCollision, score, level]);

  const dropPlayer = useCallback((hard = false) => {
    if (state !== 'PLAYING' || clearingRows.length > 0) return;
    let newY = pos.y + 1;
    if (hard) {
      while (!checkCollision(activeShape, pos.x, newY, grid)) {
        newY++;
      }
      newY--;
      setPos(prev => ({ ...prev, y: newY }));
      placePiece();
    } else {
      if (!checkCollision(activeShape, pos.x, newY, grid)) {
        setPos(prev => ({ ...prev, y: newY }));
      } else {
        placePiece();
      }
    }
  }, [state, clearingRows, activeShape, pos, grid, checkCollision, placePiece]);

  // Tick
  useEffect(() => {
    const tick = () => {
      if (stateRef.current === 'PLAYING' && clearingRowsRef.current.length === 0) {
        dropPlayerRef.current(false);
      }
    };
    if (state === 'PLAYING') {
      const speed = fastDrop ? 30 : currentConfig.speed;
      dropTimer.current = window.setInterval(tick, speed);
    }
    return () => {
      if (dropTimer.current) clearInterval(dropTimer.current);
    };
  }, [state, currentConfig.speed, fastDrop]);

  // Keep refs for tick loop to avoid re-triggering the interval effect
  const stateRef = useRef(state);
  const clearingRowsRef = useRef(clearingRows);
  const dropPlayerRef = useRef(dropPlayer);

  useEffect(() => {
    stateRef.current = state;
    clearingRowsRef.current = clearingRows;
    dropPlayerRef.current = dropPlayer;
  }, [state, clearingRows, dropPlayer]);

  // Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow taking action only when PLAYING
      if (state !== 'PLAYING') return;
      audio.init(); 
      switch (e.code) {
        case 'ArrowLeft': 
        case 'KeyA': 
          movePlayer(-1); break;
        case 'ArrowRight': 
        case 'KeyD': 
          movePlayer(1); break;
        case 'ArrowDown': 
        case 'KeyS': 
          if (!e.repeat) setFastDrop(true); 
          break;
        case 'ArrowUp': 
        case 'KeyW': 
          rotatePlayer(); break;
        case 'Space': 
          dropPlayer(true); break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        setFastDrop(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [state, movePlayer, dropPlayer, rotatePlayer]);

  return {
    level, state, grid, activeShape, activeType, pos, score, linesCleared, clearingRows,
    initGame, movePlayer, dropPlayer, rotatePlayer, currentConfig, setLevel, setState
  };
};
