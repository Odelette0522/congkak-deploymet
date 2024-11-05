import { useState } from "react";
import "./WelcomePage.css";
import { useNavigate } from "react-router-dom";
import logoImageUrl from "./assets/congkak logo.jpg";

function Play() {
  const navigate = useNavigate();
  const startGame = () => {
    navigate("/congkak");
  };
  return (
    <button type="button" className="start-game-button" onClick={startGame}>
      START GAME
    </button>
  );
}

function RenderPopup({ handlePopup }: { handlePopup: () => void }) {
  return (
    <div className="main-container">
      <div className="popup-container">
        <button type="button" className="close-button" onClick={handlePopup}>
          X
        </button>

        <div className="rule-container">
          <h2 className="heading-two">How To Play</h2>
          <ol>
            <li>
              Starting the Game:
              <br />
              <span>Players take turns. Choose a pit on your side and pick up all the marbles from it.</span>
            </li>

            <li>
              Moving Marbles:
              <br />
              <span>
                Move counterclockwise, placing one marble in each pit, including your storehouse, but skip your
                opponent&#39;s storehouse. If your last marble stop at a non-empty pits, take all the marble in the
                corresponding pit and continue the distribution until your marble stop at an empty pit.
              </span>
            </li>

            <li>
              Landing in Your Storehouse:
              <br />
              <span>If your last marble lands in your storehouse, you get an extra turn.</span>
            </li>

            <li>
              Landing in an Empty Pit:
              <br />
              <span>
                If your last marble lands in an empty pit on your side, capture all the marbles from the opposite pit
                and put them in your storehouse.
              </span>
            </li>

            <li>
              Ending Your Turn:
              <br />
              <span>
                Your turn ends after placing all marbles and making any captures. Your opponent will then play.
              </span>
            </li>
          </ol>
          <br />
          <p>
            <strong>Winning the Game</strong>
            <br />
            The game ends when all small pits on one side are empty, or no more moves can be made. The player with the
            most marbles in their storehouse wins.
          </p>
          <br />
          <iframe
            src="https://www.youtube.com/embed/pxT4BbsdybY?si=koIOMLl_ZS6XPJXw&amp;start=31"
            title="game instruction"
          />
          <br />
          <p>Enjoy the game!</p>
        </div>
      </div>
    </div>
  );
}

function Rule() {
  const [hasPopup, setHasPopup] = useState(false);

  const handlePopup = () => {
    setHasPopup(!hasPopup);
  };

  return (
    <>
      <button type="button" className="show-rule-button" onClick={handlePopup}>
        HOW TO PLAY
      </button>
      {hasPopup && <RenderPopup handlePopup={handlePopup} />}
    </>
  );
}

export default function WelcomePage() {
  return (
    <div className="welcome-container">
      <img src={logoImageUrl} alt="congkak logo" />
      <h1>CONGKAK GAME</h1>
      <div className="wrap-button welcome-button">
        <div className="button-container">
          <Play />
        </div>
        <div className="button-container">
          <Rule />
        </div>
      </div>
    </div>
  );
}
