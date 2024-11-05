import "./DisplayWinner.css";
import { useNavigate } from "react-router-dom";

export default function DisplayWinner({
  winnerMessage,
  handleNewGameClick,
}: {
  winnerMessage: string | undefined;
  handleNewGameClick: () => void;
}) {
  const navigate = useNavigate();
  const handleExitClick = () => {
    navigate("/");
  };

  return (
    <div className="main-container shade-layer">
      <div className="display-winner-popup">
        <p className="winner-message">{winnerMessage}</p>
        <div className="wrap-button winner-button-container">
          <button type="button" className="display-winner-button" onClick={handleNewGameClick}>
            New Game
          </button>
          <button type="button" className="display-winner-button" onClick={handleExitClick}>
            Exit Game
          </button>
        </div>
      </div>
    </div>
  );
}
