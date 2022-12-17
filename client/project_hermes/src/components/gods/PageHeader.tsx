import { Ability, MenuItem, tier } from "../../models/gods.model";
import GodIconLoader, { GodAbilityIconLoader } from "../loader";
import Image from "next/image";
import { Popover } from "@headlessui/react";
import { getPantheonIcon, getTierColor } from "./GodHelpers";

const getMessage = (
  role: string,
  rank: string,
  mode: string,
  queueType: string
) => {
  let message = `${role}, ${rank}`;

  if (mode != "Conquest" && queueType != "Ranked") {
    message = `${mode}`;
  } else if (mode != "Conquest" && queueType === "Ranked") {
    message = `${mode}, ${rank}`;
  }
  return message;
};

interface PageHeaderProps {
  tier: tier;
  god: string;
  tab: string;
  role: string;
  rank: string;
  mode: string;
  queueType: string;
  patch: string;
  abilities: Ability[];
  godData: any;
}

const PageHeader = (props: PageHeaderProps) => {
  return (
    <div className="mb-6 w-full text-white" id="god-page-header">
      <div className="flex w-full items-center" id="god-header-wrap">
        <Popover className="max-w-2xl">
          <Popover.Button
            className="relative h-24 w-24 flex-initial rounded-md border-2"
            style={{ borderColor: getTierColor(props.tier) }}
          >
            <div
              className="tier-heading"
              style={{ borderColor: getTierColor(props.tier) }}
            >
              {props.tier}
            </div>
            <div className="relative h-full w-full ">
              <div className="relative h-full w-full overflow-hidden rounded-md border-2 border-card">
                <div className="notch-border absolute left-1/2"></div>
                <div className="god-image">
                  <Image
                    src={props.god}
                    alt={props.god}
                    loader={GodIconLoader}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>
            </div>
          </Popover.Button>
          <Popover.Panel className="card-base absolute top-40 z-10 max-h-96 max-w-2xl">
            <div
              id="god-info-header"
              className="sticky top-0 flex w-full text-lightBlue"
            >
              <div className="flex flex-grow flex-col">
                <span className="text-2xl font-bold text-darkPurple">
                  {props.god} - {props.godData.Title}
                </span>
                <span>{props.godData.Roles}</span>
                <span>{props.godData.Pros}</span>
                <span>{props.godData.Type}</span>
              </div>
              <div id="panth-wrapper" className="w-fit">
                <img
                  src={getPantheonIcon(props.godData.Pantheon)}
                  alt={props.god + "pantheon icon"}
                  className="h-16 w-16"
                />
                <span>{props.godData.Pantheon}</span>
              </div>
            </div>
            <span className="text-2xl font-bold text-darkPurple">Lore</span>
            <div className="mt-2 grid max-h-48 grid-cols-2 gap-2 overflow-auto">
              <span>{props.godData.Lore.replaceAll("\\n", "\n")}</span>
            </div>
          </Popover.Panel>
        </Popover>
        <div className="ml-6 flex h-full min-w-0 flex-1 flex-col justify-between">
          <h3 className="mb-2 text-xl text-lightBlue">
            <span>
              <b style={{ color: "white" }}>{props.god}</b>
            </span>
            <span>
              &nbsp;{props.tab} for{" "}
              {getMessage(props.role, props.rank, props.mode, props.queueType)}
            </span>
          </h3>
          <div className="mt-4 flex h-8 items-center ">
            <div className="mr-6 flex items-center">
              <GodAbilities abilities={props.abilities} />
            </div>
            <div className="pr-3 text-xs font-medium text-lightBlue">
              The best win rate {props.god} build. The best and worst matchups
              for {props.god} and anything else you need, {props.rank} Smite
              Patch {props.patch}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;

export function GodAbilities(props: { abilities: Ability[] }) {
  return (
    <>
      {Object.values(props.abilities).map((ability, index) => {
        let text;
        if (index === 4) {
          text = "P";
        } else {
          if (index >= 4) {
            text = index;
          } else {
            text = index + 1;
          }
        }
        return (
          <Popover key={index}>
            <Popover.Button className="relative" style={{ marginRight: "6px" }}>
              <Image
                src={ability.URL}
                alt={ability.Summary + "Icon"}
                loader={GodAbilityIconLoader}
                width={36}
                height={36}
                className="h-9 w-9 flex-shrink-0 rounded-sm"
              />

              <div className="ability-label bottom-center">{text}</div>
            </Popover.Button>
            <Popover.Panel className="absolute z-10 mt-2 max-w-2xl">
              <div className="card-base">
                <span className="text-2xl font-bold text-darkPurple">
                  {ability.Summary}
                </span>
                <div className="mt-2 grid grid-cols-2 gap-2 text-lightBlue">
                  <div className="flex flex-col">
                    <div>{ability.Description.itemDescription.description}</div>
                    <div
                      hidden={ability.Description.itemDescription.cost === ""}
                    >
                      <span className="font-semibold text-lightPurple">
                        Cost:{" "}
                      </span>
                      <span>{ability.Description.itemDescription.cost}</span>
                    </div>
                    <div
                      hidden={
                        ability.Description.itemDescription.cooldown === ""
                      }
                    >
                      <span className="font-semibold text-lightPurple">
                        Cooldown:{" "}
                      </span>
                      <span>
                        {ability.Description.itemDescription.cooldown}
                      </span>
                    </div>
                  </div>
                  <ItemRenderer
                    items={ability.Description.itemDescription.menuitems}
                  />
                  <ItemRenderer
                    items={ability.Description.itemDescription.rankitems}
                  />
                  <div></div>
                </div>
              </div>
            </Popover.Panel>
          </Popover>
        );
      })}
    </>
  );
}

const ItemRenderer = (props: { items: MenuItem[] }) => {
  return (
    <div className="flex flex-col">
      <div>
        {props.items.map((item, index) => {
          return (
            <div key={index}>
              <span className="font-semibold text-lightPurple">
                {item.description}{" "}
              </span>
              <span>{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
