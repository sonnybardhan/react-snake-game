import React, { useRef, useEffect } from 'react';

export default function() {
	return {
		saveBestScore(setBestScore, score) {
			setBestScore((prev) => (score > prev ? score : prev));
		},
		outOfBounds({ x, y }) {
			return x < 0 || x > 15 || y < 0 || y > 15;
		},
		selfCollision({ x, y }, snake) {
			for (let segment of snake) {
				if (segment.x === x && segment.y === y) {
					return true;
				}
			}
			return false;
		},
		getScoreFromLS(key) {
			const storage = localStorage.getItem(key);
			if (storage) return JSON.parse(storage).score;
			return 0;
		},
		saveScoreInLS(key, bestScore) {
			localStorage.setItem(key, JSON.stringify({ score: bestScore }));
		},
		placeSnake(grid, snake) {
			snake.forEach(({ x, y }) => {
				grid[x][y] = <div className="snake-segment" key={Math.random()} />;
			});
		},
		placeFood(grid, food) {
			grid[food.x][food.y] = <div className="food" key={Math.random()} />;
		},
		init() {
			const grid = [];
			for (let i = 0; i < 16; i++) {
				grid[i] = [];
				for (let j = 0; j < 16; j++) {
					grid[i][j] = <div className="grid-block" key={Math.random()} />;
				}
			}
			return grid;
		},
		randomPosition() {
			return {
				x: Math.floor(Math.random() * 16),
				y: Math.floor(Math.random() * 16)
			};
		},
		nextPosition(direction, snake) {
			const newHead = { ...snake[0] };
			switch (direction) {
				case 'right':
					newHead.y += 1;
					break;
				case 'left':
					newHead.y -= 1;
					break;
				case 'up':
					newHead.x -= 1;
					break;
				case 'down':
					newHead.x += 1;
					break;
				default:
					break;
			}
			return newHead;
		},
		useAnimation(cb, fps, isPlaying) {
			const cbRef = useRef();
			const animationFrameId = useRef();
			const then = useRef(window.performance.now());
			const now = useRef();
			const elapsed = useRef();
			const fpsInterval = useRef(1000 / fps);
			useEffect(
				() => {
					cbRef.current = cb;
				},
				[ cb ]
			);
			useEffect(
				() => {
					function loop() {
						animationFrameId.current = window.requestAnimationFrame(loop);
						now.current = window.performance.now();
						elapsed.current = now.current - then.current;
						if (elapsed.current > fpsInterval.current) {
							then.current = now.current - elapsed.current % fpsInterval.current;
							cbRef.current();
						}
					}
					if (isPlaying) {
						animationFrameId.current = window.requestAnimationFrame(loop);
						return () => {
							window.cancelAnimationFrame(animationFrameId.current);
						};
					}
				},
				[ isPlaying ]
			);
		}
	};
}
