import { useCallback, useEffect, useState } from "react";
import "./Game.css";
import DisplayWinner from "./DisplayWinner";

const NUM_OF_PITS = 7;
const STARTING_MARBLE_COUNT = 7;
enum Side {
  Player = "Player",
  Computer = "Computer",
}

export default function Game() {
  const [turn, setTurn] = useState(Side.Player);
  const [winnerMessage, setWinnerMessage] = useState<string | undefined>();
  const [marblesLeftInHand, setMarblesLeftInHand] = useState(0);
  const [isProcessingMovement, setIsProcessingMovement] = useState(false);
  const [pitIndex, setPitIndex] = useState(0);
  const [currentAddingSide, setCurrentAddingSide] = useState<Side>(Side.Player);
  const [computerStorehouseMarble, setComputerStorehouseMarble] = useState(0);
  const [playerStorehouseMarble, setPlayerStorehouseMarble] = useState(0);
  const [computerMarblePit, setComputerMarblePit] = useState<number[]>(Array(NUM_OF_PITS).fill(STARTING_MARBLE_COUNT));
  const [playerMarblePit, setPlayerMarblePit] = useState<number[]>(Array(NUM_OF_PITS).fill(STARTING_MARBLE_COUNT));
  const handlePitClick = (marble: number, index: number) => {
    if (turn === Side.Player && !isProcessingMovement) {
      setPlayerMarblePit((oldMarbleCount) => {
        const newMarbleCount = [...oldMarbleCount];
        newMarbleCount[index] = 0;
        return newMarbleCount;
      });
      setMarblesLeftInHand(marble);
      setPitIndex(index);
      setCurrentAddingSide(Side.Player);
      setIsProcessingMovement(true);
    }
  };
  const calculateWinner = useCallback(() => {
    if (playerStorehouseMarble > computerStorehouseMarble) {
      setWinnerMessage("You Win !");
    } else if (playerStorehouseMarble < computerStorehouseMarble) {
      setWinnerMessage("Computer Win !");
    } else {
      setWinnerMessage("Draw !");
    }
  }, [computerStorehouseMarble, playerStorehouseMarble]);

  const invokeComputerMovement = useCallback(() => {
    let index: number | undefined;
    let largest = 0;
    for (let i = NUM_OF_PITS - 1; i >= 0; i -= 1) {
      if (computerMarblePit[i] === NUM_OF_PITS - i) {
        index = i;
        break;
      } else if (computerMarblePit[i] > largest) {
        largest = computerMarblePit[i];
        index = i;
      }
    }
    if (index === undefined) {
      throw new Error("Index is undefined!");
    }
    setMarblesLeftInHand(computerMarblePit[index]);
    setComputerMarblePit((oldMarbleCount) => {
      const newMarbleCount = [...oldMarbleCount];
      newMarbleCount[index] = 0;
      return newMarbleCount;
    });
    setPitIndex(index);
    setCurrentAddingSide(Side.Computer);
    setTurn(Side.Computer);
  }, [computerMarblePit]);

  const setValidTurn = useCallback(
    (nextTurn: Side, playerMarblePitNotAllZero: boolean, computerMarblePitNotAllZero: boolean) => {
      const nextTurnMarblePitNotAllZero =
        nextTurn === Side.Player ? playerMarblePitNotAllZero : computerMarblePitNotAllZero;
      if (nextTurnMarblePitNotAllZero) {
        if (nextTurn === Side.Player) {
          setTurn(Side.Player);
          setIsProcessingMovement(false);
        } else {
          setTimeout(invokeComputerMovement, 500);
        }
      } else if (playerMarblePitNotAllZero) {
        // if nextTurn is computer but computer marble pit is all 0, so check on the validity to give turn to player
        setTurn(Side.Player);
        setIsProcessingMovement(false);
      } else if (computerMarblePitNotAllZero) {
        // if nextTurn is player but player marble pit is all 0, so check on the validity to give turn to computer
        setTimeout(invokeComputerMovement, 500);
      }
    },
    [invokeComputerMovement]
  );

  const captureMarble = useCallback(
    (index: number, oppositeMarbleCount: number) => {
      const setOppositeMarblePit = turn === Side.Player ? setComputerMarblePit : setPlayerMarblePit;
      const setOwnMarblePit = turn === Side.Player ? setPlayerMarblePit : setComputerMarblePit;
      const setOwnStorehouseMarble = turn === Side.Player ? setPlayerStorehouseMarble : setComputerStorehouseMarble;
      const addToStorehouseMarbleCount = oppositeMarbleCount + 1;
      setOwnMarblePit((oldMarbleCount) => {
        const newMarbleCount = [...oldMarbleCount];
        newMarbleCount[index] = 0;
        return newMarbleCount;
      });
      setOppositeMarblePit((oldMarbleCount) => {
        const newMarbleCount = [...oldMarbleCount];
        newMarbleCount[NUM_OF_PITS - 1 - index] = 0;
        return newMarbleCount;
      });
      setOwnStorehouseMarble((oldMarbleCount) => oldMarbleCount + addToStorehouseMarbleCount);
    },
    [turn]
  );

  const handleNewGameClick = () => {
    setWinnerMessage(undefined);
    setTurn(Side.Player);
    setPlayerStorehouseMarble(0);
    setComputerStorehouseMarble(0);
    setPlayerMarblePit(Array(NUM_OF_PITS).fill(STARTING_MARBLE_COUNT));
    setComputerMarblePit(Array(NUM_OF_PITS).fill(STARTING_MARBLE_COUNT));
    setIsProcessingMovement(false);
  };

  useEffect(() => {
    const currentList = currentAddingSide === Side.Player ? playerMarblePit : computerMarblePit;
    const setCurrentList = currentAddingSide === Side.Player ? setPlayerMarblePit : setComputerMarblePit;
    const setCurrentStorehouseMarble = turn === Side.Player ? setPlayerStorehouseMarble : setComputerStorehouseMarble;
    const oppositeList = currentAddingSide === Side.Player ? Side.Computer : Side.Player;
    const opponent = turn === Side.Player ? Side.Computer : Side.Player;
    const oppositeMarblePit = turn === Side.Player ? computerMarblePit : playerMarblePit;
    const playerMarblePitNotAllZero = playerMarblePit.some((marbleCount) => marbleCount !== 0);
    const computerMarblePitNotAllZero = computerMarblePit.some((marbleCount) => marbleCount !== 0);
    if (!isProcessingMovement) return;
    if (!playerMarblePitNotAllZero && !computerMarblePitNotAllZero && marblesLeftInHand === 0) {
      calculateWinner();
    }
    if (marblesLeftInHand > 0) {
      setTimeout(() => {
        if (pitIndex + 1 < NUM_OF_PITS) {
          setCurrentList((oldMarbleCount) => {
            const newMarbleCount = [...oldMarbleCount];
            newMarbleCount[pitIndex + 1] = newMarbleCount[pitIndex + 1] + 1;
            return newMarbleCount;
          });
          setPitIndex((index) => index + 1);
          setMarblesLeftInHand((prev) => prev - 1);
        } else if (currentAddingSide === turn) {
          // To determine whether to add marble to current storehouse or to skip
          setCurrentStorehouseMarble((prev) => prev + 1);
          setMarblesLeftInHand((prev) => prev - 1); // use the if statement to escape the undefined error;
          setPitIndex(-1); // set to -1 to make sure that next time +1 will be 0;
          setCurrentAddingSide(oppositeList);
        } else {
          setPitIndex(-1);
          setCurrentAddingSide(oppositeList);
        }
      }, 500);
    } else if (currentList[pitIndex] > 1) {
      setTimeout(() => {
        setCurrentList((oldMarbleCount) => {
          const newMarbleCount = [...oldMarbleCount];
          newMarbleCount[pitIndex] = 0;
          return newMarbleCount;
        });
        setMarblesLeftInHand(currentList[pitIndex]);
      }, 300);
    } else if (marblesLeftInHand === 0 && pitIndex === -1) {
      // if stop at store house
      setValidTurn(turn, playerMarblePitNotAllZero, computerMarblePitNotAllZero); // should continue current turn if valid
    } else {
      // stop at an empty pit
      const oppositeMarbleCount = oppositeMarblePit[NUM_OF_PITS - 1 - pitIndex];
      if (currentAddingSide === turn && oppositeMarbleCount !== 0) {
        captureMarble(pitIndex, oppositeMarbleCount);
      } else {
        setValidTurn(opponent, playerMarblePitNotAllZero, computerMarblePitNotAllZero);
      }
    }
  }, [
    calculateWinner,
    captureMarble,
    computerMarblePit,
    computerStorehouseMarble,
    currentAddingSide,
    invokeComputerMovement,
    isProcessingMovement,
    marblesLeftInHand,
    pitIndex,
    playerMarblePit,
    playerStorehouseMarble,
    setValidTurn,
    turn,
  ]);

  return (
    <>
      <div className="congkak-layer">
        <h2 className="heading-two">{turn}&apos;s turn</h2>
        <div className="pits-container">
          <div className="storehouse-container">
            <div className="player-storehouse">{playerStorehouseMarble}</div>
          </div>
          <div>
            <div className="opponent-pits">
              {computerMarblePit.map((marble, index) => (
                <div className="opponent-marble" key={`pit${index + 1}`}>
                  {marble}
                </div>
              ))}
            </div>
            <div className="player-pits">
              {playerMarblePit.map((marble, index) => (
                <button
                  type="button"
                  className="player-button"
                  key={`pit${index + 1}`}
                  onClick={() => handlePitClick(marble, index)}
                  style={{ cursor: marble === 0 || isProcessingMovement ? "default" : "pointer" }}
                  disabled={marble === 0 || isProcessingMovement}
                >
                  {marble}
                </button>
              ))}
            </div>
          </div>
          <div className="storehouse-container">
            <div className="opponent-storehouse">{computerStorehouseMarble}</div>
          </div>
        </div>
      </div>
      {winnerMessage && <DisplayWinner winnerMessage={winnerMessage} handleNewGameClick={handleNewGameClick} />}
    </>
  );
}
