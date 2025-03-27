import { FC } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import * as HOutline from "@heroicons/react/24/outline";
import Billing from "./billing-component";
import Personal from "./personal-component";
import Kunjungan from "./kunjungan-component";
import BPJS from "./bpjs-component";
import Medikasi from "./medikasi-component";
import Radiologi from "./radiologi-component";
import Laboratorium from "./laboratorium-component";
import Screening from "./screening-component";
import StatusGizi from "./status-gizi-component";
import KesehatanIndividu from "./kesehatan-individu-component";
import Vaksinasi from "./vaksinasi-component";

const DetailIndex: FC = () => {
  const tabs: {
    name: string;
    Icon: FC<React.SVGProps<SVGSVGElement>>;
    Component: FC;
  }[] = [
    {
      name: "Personal",
      Icon: HOutline.UserIcon,
      Component: Personal,
    },
    {
      name: "Kunjungan",
      Icon: HOutline.ShareIcon,
      Component: Kunjungan,
    },
    {
      name: "BPJS",
      Icon: HOutline.CreditCardIcon,
      Component: BPJS,
    },
    {
      name: "Medikasi",
      Icon: HOutline.NoSymbolIcon,
      Component: Medikasi,
    },
    {
      name: "Radiologi",
      Icon: HOutline.PhotoIcon,
      Component: Radiologi,
    },
    {
      name: "Laboratorium",
      Icon: HOutline.BeakerIcon,
      Component: Laboratorium,
    },
    {
      name: "Billing",
      Icon: HOutline.CurrencyDollarIcon,
      Component: Billing,
    },
    {
      name: "Screening",
      Icon: HOutline.ClipboardIcon,
      Component: Screening,
    },
    {
      name: "Status Gizi",
      Icon: HOutline.ArrowTrendingUpIcon,
      Component: StatusGizi,
    },
    {
      name: "Kesehatan Individu",
      Icon: HOutline.HeartIcon,
      Component: KesehatanIndividu,
    },
    {
      name: "Vaksinasi",
      Icon: HOutline.ShieldCheckIcon,
      Component: Vaksinasi,
    },
  ] as const;

  return (
    <TabGroup className="flex gap-6">
      <TabList className="flex flex-col min-w-1/8 gap-1">
        {tabs.map(({ name, Icon }, k) => (
          <Tab
            key={k}
            className="flex items-center gap-2 cursor-pointer outline-none rounded-sm px-5 py-1.5 data-[selected]:font-normal data-[selected]:text-white data-[selected]:bg-blue-600 data-[hover]:bg-blue-600 data-[hover]:text-white"
          >
            <Icon className="size-5" />
            {name}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="flex flex-1">
        {tabs.map(({ Component }, k) => (
          <TabPanel key={k}>
            <Component />
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
};

export default DetailIndex;
