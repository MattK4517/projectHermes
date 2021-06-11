import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Navigation, Godpage, Gods } from "./components";
import { useSelector } from "react-redux";

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Switch>
          <Route
            path={"/Gods"}
            exact
            component={() => <Gods />}
          />
          <Route
            path={"/Achilles"}
            exact
            component={() => <Godpage god={"Achilles"} />}
          />
          <Route
            path={"/Agni"}
            exact
            component={() => <Godpage god={"Agni"} />}
          />
          <Route
            path={"/Ah_Muzen_Cab"}
            exact
            component={() => <Godpage god={"Ah_Muzen_Cab"} />}
          />
          <Route
            path={"/Ah_Puch"}
            exact
            component={() => <Godpage god={"Ah_Puch"} />}
          />
          <Route
            path={"/Amaterasu"}
            exact
            component={() => <Godpage god={"Amaterasu"} />}
          />
          <Route
            path={"/Anhur"}
            exact
            component={() => <Godpage god={"Anhur"} />}
          />
          <Route
            path={"/Anubis"}
            exact
            component={() => <Godpage god={"Anubis"} />}
          />
          <Route
            path={"/Ao_Kuang"}
            exact
            component={() => <Godpage god={"Ao_Kuang"} />}
          />
          <Route
            path={"/Aphrodite"}
            exact
            component={() => <Godpage god={"Aphrodite"} />}
          />
          <Route
            path={"/Apollo"}
            exact
            component={() => <Godpage god={"Apollo"} />}
          />
          <Route
            path={"/Arachne"}
            exact
            component={() => <Godpage god={"Arachne"} />}
          />
          <Route
            path={"/Ares"}
            exact
            component={() => <Godpage god={"Ares"} />}
          />
          <Route
            path={"/Artemis"}
            exact
            component={() => <Godpage god={"Artemis"} />}
          />
          <Route
            path={"/Artio"}
            exact
            component={() => <Godpage god={"Artio"} />}
          />
          <Route
            path={"/Athena"}
            exact
            component={() => <Godpage god={"Athena"} />}
          />
          <Route
            path={"/Awilix"}
            exact
            component={() => <Godpage god={"Awilix"} />}
          />
          <Route
            path={"/Baba_Yaga"}
            exact
            component={() => <Godpage god={"Baba_Yaga"} />}
          />
          <Route
            path={"/Bacchus"}
            exact
            component={() => <Godpage god={"Bacchus"} />}
          />
          <Route
            path={"/Bakasura"}
            exact
            component={() => <Godpage god={"Bakasura"} />}
          />
          <Route
            path={"/Baron_Samedi"}
            exact
            component={() => <Godpage god={"Baron_Samedi"} />}
          />
          <Route
            path={"/Bastet"}
            exact
            component={() => <Godpage god={"Bastet"} />}
          />
          <Route
            path={"/Bellona"}
            exact
            component={() => <Godpage god={"Bellona"} />}
          />
          <Route
            path={"/Cabrakan"}
            exact
            component={() => <Godpage god={"Cabrakan"} />}
          />
          <Route
            path={"/Camazotz"}
            exact
            component={() => <Godpage god={"Camazotz"} />}
          />
          <Route
            path={"/Cerberus"}
            exact
            component={() => <Godpage god={"Cerberus"} />}
          />
          <Route
            path={"/Cernunnos"}
            exact
            component={() => <Godpage god={"Cernunnos"} />}
          />
          <Route
            path={"/Chaac"}
            exact
            component={() => <Godpage god={"Chaac"} />}
          />
          <Route
            path={"/Chang'e"}
            exact
            component={() => <Godpage god={"Chang'e"} />}
          />
          <Route
            path={"/Chernobog"}
            exact
            component={() => <Godpage god={"Chernobog"} />}
          />
          <Route
            path={"/Chiron"}
            exact
            component={() => <Godpage god={"Chiron"} />}
          />
          <Route
            path={"/Chronos"}
            exact
            component={() => <Godpage god={"Chronos"} />}
          />
          <Route
            path={"/Cthulhu"}
            exact
            component={() => <Godpage god={"Cthulhu"} />}
          />
          <Route
            path={"/Cu_Chulainn"}
            exact
            component={() => <Godpage god={"Cu_Chulainn"} />}
          />
          <Route
            path={"/Cupid"}
            exact
            component={() => <Godpage god={"Cupid"} />}
          />
          <Route
            path={"/Da_Ji"}
            exact
            component={() => <Godpage god={"Da_Ji"} />}
          />
          <Route
            path={"/Danzaburou"}
            exact
            component={() => <Godpage god={"Danzaburou"} />}
          />
          <Route
            path={"/Discordia"}
            exact
            component={() => <Godpage god={"Discordia"} />}
          />
          <Route
            path={"/Erlang_Shen"}
            exact
            component={() => <Godpage god={"Erlang_Shen"} />}
          />
          <Route
            path={"/Eset"}
            exact
            component={() => <Godpage god={"Eset"} />}
          />
          <Route
            path={"/Fafnir"}
            exact
            component={() => <Godpage god={"Fafnir"} />}
          />
          <Route
            path={"/Fenrir"}
            exact
            component={() => <Godpage god={"Fenrir"} />}
          />
          <Route
            path={"/Freya"}
            exact
            component={() => <Godpage god={"Freya"} />}
          />
          <Route
            path={"/Ganesha"}
            exact
            component={() => <Godpage god={"Ganesha"} />}
          />
          <Route
            path={"/Geb"}
            exact
            component={() => <Godpage god={"Geb"} />}
          />
          <Route
            path={"/Guan_Yu"}
            exact
            component={() => <Godpage god={"Guan_Yu"} />}
          />
          <Route
            path={"/Hachiman"}
            exact
            component={() => <Godpage god={"Hachiman"} />}
          />
          <Route
            path={"/Hades"}
            exact
            component={() => <Godpage god={"Hades"} />}
          />
          <Route
            path={"/He_Bo"}
            exact
            component={() => <Godpage god={"He_Bo"} />}
          />
          <Route
            path={"/Heimdallr"}
            exact
            component={() => <Godpage god={"Heimdallr"} />}
          />
          <Route
            path={"/Hel"}
            exact
            component={() => <Godpage god={"Hel"} />}
          />
          <Route
            path={"/Hera"}
            exact
            component={() => <Godpage god={"Hera"} />}
          />
          <Route
            path={"/Hercules"}
            exact
            component={() => <Godpage god={"Hercules"} />}
          />
          <Route
            path={"/Horus"}
            exact
            component={() => <Godpage god={"Horus"} />}
          />
          <Route
            path={"/Hou_Yi"}
            exact
            component={() => <Godpage god={"Hou_Yi"} />}
          />
          <Route
            path={"/Hun_Batz"}
            exact
            component={() => <Godpage god={"Hun_Batz"} />}
          />
          <Route
            path={"/Izanami"}
            exact
            component={() => <Godpage god={"Izanami"} />}
          />
          <Route
            path={"/Janus"}
            exact
            component={() => <Godpage god={"Janus"} />}
          />
          <Route
            path={"/Jing_Wei"}
            exact
            component={() => <Godpage god={"Jing_Wei"} />}
          />
          <Route
            path={"/Jormungandr"}
            exact
            component={() => <Godpage god={"Jormungandr"} />}
          />
          <Route
            path={"/Kali"}
            exact
            component={() => <Godpage god={"Kali"} />}
          />
          <Route
            path={"/Khepri"}
            exact
            component={() => <Godpage god={"Khepri"} />}
          />
          <Route
            path={"/King_Arthur"}
            exact
            component={() => <Godpage god={"King_Arthur"} />}
          />
          <Route
            path={"/Kukulkan"}
            exact
            component={() => <Godpage god={"Kukulkan"} />}
          />
          <Route
            path={"/Kumbhakarna"}
            exact
            component={() => <Godpage god={"Kumbhakarna"} />}
          />
          <Route
            path={"/Kuzenbo"}
            exact
            component={() => <Godpage god={"Kuzenbo"} />}
          />
          <Route
            path={"/Loki"}
            exact
            component={() => <Godpage god={"Loki"} />}
          />
          <Route
            path={"/Medusa"}
            exact
            component={() => <Godpage god={"Medusa"} />}
          />
          <Route
            path={"/Mercury"}
            exact
            component={() => <Godpage god={"Mercury"} />}
          />
          <Route
            path={"/Merlin"}
            exact
            component={() => <Godpage god={"Merlin"} />}
          />
          <Route
            path={"/Mulan"}
            exact
            component={() => <Godpage god={"Mulan"} />}
          />
          <Route
            path={"/Ne_Zha"}
            exact
            component={() => <Godpage god={"Ne_Zha"} />}
          />
          <Route
            path={"/Neith"}
            exact
            component={() => <Godpage god={"Neith"} />}
          />
          <Route
            path={"/Nemesis"}
            exact
            component={() => <Godpage god={"Nemesis"} />}
          />
          <Route
            path={"/Nike"}
            exact
            component={() => <Godpage god={"Nike"} />}
          />
          <Route
            path={"/Nox"}
            exact
            component={() => <Godpage god={"Nox"} />}
          />
          <Route
            path={"/Nu_Wa"}
            exact
            component={() => <Godpage god={"Nu_Wa"} />}
          />
          <Route
            path={"/Odin"}
            exact
            component={() => <Godpage god={"Odin"} />}
          />
          <Route
            path={"/Olorun"}
            exact
            component={() => <Godpage god={"Olorun"} />}
          />
          <Route
            path={"/Osiris"}
            exact
            component={() => <Godpage god={"Osiris"} />}
          />
          <Route
            path={"/Pele"}
            exact
            component={() => <Godpage god={"Pele"} />}
          />
          <Route
            path={"/Persephone"}
            exact
            component={() => <Godpage god={"Persephone"} />}
          />
          <Route
            path={"/Poseidon"}
            exact
            component={() => <Godpage god={"Poseidon"} />}
          />
          <Route path={"/Ra"} exact component={() => <Godpage god={"Ra"} />} />
          <Route
            path={"/Raijin"}
            exact
            component={() => <Godpage god={"Raijin"} />}
          />
          <Route
            path={"/Rama"}
            exact
            component={() => <Godpage god={"Rama"} />}
          />
          <Route
            path={"/Ratatoskr"}
            exact
            component={() => <Godpage god={"Ratatoskr"} />}
          />
          <Route
            path={"/Ravana"}
            exact
            component={() => <Godpage god={"Ravana"} />}
          />
          <Route
            path={"/Scylla"}
            exact
            component={() => <Godpage god={"Scylla"} />}
          />
          <Route
            path={"/Serqet"}
            exact
            component={() => <Godpage god={"Serqet"} />}
          />
          <Route
            path={"/Set"}
            exact
            component={() => <Godpage god={"Set"} />}
          />
          <Route
            path={"/Skadi"}
            exact
            component={() => <Godpage god={"Skadi"} />}
          />
          <Route
            path={"/Sobek"}
            exact
            component={() => <Godpage god={"Sobek"} />}
          />
          <Route
            path={"/Sol"}
            exact
            component={() => <Godpage god={"Sol"} />}
          />
          <Route
            path={"/Sun_Wukong"}
            exact
            component={() => <Godpage god={"Sun_Wukong"} />}
          />
          <Route
            path={"/Susano"}
            exact
            component={() => <Godpage god={"Susano"} />}
          />
          <Route
            path={"/Sylvanus"}
            exact
            component={() => <Godpage god={"Sylvanus"} />}
          />
          <Route
            path={"/Terra"}
            exact
            component={() => <Godpage god={"Terra"} />}
          />
          <Route
            path={"/Thanatos"}
            exact
            component={() => <Godpage god={"Thanatos"} />}
          />
          <Route
            path={"/The_Morrigan"}
            exact
            component={() => <Godpage god={"The_Morrigan"} />}
          />
          <Route
            path={"/Thor"}
            exact
            component={() => <Godpage god={"Thor"} />}
          />
          <Route
            path={"/Thoth"}
            exact
            component={() => <Godpage god={"Thoth"} />}
          />
          <Route
            path={"/Tiamat"}
            exact
            component={() => <Godpage god={"Tiamat"} />}
          />
          <Route
            path={"/Tsukuyomi"}
            exact
            component={() => <Godpage god={"Tsukuyomi"} />}
          />
          <Route
            path={"/Tyr"}
            exact
            component={() => <Godpage god={"Tyr"} />}
          />
          <Route
            path={"/Ullr"}
            exact
            component={() => <Godpage god={"Ullr"} />}
          />
          <Route
            path={"/Vamana"}
            exact
            component={() => <Godpage god={"Vamana"} />}
          />
          <Route
            path={"/Vulcan"}
            exact
            component={() => <Godpage god={"Vulcan"} />}
          />
          <Route
            path={"/Xbalanque"}
            exact
            component={() => <Godpage god={"Xbalanque"} />}
          />
          <Route
            path={"/Xing_Tian"}
            exact
            component={() => <Godpage god={"Xing_Tian"} />}
          />
          <Route
            path={"/Yemoja"}
            exact
            component={() => <Godpage god={"Yemoja"} />}
          />
          <Route
            path={"/Ymir"}
            exact
            component={() => <Godpage god={"Ymir"} />}
          />
          <Route
            path={"/Zeus"}
            exact
            component={() => <Godpage god={"Zeus"} />}
          />
          <Route
            path={"/Zhong_Kui"}
            exact
            component={() => <Godpage god={"Zhong_Kui"} />}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
