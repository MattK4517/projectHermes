import React, {useState} from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Navigation, Godpage, Gods, TierList, Navbar, Home, ContactForm } from "./components";
import styled from 'styled-components';


function App() {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <Switch>
          <Route
            path={"/"}
            exact
            component={() => <Home />}
            />
          <Route
            path={"/Gods"}
            exact
            component={() => <Gods />}
          />
          <Route
            path={"/tierlist"}
            exact
            component={() => <TierList />}
          />
          <Route 
            path={"/contact"}
            exact
            component={() => <ContactForm />}
          />
          <Route
            path={"/Achilles"}
            exact
            component={() => <Godpage god={"Achilles"} role={"Solo"}/>}
          />
          <Route
            path={"/Agni"}
            exact
            component={() => <Godpage god={"Agni"} role={"Mid"}/>}
          />
          <Route
            path={"/Ah_Muzen_Cab"}
            exact
            component={() => <Godpage god={"Ah_Muzen_Cab"} role={"Carry"}/>}
          />
          <Route
            path={"/Ah_Puch"}
            exact
            component={() => <Godpage god={"Ah_Puch"} role={"Mid"}/>}
          />
          <Route
            path={"/Amaterasu"}
            exact
            component={() => <Godpage god={"Amaterasu"} role={"Solo"}/>}
          />
          <Route
            path={"/Anhur"}
            exact
            component={() => <Godpage god={"Anhur"} role={"Carry"}/>}
          />
          <Route
            path={"/Anubis"}
            exact
            component={() => <Godpage god={"Anubis"} role={"Mid"}/>}
          />
          <Route
            path={"/Ao_Kuang"}
            exact
            component={() => <Godpage god={"Ao_Kuang"} role={"Jungle"}/>}
          />
          <Route
            path={"/Aphrodite"}
            exact
            component={() => <Godpage god={"Aphrodite"} role={"Mid"}/>}
          />
          <Route
            path={"/Apollo"}
            exact
            component={() => <Godpage god={"Apollo"} role={"Carry"}/>}
          />
          <Route
            path={"/Arachne"}
            exact
            component={() => <Godpage god={"Arachne"} role={"Jungle"}/>}
          />
          <Route
            path={"/Ares"}
            exact
            component={() => <Godpage god={"Ares"} role={"Support"}/>}
          />
          <Route
            path={"/Artemis"}
            exact
            component={() => <Godpage god={"Artemis"} role={"Carry"}/>}
          />
          <Route
            path={"/Artio"}
            exact
            component={() => <Godpage god={"Artio"} role={"Support"}/>}
          />
          <Route
            path={"/Athena"}
            exact
            component={() => <Godpage god={"Athena"} role={"Support"}/>}
          />
          <Route
            path={"/Awilix"}
            exact
            component={() => <Godpage god={"Awilix"} role={"Jungle"}/>}
          />
          <Route
            path={"/Baba_Yaga"}
            exact
            component={() => <Godpage god={"Baba_Yaga"} role={"Mid"}/>}
          />
          <Route
            path={"/Bacchus"}
            exact
            component={() => <Godpage god={"Bacchus"} role={"Support"}/>}
          />
          <Route
            path={"/Bakasura"}
            exact
            component={() => <Godpage god={"Bakasura"} role={"Jungle"}/>}
          />
          <Route
            path={"/Baron_Samedi"}
            exact
            component={() => <Godpage god={"Baron_Samedi"} role={"Mid"}/>}
          />
          <Route
            path={"/Bastet"}
            exact
            component={() => <Godpage god={"Bastet"} role={"Jungle"}/>}
          />
          <Route
            path={"/Bellona"}
            exact
            component={() => <Godpage god={"Bellona"} role={"Solo"}/>}
          />
          <Route
            path={"/Cabrakan"}
            exact
            component={() => <Godpage god={"Cabrakan"} role={"Support"}/>}
          />
          <Route
            path={"/Camazotz"}
            exact
            component={() => <Godpage god={"Camazotz"} role={"Solo"}/>}
          />
          <Route
            path={"/Cerberus"}
            exact
            component={() => <Godpage god={"Cerberus"} role={"Support"}/>}
          />
          <Route
            path={"/Cernunnos"}
            exact
            component={() => <Godpage god={"Cernunnos"} role={"Carry"}/>}
          />
          <Route
            path={"/Chaac"}
            exact
            component={() => <Godpage god={"Chaac"} role={"Solo"}/>}
          />
          <Route
            path={"/Chang'e"}
            exact
            component={() => <Godpage god={"Chang'e"} role={"Mid"}/>}
          />
          <Route
            path={"/Chernobog"}
            exact
            component={() => <Godpage god={"Chernobog"} role={"Carry"}/>}
          />
          <Route
            path={"/Chiron"}
            exact
            component={() => <Godpage god={"Chiron"} role={"Carry"}/>}
          />
          <Route
            path={"/Chronos"}
            exact
            component={() => <Godpage god={"Chronos"} role={"Carry"}/>}
          />
          <Route
            path={"/Cthulhu"}
            exact
            component={() => <Godpage god={"Cthulhu"} role={"Solo"}/>}
          />
          <Route
            path={"/Cu_Chulainn"}
            exact
            component={() => <Godpage god={"Cu_Chulainn"} role={"Solo"}/>}
          />
          <Route
            path={"/Cupid"}
            exact
            component={() => <Godpage god={"Cupid"} role={"Carry"}/>}
          />
          <Route
            path={"/Da_Ji"}
            exact
            component={() => <Godpage god={"Da_Ji"} role={"Jungle"}/>}
          />
          <Route
            path={"/Danzaburou"}
            exact
            component={() => <Godpage god={"Danzaburou"} role={"Carry"}/>}
          />
          <Route
            path={"/Discordia"}
            exact
            component={() => <Godpage god={"Discordia"} role={"Mid"}/>}
          />
          <Route
            path={"/Erlang_Shen"}
            exact
            component={() => <Godpage god={"Erlang_Shen"} role={"Jungle"}/>}
          />
          <Route
            path={"/Eset"}
            exact
            component={() => <Godpage god={"Eset"} role={"Mid"}/>}
          />
          <Route
            path={"/Fafnir"}
            exact
            component={() => <Godpage god={"Fafnir"} role={"Support"}/>}
          />
          <Route
            path={"/Fenrir"}
            exact
            component={() => <Godpage god={"Fenrir"} role={"Jungle"}/>}
          />
          <Route
            path={"/Freya"}
            exact
            component={() => <Godpage god={"Freya"} role={"Carry"}/>}
          />
          <Route
            path={"/Ganesha"}
            exact
            component={() => <Godpage god={"Ganesha"} role={"Support"}/>}
          />
          <Route
            path={"/Geb"}
            exact
            component={() => <Godpage god={"Geb"} role={"Support"}/>}
          />
          <Route
            path={"/Gilgamesh"}
            exact
            component={() => <Godpage god={"Gilgamesh"} role={"Jungle"}/>}
          />
          <Route
            path={"/Guan_Yu"}
            exact
            component={() => <Godpage god={"Guan_Yu"} role={"Solo"}/>}
          />
          <Route
            path={"/Hachiman"}
            exact
            component={() => <Godpage god={"Hachiman"} role={"Carry"}/>}
          />
          <Route
            path={"/Hades"}
            exact
            component={() => <Godpage god={"Hades"} role={"Solo"}/>}
          />
          <Route
            path={"/He_Bo"}
            exact
            component={() => <Godpage god={"He_Bo"} role={"Mid"}/>}
          />
          <Route
            path={"/Heimdallr"}
            exact
            component={() => <Godpage god={"Heimdallr"} role={"Carry"}/>}
          />
          <Route
            path={"/Hel"}
            exact
            component={() => <Godpage god={"Hel"} role={"Mid"}/>}
          />
          <Route
            path={"/Hera"}
            exact
            component={() => <Godpage god={"Hera"} role={"Mid"}/>}
          />
          <Route
            path={"/Hercules"}
            exact
            component={() => <Godpage god={"Hercules"} role={"Solo"}/>}
          />
          <Route
            path={"/Horus"}
            exact
            component={() => <Godpage god={"Horus"} role={"Support"}/>}
          />
          <Route
            path={"/Hou_Yi"}
            exact
            component={() => <Godpage god={"Hou_Yi"} role={"Carry"}/>}
          />
          <Route
            path={"/Hun_Batz"}
            exact
            component={() => <Godpage god={"Hun_Batz"} role={"Jungle"}/>}
          />
          <Route
            path={"/Izanami"}
            exact
            component={() => <Godpage god={"Izanami"} role={"Carry"}/>}
          />
          <Route
            path={"/Janus"}
            exact
            component={() => <Godpage god={"Janus"} role={"Mid"}/>}
          />
          <Route
            path={"/Jing_Wei"}
            exact
            component={() => <Godpage god={"Jing_Wei"} role={"Carry"}/>}
          />
          <Route
            path={"/Jormungandr"}
            exact
            component={() => <Godpage god={"Jormungandr"} role={"Solo"}/>}
          />
          <Route
            path={"/Kali"}
            exact
            component={() => <Godpage god={"Kali"} role={"Jungle"}/>}
          />
          <Route
            path={"/Khepri"}
            exact
            component={() => <Godpage god={"Khepri"} role={"Support"}/>}
          />
          <Route
            path={"/King_Arthur"}
            exact
            component={() => <Godpage god={"King_Arthur"} role={"Solo"}/>}
          />
          <Route
            path={"/Kukulkan"}
            exact
            component={() => <Godpage god={"Kukulkan"} role={"Mid"}/>}
          />
          <Route
            path={"/Kumbhakarna"}
            exact
            component={() => <Godpage god={"Kumbhakarna"} role={"Support"}/>}
          />
          <Route
            path={"/Kuzenbo"}
            exact
            component={() => <Godpage god={"Kuzenbo"} role={"Support"}/>}
          />
          <Route
            path={"/Loki"}
            exact
            component={() => <Godpage god={"Loki"} role={"Jungle"}/>}
          />
          <Route
            path={"/Medusa"}
            exact
            component={() => <Godpage god={"Medusa"} role={"Carry"}/>}
          />
          <Route
            path={"/Mercury"}
            exact
            component={() => <Godpage god={"Mercury"} role={"Jungle"}/>}
          />
          <Route
            path={"/Merlin"}
            exact
            component={() => <Godpage god={"Merlin"} role={"Mid"}/>}
          />
          <Route
            path={"/Morgan_Le_Fay"}
            exact
            component={() => <Godpage god={"Morgan_Le_Fay"} role={"Mid"}/>}
          />
          <Route
            path={"/Mulan"}
            exact
            component={() => <Godpage god={"Mulan"} role={"Solo"}/>}
          />
          <Route
            path={"/Ne_Zha"}
            exact
            component={() => <Godpage god={"Ne_Zha"} role={"Jungle"}/>}
          />
          <Route
            path={"/Neith"}
            exact
            component={() => <Godpage god={"Neith"} role={"Carry"}/>}
          />
          <Route
            path={"/Nemesis"}
            exact
            component={() => <Godpage god={"Nemesis"} role={"Jungle"}/>}
          />
          <Route
            path={"/Nike"}
            exact
            component={() => <Godpage god={"Nike"} role={"Solo"}/>}
          />
          <Route
            path={"/Nox"}
            exact
            component={() => <Godpage god={"Nox"} role={"Mid"}/>}
          />
          <Route
            path={"/Nu_Wa"}
            exact
            component={() => <Godpage god={"Nu_Wa"} role={"Mid"}/>}
          />
          <Route
            path={"/Odin"}
            exact
            component={() => <Godpage god={"Odin"} role={"Solo"}/>}
          />
          <Route
            path={"/Olorun"}
            exact
            component={() => <Godpage god={"Olorun"} role={"Carry"}/>}
          />
          <Route
            path={"/Osiris"}
            exact
            component={() => <Godpage god={"Osiris"} role={"Solo"}/>}
          />
          <Route
            path={"/Pele"}
            exact
            component={() => <Godpage god={"Pele"} role={"Jungle"}/>}
          />
          <Route
            path={"/Persephone"}
            exact
            component={() => <Godpage god={"Persephone"} role={"Mid"}/>}
          />
          <Route
            path={"/Poseidon"}
            exact
            component={() => <Godpage god={"Poseidon"} role={"Mid"}/>}
          />
          <Route path={"/Ra"} exact component={() => <Godpage god={"Ra"} role={"Mid"}/>} />
          <Route
            path={"/Raijin"}
            exact
            component={() => <Godpage god={"Raijin"} role={"Mid"}/>}
          />
          <Route
            path={"/Rama"}
            exact
            component={() => <Godpage god={"Rama"} role={"Carry"}/>}
          />
          <Route
            path={"/Ratatoskr"}
            exact
            component={() => <Godpage god={"Ratatoskr"} role={"Jungle"}/>}
          />
          <Route
            path={"/Ravana"}
            exact
            component={() => <Godpage god={"Ravana"} role={"Jungle"}/>}
          />
          <Route
            path={"/Scylla"}
            exact
            component={() => <Godpage god={"Scylla"} role={"Mid"}/>}
          />
          <Route
            path={"/Serqet"}
            exact
            component={() => <Godpage god={"Serqet"} role={"Jungle"}/>}
          />
          <Route
            path={"/Set"}
            exact
            component={() => <Godpage god={"Set"} role={"Jungle"}/>}
          />
          <Route
            path={"/Skadi"}
            exact
            component={() => <Godpage god={"Skadi"} role={"Carry"}/>}
          />
          <Route
            path={"/Sobek"}
            exact
            component={() => <Godpage god={"Sobek"} role={"Support"}/>}
          />
          <Route
            path={"/Sol"}
            exact
            component={() => <Godpage god={"Sol"} role={"Carry"}/>}
          />
          <Route
            path={"/Sun_Wukong"}
            exact
            component={() => <Godpage god={"Sun_Wukong"} role={"Solo"}/>}
          />
          <Route
            path={"/Susano"}
            exact
            component={() => <Godpage god={"Susano"} role={"Jungle"}/>}
          />
          <Route
            path={"/Sylvanus"}
            exact
            component={() => <Godpage god={"Sylvanus"} role={"Support"}/>}
          />
          <Route
            path={"/Terra"}
            exact
            component={() => <Godpage god={"Terra"} role={"Support"}/>}
          />
          <Route
            path={"/Thanatos"}
            exact
            component={() => <Godpage god={"Thanatos"} role={"Jungle"}/>}
          />
          <Route
            path={"/The_Morrigan"}
            exact
            component={() => <Godpage god={"The_Morrigan"} role={"Mid"}/>}
          />
          <Route
            path={"/Thor"}
            exact
            component={() => <Godpage god={"Thor"} role={"Jungle"}/>}
          />
          <Route
            path={"/Thoth"}
            exact
            component={() => <Godpage god={"Thoth"} role={"Mid"}/>}
          />
          <Route
            path={"/Tiamat"}
            exact
            component={() => <Godpage god={"Tiamat"} role={"Mid"}/>}
          />
          <Route
            path={"/Tsukuyomi"}
            exact
            component={() => <Godpage god={"Tsukuyomi"} role={"Jungle"}/>}
          />
          <Route
            path={"/Tyr"}
            exact
            component={() => <Godpage god={"Tyr"} role={"Solo"}/>}
          />
          <Route
            path={"/Ullr"}
            exact
            component={() => <Godpage god={"Ullr"} role={"Carry"}/>}
          />
          <Route
            path={"/Vamana"}
            exact
            component={() => <Godpage god={"Vamana"} role={"Solo"}/>}
          />
          <Route
            path={"/Vulcan"}
            exact
            component={() => <Godpage god={"Vulcan"} role={"Mid"}/>}
          />
          <Route
            path={"/Xbalanque"}
            exact
            component={() => <Godpage god={"Xbalanque"} role={"Carry"}/>}
          />
          <Route
            path={"/Xing_Tian"}
            exact
            component={() => <Godpage god={"Xing_Tian"} role={"Support"}/>}
          />
          <Route
            path={"/Yemoja"}
            exact
            component={() => <Godpage god={"Yemoja"} role={"Support"}/>}
          />
          <Route
            path={"/Ymir"}
            exact
            component={() => <Godpage god={"Ymir"} role={"Support"}/>}
          />
          <Route
            path={"/Zeus"}
            exact
            component={() => <Godpage god={"Zeus"} role={"Mid"}/>}
          />
          <Route
            path={"/Zhong_Kui"}
            exact
            component={() => <Godpage god={"Zhong_Kui"} role={"Solo"}/>}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
