import { useQueries } from "@tanstack/react-query";
import PageHeader from "../../../components/gods/PageHeader";
import { GodContext } from "../../../components/gods/GodContext";
import React, { useContext } from "react";
import TabList from "../../../components/general/TabList";
import Loading from "../../../components/general/Loading";
import { GetServerSideProps } from "next";
import { GodPagePropsType } from "./build";
import { useRouter } from "next/router";

function GodIndex<NextPage>() {
  return <div></div>;
}

export default GodIndex;

const GodPageLayout = ({
  children,
  defaultParams,
}: {
  children: any;
  defaultParams: GodPagePropsType;
}) => {
  const { god, tabs } = useContext(GodContext);

  const godPageQueries = useQueries({
    queries: [
      {
        queryKey: ["god-abilities", god],
        queryFn: async () => (await fetch("/api/" + god + "/abilities")).json(),
        cacheTime: Infinity,
      },
      {
        queryKey: ["god-data", god],
        queryFn: async () => (await fetch("/api/" + god + "/data")).json(),
        cacheTime: Infinity,
      },
    ],
  });

  const isLoading = godPageQueries.some((query) => query.isLoading);
  const isError = godPageQueries.some((query) => query.error);
  if (isLoading) return <Loading height={24} width={24} />;
  if (isError) return <h1>ERROR...</h1>;
  const data = godPageQueries.map((query) => query.data);

  //@ts-ignore
  let url = linkDict[god?.toString()];

  return (
    <div id="god-profile-main-page" className="mx-auto flex w-full">
      <div
        id="god-profile-content-container content-side-padding"
        className="w-full sm:px-3"
      >
        <div
          id="god-profile-container page_build"
          className="background-image w-full"
          style={{
            backgroundImage: `radial-gradient(400px 200px at 60% 34%, rgba(7, 7, 32, 0) 0%, rgb(7, 7, 32) 100%),
            linear-gradient(90deg, rgb(7, 7, 32) 0%, rgba(7, 7, 32, 0.6) 100%), url(${url})`,
          }}
        >
          <div>
            <GodPageHeader
              godData={data[1]}
              godAbilities={data[0]}
              god={god}
              defaultParams={defaultParams}
            ></GodPageHeader>
            <TabList {...tabs} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const GodPageHeader: React.FC = (props: {
  godAbilities: any;
  god: any;
  godData: any;
  defaultParams: GodPagePropsType;
}) => {
  const router = useRouter();
  const path = router.asPath.split("/")[3]?.replaceAll("-", " ") || "";
  return (
    <PageHeader
      abilities={props.godAbilities}
      tier={"D"}
      tab={path.charAt(0).toUpperCase() + path.slice(1)}
      godData={props.godData}
      defaultParams={props.defaultParams}
    />
  );
};

export { GodPageLayout, GodPageHeader };

const linkDict = {
  Achilles: "https://i.imgur.com/KoU1bup.jpg",
  Agni: "https://i.imgur.com/DNzygMe.jpg",
  "Ah Muzen Cab": "https://i.imgur.com/mAPxdzA.jpg",
  "Ah Puch": "https://i.imgur.com/xX16VcU.jpg",
  Amaterasu: "https://i.imgur.com/HcxQ8sd.jpg",
  Anhur: "https://i.imgur.com/c4ex2dq.jpg",
  Anubis: "https://i.imgur.com/CuZgOab.jpg",
  "Ao Kuang": "https://i.imgur.com/0n7LLuG.jpg",
  Aphrodite: "https://i.imgur.com/AaDJFPx.jpg",
  Apollo: "https://i.imgur.com/MTnDzUl.jpg",
  Arachne: "https://i.imgur.com/3kjOdcl.jpg",
  Ares: "https://i.imgur.com/DBcm5f7.jpg",
  Artemis: "https://i.imgur.com/bT4b5gc.jpg",
  Artio: "https://i.imgur.com/pwTJrq3.jpg",
  Athena: "https://i.imgur.com/8uCHDlz.jpg",
  Atlas: "https://i.imgur.com/uCMJ541.jpg",
  Awilix: "https://i.imgur.com/fZh25Mc.jpg",
  "Baba Yaga": "https://i.imgur.com/6tquTDY.jpg",
  Bacchus: "https://i.imgur.com/lL8RPfw.jpg",
  Bakasura: "https://i.imgur.com/5gIjFo9.jpg",
  "Baron Samedi": "https://i.imgur.com/cChes0b.jpg",
  Bastet: "https://i.imgur.com/N7gykrw.jpg",
  Bellona: "https://i.imgur.com/i1r4nt4.jpg",
  Cabrakan: "https://i.imgur.com/HmMYUJU.jpg",
  Camazotz: "https://i.imgur.com/DXY2jSE.jpg",
  Cerberus: "https://i.imgur.com/9s5zFdr.jpg",
  Cernunnos: "https://i.imgur.com/IquJH93.jpg",
  Chaac: "https://i.imgur.com/slznuZW.jpg",
  "Chang'e": "https://i.imgur.com/nTVHD0y.jpg",
  Charybdis: "https://i.imgur.com/AGvDlVi.jpg",
  Chernobog: "https://i.imgur.com/8zvnYu5.jpg",
  Chiron: "https://i.imgur.com/cEygNc6.jpg",
  Chronos: "https://i.imgur.com/4CZSIPa.jpg",
  Cliodhna: "https://i.imgur.com/PD9N9pl.jpg",
  Cthulhu: "https://i.imgur.com/3iKo30i.jpg",
  "Cu Chulainn": "https://i.imgur.com/4eFDG0e.jpg",
  Cupid: "https://i.imgur.com/OLY1TDP.jpg",
  "Da Ji": "https://i.imgur.com/oJpXD2R.jpg",
  Danzaburou: "https://i.imgur.com/PeLPV06.jpg",
  Discordia: "https://i.imgur.com/bTwDxKV.jpg",
  "Erlang Shen": "https://i.imgur.com/nlcwZ2T.jpg",
  Eset: "https://i.imgur.com/BjXX0Wi.png",
  Fafnir: "https://i.imgur.com/43Yhg9Q.jpg",
  Fenrir: "https://i.imgur.com/S8lzwSw.jpg",
  Freya: "https://i.imgur.com/NSDIXDa.jpg",
  Ganesha: "https://i.imgur.com/WgM5ytq.jpg",
  Geb: "https://i.imgur.com/yjoLvUY.jpg",
  Gilgamesh: "https://i.imgur.com/grBatk2.jpg",
  "Guan Yu": "https://i.imgur.com/NeDl0HH.jpg",
  Hachiman: "https://i.imgur.com/JydMpnq.jpg",
  Hades: "https://i.imgur.com/giljWP0.jpg",
  "He Bo": "https://i.imgur.com/467ruyn.jpg",
  Heimdallr: "https://i.imgur.com/AWpOHTw.jpg",
  Hel: "https://i.imgur.com/KLeqa2y.jpg",
  Hera: "https://i.imgur.com/P6S6Tyc.jpg",
  Hercules: "https://i.imgur.com/RWqvXi9.jpg",
  Horus: "https://i.imgur.com/mA0Vom6.jpg",
  "Hou Yi": "https://i.imgur.com/AnJgIRB.jpg",
  "Hun Batz": "https://i.imgur.com/PWS1kZ3.jpg",
  Izanami: "https://i.imgur.com/t5c7f2K.jpg",
  Janus: "https://i.imgur.com/RPotbAL.jpg",
  "Jing Wei": "https://i.imgur.com/eaJX1IP.jpg",
  Jormungandr: "https://i.imgur.com/8COqM2r.jpg",
  Kali: "https://i.imgur.com/XVWHFVt.jpg",
  Khepri: "https://i.imgur.com/mQrlTRL.jpg",
  "King Arthur": "https://i.imgur.com/EUcSN1c.jpg",
  Kukulkan: "https://i.imgur.com/QWD7oco.jpg",
  Kumbhakarna: "https://i.imgur.com/qgFK672.jpg",
  Kuzenbo: "https://i.imgur.com/efIAMWB.jpg",
  Lancelot: "https://i.imgur.com/zrqRsfr.jpg",
  Loki: "https://i.imgur.com/vmiaaRh.jpg",
  Medusa: "https://i.imgur.com/ilPujED.jpg",
  Mercury: "https://i.imgur.com/P7CJ5UQ.jpg",
  Merlin: "https://i.imgur.com/abi67RB.jpg",
  "Morgan Le Fay": "https://i.imgur.com/QZ4jZjU.jpg",
  Mulan: "https://i.imgur.com/ZiNzuWe.jpg",
  "Ne Zha": "https://i.imgur.com/Sl4glQA.jpg",
  Neith: "https://i.imgur.com/IFI8nNw.jpg",
  Nemesis: "https://i.imgur.com/e3CNDNb.jpg",
  Nike: "https://i.imgur.com/mkkL7qX.jpg",
  Nox: "https://i.imgur.com/u6ra0GF.jpg",
  "Nu Wa": "https://i.imgur.com/VhCooqS.jpg",
  Odin: "https://i.imgur.com/VBaP7Vz.jpg",
  Olorun: "https://i.imgur.com/7jYk5RU.jpg",
  Osiris: "https://i.imgur.com/7JqDGsP.jpg",
  Pele: "https://i.imgur.com/l5q55hc.jpg",
  Persephone: "https://i.imgur.com/rK8EpOK.jpg",
  Poseidon: "https://i.imgur.com/kvNTrf3.jpg",
  Ra: "https://i.imgur.com/vipeJLL.jpg",
  Raijin: "https://i.imgur.com/qwQnQyT.jpg",
  Rama: "https://i.imgur.com/4ebZjis.jpg",
  Ratatoskr: "https://i.imgur.com/rFfc7dB.jpg",
  Ravana: "https://i.imgur.com/kKfiIrt.jpg",
  Scylla: "https://i.imgur.com/7NPNf46.jpg",
  Serqet: "https://i.imgur.com/9odFATg.jpg",
  Set: "https://i.imgur.com/7hjbLls.jpg",
  Shiva: "https://i.imgur.com/R2QEKo8.jpg",
  Skadi: "https://i.imgur.com/097p6i9.jpg",
  Sobek: "https://i.imgur.com/LIU5dYN.png",
  Sol: "https://i.imgur.com/H6PFyOw.jpg",
  "Sun Wukong": "https://i.imgur.com/fkQAznu.jpg",
  Susano: "https://i.imgur.com/iYwz8M7.jpg",
  Sylvanus: "https://i.imgur.com/1yR9had.jpg",
  Terra: "https://i.imgur.com/0PBRilP.jpg",
  Thanatos: "https://i.imgur.com/6acnOIq.jpg",
  "The Morrigan": "https://i.imgur.com/lX1FsDS.jpg",
  Thor: "https://i.imgur.com/dYIPSkM.jpg",
  Thoth: "https://i.imgur.com/l6NYsol.jpg",
  Tiamat: "https://i.imgur.com/XFyqECN.jpg",
  Tsukuyomi: "https://i.imgur.com/YntBuSV.jpg",
  Tyr: "https://i.imgur.com/OZ43lHw.jpg",
  Ullr: "https://i.imgur.com/pzKIi3p.jpg",
  Vamana: "https://i.imgur.com/RYo9mkm.jpg",
  Vulcan: "https://i.imgur.com/uGt5yTN.jpg",
  Xbalanque: "https://i.imgur.com/Ny89l8l.jpg",
  "Xing Tian": "https://i.imgur.com/EPD67l6.jpg",
  Yemoja: "https://i.imgur.com/N3MPZdc.jpg",
  Ymir: "https://i.imgur.com/QajyfQZ.jpg",
  "Yu Huang": "https://i.imgur.com/jeWpJ4l.jpg",
  Zeus: "https://i.imgur.com/M6EUYxz.jpg",
  "Zhong Kui": "https://i.imgur.com/aJBjZJE.jpg",
};
