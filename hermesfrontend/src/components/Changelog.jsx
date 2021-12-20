import InfiniteScroll from "react-infinite-scroll-component";

export default function ChangeLog(props) {
    return (
        <>
        <InfiniteScroll
        className="toughest-matchups content-section test_page"
        dataLength={1}
        height={400}
        style={{
            maxWidth: "512px",
            marginTop: "24px",
            backgroundColor: "#191937D9"
        }}
        >
            <div className="content-section_header">
              ChangeLog&nbsp;
              <span style={{color: "#5f5f7b", fontSize: "14px", fontWeight: "400"}}>SmiteStats Change Log</span>
          </div>
            <ul>
                <li>
                    12/13/2021: SMITESTATS BOT ADDED IN R/SMITE DISCORD!!!!!
                </li>
                <li>
                    12/13/2021: Added Win Rate Colors in Matchups Tierlist in God Pages
                </li>
                <li>
                    12/13/2021: Fixed Duo Lane Tierlist
                </li>
                <li>
                    12/4/2021: Added Hover Effect on Regular Tier List in Counter Matchups to Show Win Rates
                </li>
                <li>
                    12/4/2021: Added Advanced Matchup Breakdowns in "Matchups" Tab on God Pages
                </li>
                <li>
                    12/4/2021: Updated Home Page, Added Changelog
                </li>
                <li>
                    12/4/2021: Fixed an Issue on the "Items" Tab in Cliodhna's God Page
                </li>
            </ul>
        </InfiniteScroll>
        </>
    )
}