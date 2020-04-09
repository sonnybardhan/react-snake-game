import React, { useState, useEffect } from 'react';
import Utilities from './utilities/Utilities';

const {
	saveBestScore,
	outOfBounds,
	selfCollision,
	getScoreFromLS,
	saveScoreInLS,
	placeSnake,
	placeFood,
	init,
	randomPosition,
	nextPosition,
	useAnimation
} = Utilities();

const Map = () => {
	const initialMap = init();
	const initialSnake = [ { x: 3, y: 3 }, { x: 3, y: 2 }, { x: 3, y: 1 } ];
	const initialDirection = 'right';
	const key = 'snakeGame';
	const initialFps = 7;
	const [ score, setScore ] = useState(0);
	const [ rows, setRows ] = useState(initialMap);
	const [ snake, setSnake ] = useState(initialSnake);
	const [ direction, setDirection ] = useState(initialDirection);
	const [ food, setFood ] = useState(randomPosition);
	const [ fps, setFps ] = useState(initialFps);
	const [ gameRunning, setGameRunning ] = useState(false);
	const [ bestScore, setBestScore ] = useState(getScoreFromLS(key));
	const [ message, setMessage ] = useState('');
	const [ started, setStarted ] = useState(false);

	useEffect(
		() => {
			if (bestScore) {
				saveScoreInLS(key, bestScore);
			}
		},
		[ bestScore ]
	);

	useEffect(
		() => {
			document.addEventListener('keydown', keyboardInput);
			return () => {
				document.removeEventListener('keydown', keyboardInput);
			};
		},
		[ direction ]
	);

	function keyboardInput({ keyCode }) {
		switch (keyCode) {
			case 27: //escape
				return gameReset();
			case 32: //space
				return setGameRunning((prevState) => {
					if (!started) {
						setStarted(true);
						setDirection('right');
					}
					return !prevState;
				});
			case 37: //left
				if (direction !== 'right') return setDirection('left');
				break;
			case 38: //up
				if (direction !== 'down') return setDirection('up');
				break;
			case 39: //right
				if (direction !== 'left') return setDirection('right');
				break;
			case 40: //down
				if (direction !== 'up') return setDirection('down');
				break;
			default:
				break;
		}
	}

	const repositionSnake = () => {
		const newHead = nextPosition(direction, snake);
		const newSnake = [ newHead, ...snake ];
		if (outOfBounds(newHead) || selfCollision(newHead, snake)) return onCrash();
		if (newHead.x === food.x && newHead.y === food.y) onEat();
		else newSnake.pop();
		setUpFrame(newSnake);
	};

	function onEat() {
		setScore(score + 5);
		setFood(randomPosition);
		setFps((prevFps) => (score % 10 === 0 ? prevFps + 1 : prevFps));
	}

	function setUpFrame(newSnake) {
		setSnake(newSnake);
		placeSnake(initialMap, snake);
		placeFood(initialMap, food);
		setRows(initialMap);
	}

	function onCrash() {
		setStarted(false);
		saveBestScore(setBestScore, score);
		setMessage(score);
		return gameReset();
	}

	function gameReset() {
		setMessage(score);
		setScore(0);
		setRows(init);
		setSnake(initialSnake);
		setDirection('right');
		setFood(randomPosition);
		setStarted(false);
		setFps(initialFps);
		setGameRunning(false);
	}

	useAnimation(repositionSnake, fps, gameRunning);

	return (
		<div className="">
			<h1 style={{ textAlign: 'center' }}>Snake!</h1>
			<h2>
				<span>{gameRunning ? `Score: ${score}` : null}</span>
			</h2>
			<div className="main-map">
				{gameRunning ? (
					rows
				) : (
					<div>
						<h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>
							{message && !started ? 'Game over!' : null}
						</h1>
						<h2 style={{ textAlign: 'center' }}>
							{message && !started ? `You scored ${0 || message}` : null}
						</h2>
						<h2 style={{ textAlign: 'center' }}>PRESS SPACEBAR TO {started ? 'RESUME' : 'PLAY'}</h2>
					</div>
				)}
			</div>
			<h2 style={{ textAlign: 'right' }}>
				<span>Best: {bestScore ? `${bestScore}` : 0}</span>
			</h2>
		</div>
	);
};

export default Map;
