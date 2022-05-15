import { Link } from "react-router-dom";
import { getImageUrl } from "../Filters/FilterForm";
import { PlayerBuildDisplay } from "./Match";
import { normalizeRank } from "./MatchHelpers";
import { IPlayer } from "./MatchInterface";
import PlayerCarryScore from "./PlayerCarryScore";

function PlayerIcon(props: any) {
  return (
    <div
      className="rt-tr god"
      style={{
        minWidth: "155px",
        maxWidth: "160px",
        flex: "1 1 100%",
        display: "flex",
        alignContent: "center",
      }}
    >
      <Link
        className="player-god-played"
        to={"/".concat(props.god.replaceAll(" ", "_"))}
      >
        <div style={{ position: "relative", minWidth: "40px" }}>
          <div className="god-icon">
            <div style={{ height: "48px", width: "48px" }}>
              <img
                src={`https://webcdn.hirezstudios.com/smite/god-icons/${props.god
                  .replaceAll(" ", "-")
                  .replaceAll("'", "")
                  .toLowerCase()}.jpg`}
                alt={props.god}
                style={{
                  height: "48px",
                  width: "48px",
                  transformOrigin: "0px 0px 0px",
                  border: "2px solid black",
                  borderRadius: "5px",
                }}
              />
            </div>
          </div>
        </div>
        <strong className="god-name" style={{ marginLeft: ".75rem" }}>
          {props.god}
        </strong>
      </Link>
    </div>
  );
}

export default function PlayerMatchDisplay({ player }: { player: IPlayer }) {
  return (
    <>
      <div className="player-display-container ">
        <div className="player-display_mini show">
          <div className="player-display_row">
            <div className="item-image-div">
              <img
                src={getImageUrl(
                  normalizeRank(player.Conquest_Tier),
                  player.Mode
                )}
                alt={normalizeRank(player.Conquest_Tier)}
                style={{ minWidth: "32px", minHeight: "32px" }}
              />
            </div>
          </div>
          <div className="player-display_row">
            <Link
              className="player-god-played"
              to={"/".concat(player.godName.replaceAll(" ", "_"))}
            >
              <div style={{ position: "relative", minWidth: "24px" }}>
                <div className="header_champion" style={{ marginLeft: "0px" }}>
                  <div className="champion-image-container">
                    <img
                      className="champion-image"
                      src={`https://webcdn.hirezstudios.com/smite/god-icons/${player.godName
                        .replaceAll("'", "")
                        .replaceAll("_", "-")
                        .replaceAll(" ", "-")
                        .toLowerCase()}.jpg`}
                    />
                  </div>
                  <div
                    className={
                      player.Mode === "Conquest"
                        ? "role-icon-container_small"
                        : "hide-element "
                    }
                  >
                    <img
                      src={getImageUrl(player.Role)}
                      style={{ width: "14px", height: "14px" }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div
          className="item-image hide"
          style={{ minWidth: "100px", alignSelf: "center" }}
        >
          <div className="item-image-div">
            <img
              src={getImageUrl(
                normalizeRank(player.Conquest_Tier),
                player.Mode
              )}
              alt={normalizeRank(player.Conquest_Tier)}
              style={{ minWidth: "64px", minHeight: "64px" }}
            />
          </div>
        </div>
        <div className="hide player-display-winstat">
          <PlayerIcon god={player.godName} />
        </div>
        <div
          className={
            player.Mode === "Conquest" ? "role-icon-container" : "hide-element"
          }
          style={{
            minWidth: "100px",
            alignSelf: "center",
            backgroundColor: "#11112a",
            borderRadius: "6px",
          }}
        >
          <div className="drop-down_icon">
            <div style={{ position: "relative", textAlign: "center" }}>
              <div className="god-icon">
                <div
                  style={{
                    height: "30px",
                    width: "30px",
                  }}
                >
                  <img
                    src={getImageUrl(player.Role)}
                    alt={player.Role.replaceAll("_", " ")}
                    style={{
                      height: "48px",
                      width: "48px",
                      transform: "scale(0.625)",
                      transformOrigin: "0px 0px 0px",
                    }}
                  />
                </div>
              </div>
            </div>
            <strong className="god-name">
              {player.Role.replaceAll("_", " ")}
            </strong>
          </div>
        </div>
      </div>
      <PlayerBuildDisplay player={player} />
      <div className="player-padding_header hide">
        <PlayerCarryScore player={player} />
      </div>
      <div className="player-display-winstat hide">
        <p>{player.Win_Status}</p>
      </div>
    </>
  );
}
