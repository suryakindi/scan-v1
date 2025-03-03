import { FC, Fragment, useState } from "react";
import {
  createBrowserRouter,
  NavLink,
  Outlet,
  RouteObject,
  RouterProvider,
  useLocation,
} from "react-router";
import * as HOutline from "@heroicons/react/24/outline";
import * as HSolid from "@heroicons/react/24/solid";
import clsx from "clsx";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BarLoader } from "react-spinners";

type ModuleT =
  | "Registrasi"
  | "Pasien"
  | "Integrasi-Tools"
  | "Management-Client"
  | "Master-Data";

type WrapRoute = RouteObject & {
  name?: string;
  nav?: boolean;
  module?: ModuleT;
  children?: WrapRoute[];
  Icon?: FC<React.SVGProps<SVGSVGElement>>;
};

const routes: WrapRoute[] = [
  {
    path: "bpjs",
    name: "BPJS",
    nav: true,
    module: "Integrasi-Tools",
    Icon: HOutline.ShieldCheckIcon,
    children: [
      {
        path: "/bpjs/kunjungan",
        name: "Kunjungan",
        nav: true,
        module: "Integrasi-Tools",
      },
      {
        path: "/bpjs/dokter",
        name: "Dokter",
        nav: true,
        module: "Integrasi-Tools",
      },
      {
        path: "/bpjs/hfis",
        name: "HFIS",
        nav: true,
        module: "Integrasi-Tools",
      },
      {
        path: "/bpjs/tindakan",
        name: "Tindakan",
        nav: true,
        module: "Integrasi-Tools",
      },
      {
        path: "/bpjs/prolanis",
        name: "Prolanis",
        nav: true,
        module: "Integrasi-Tools",
      },
    ],
  },
  {
    path: "/management-client",
    name: "Management Client",
    nav: true,
    module: "Management-Client",
    Icon: HOutline.UsersIcon,
    children: [
      {
        path: "/management-client/client",
        nav: true,
        name: "Client",
        module: "Integrasi-Tools",
      },
      {
        path: "/management-client/base-url",
        nav: true,
        name: "Base URL",
        module: "Integrasi-Tools",
      },
      { path: "/management-client/details/:id", module: "Integrasi-Tools" },
    ],
  },
];

const LoadingOverlay: FC = () => {
  return (
    <div className="bg-white absolute flex flex-col justify-center items-center w-screen h-screen z-10">
      <div className="w-1/10">
        <img src="/images/logo_t.png" />
      </div>
      <BarLoader
        color="#1447e6"
        height={4}
        loading={true}
        speedMultiplier={1}
        width={300}
      />
    </div>
  );
};

const Error404: FC = () => {
  return <p>404</p>;
};

const Layout: FC = () => {
  const [show, setShow] = useState<boolean>(true);
  const [open, setOpen] = useState<string | undefined>(undefined);
  const [isProcess, setIsProcess] = useState<boolean>(false);

  const { pathname } = useLocation();

  const navRoutes = routes
    .map((route) => {
      const children =
        route.children?.filter(({ nav }: WrapRoute) => nav) || [];

      return {
        name: route.name,
        path: route.path,
        nav: route.nav,
        Icon: route.Icon,
        ...(children.length > 0 ? { children } : {}),
      };
    })
    .filter(({ nav, children }) => nav || (children && children.length > 0));

  return (
    <Fragment>
      <nav
        className={clsx(
          "fixed bg-white w-1/8 top-0 bottom-0 left-0 shadow-2xl overflow-auto font-light transition-all ease-in-out duration-150 text-sm",
          show ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="bg-white sticky top-0 z-10 h-16 text-2xl font-bold text-blue-700 flex items-center justify-center">
          Logo
        </div>
        <ul className="before:h-4 before:flex">
          {navRoutes.map((parent, _parent) => (
            <li key={_parent} className="mt-1 px-2">
              <NavLink
                onClick={(e) => {
                  if (parent.children) e.preventDefault();
                  setOpen(open === parent.path ? "" : parent.path);
                }}
                to={parent.path ?? "/"}
                className={({ isActive }) =>
                  clsx(
                    "flex h-12 px-4 items-center justify-between w-full rounded-md",
                    !isActive ? "hover:bg-slate-200" : "",
                    isActive && pathname === parent.path
                      ? "bg-blue-600 hover:bg-blue-500 text-white font-medium"
                      : isActive
                      ? "bg-slate-200 font-medium"
                      : ""
                  )
                }
              >
                <div className="flex items-center">
                  {parent.Icon ? (
                    <parent.Icon className="size-6" />
                  ) : (
                    <HOutline.PuzzlePieceIcon className="size-6" />
                  )}
                  <span className="ml-2">{parent.name}</span>
                </div>
                {parent.children && (
                  <HOutline.ChevronRightIcon
                    className={clsx(
                      "size-6 transition-all ease-in-out duration-150",
                      open === parent.path ? "rotate-90" : ""
                    )}
                  />
                )}
              </NavLink>
              {parent.children && (
                <ul
                  className={clsx(
                    "overflow-hidden transition-all ease-in-out duration-150",
                    open === parent.path ? "h-full" : "h-0"
                  )}
                >
                  {parent.children.map((child, _child) => (
                    <li key={_child} className="mt-1">
                      <NavLink
                        to={child.path ?? "/"}
                        className={({ isActive }) =>
                          clsx(
                            "flex h-12 px-4 items-center justify-between w-full rounded-md",
                            isActive
                              ? "bg-blue-600 hover:bg-blue-500 text-white font-medium"
                              : "hover:bg-slate-200"
                          )
                        }
                      >
                        <span className="pl-8">{child.name}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex">
        <div className="flex-1" />
        <div
          className={clsx(
            "transition-all ease-in-out duration-150",
            "before:flex before:h-20",
            show ? "w-7/8" : "w-full"
          )}
        >
          <header
            className={clsx(
              "fixed top-0 flex pt-4 px-4 backdrop-blur-md transition-all ease-in-out duration-150 text-sm",
              show ? "w-7/8" : "w-full"
            )}
          >
            <div className="flex bg-white w-full h-14 items-center justify-between px-4 rounded-md shadow-2xl">
              <button
                type="button"
                className="rounded-full aspect-square hover:bg-slate-200 p-1 cursor-pointer"
                onClick={() => setShow((prev) => !prev)}
              >
                <HOutline.Bars3Icon className="size-6" />
              </button>

              <div className="flex ml-4 items-center">
                <div className="flex flex-col text-nowrap mr-2">
                  <span className="font-medium">John Doe</span>
                  <span className="text-xs">Super Admin</span>
                </div>
                <Menu>
                  <MenuButton
                    type="button"
                    className="aspect-square h-full relative flex items-end justify-end cursor-pointer"
                  >
                    <div className="rounded-full w-10 h-10 bg-blue-100 text-blue-700 flex items-center justify-center">
                      <HSolid.UserIcon className="size-6" />
                    </div>
                    <span className="bg-green-600 aspect-square rounded-full absolute w-2 bottom-0" />
                  </MenuButton>

                  <MenuItems
                    transition
                    anchor="bottom end"
                    className="transition duration-200 ease-in-out bg-white left-0 border border-slate-200 rounded-sm mt-1"
                  >
                    <MenuItem
                      as="button"
                      className="py-2 px-4 cursor-pointer hover:bg-slate-200 flex items-center w-full"
                    >
                      <HOutline.UserIcon className="size-4 mr-2" />
                      <span>Profile</span>
                    </MenuItem>
                    <MenuItem
                      as="button"
                      className="py-2 px-4 cursor-pointer hover:bg-slate-200 flex items-center w-full"
                    >
                      <HOutline.ArrowTrendingUpIcon className="size-4 mr-2" />
                      <span>Activity</span>
                    </MenuItem>
                    <MenuItem
                      as="button"
                      className="py-2 px-4 cursor-pointer hover:bg-slate-200 flex items-center w-full"
                    >
                      <HOutline.PowerIcon className="size-4 mr-2" />
                      <span>Logout</span>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </header>

          <Outlet context={{ setIsProcess }} />
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos dolore
            ipsam placeat fugiat, odit culpa alias, numquam quos voluptates
            similique cumque animi voluptas pariatur minima libero deserunt illo
            velit mollitia? Qui obcaecati molestias temporibus reiciendis
            voluptate, sint a cumque nemo veniam at labore soluta atque quos
            necessitatibus neque maiores enim libero impedit adipisci omnis fuga
            magnam quia? Debitis alias facilis odit nulla harum dolorem, soluta
            doloremque nesciunt saepe quibusdam itaque similique perspiciatis,
            pariatur veniam natus provident necessitatibus culpa fuga. Explicabo
            laborum blanditiis numquam cum inventore sed ea nisi eum cupiditate
            doloribus dignissimos expedita excepturi, quas aspernatur omnis
            magni officia aliquid voluptates totam autem ab deleniti. Officia
            sint adipisci neque sunt cumque minus enim illo. Unde numquam at hic
            culpa enim porro magnam voluptatem sunt consequatur facere possimus,
            pariatur assumenda quibusdam, nulla, fugit amet iste accusantium et
            dolorum magni minima nihil impedit rem odit? Pariatur, consequatur!
            Vitae, explicabo nostrum tenetur non provident ipsa officiis
            doloribus totam, nobis, ea enim possimus iste quaerat. Officiis
            culpa vero aspernatur. Eligendi vitae minima cupiditate quo possimus
            quas praesentium obcaecati ex in, sunt tempora ducimus accusantium
            cumque mollitia, esse at quidem ea nisi atque delectus earum
            voluptatem! Dicta vero ipsum consequatur quo ut odio quia optio
            sapiente saepe, incidunt, officia amet facere voluptate rem, cum ex
            fugit maiores reprehenderit animi doloribus atque. Est nobis tempore
            eaque, similique adipisci fugiat illum officia! Quod corporis,
            dolores natus, nesciunt officia quisquam rem, necessitatibus libero
            voluptas debitis placeat inventore vel. Nesciunt, molestias suscipit
            impedit voluptatibus ipsam nihil quos aperiam sequi, expedita saepe
            optio provident beatae exercitationem at nobis iste vero a mollitia
            qui similique dolorum ullam. Libero ad vero ipsa unde beatae tenetur
            dolorem sapiente, adipisci quasi magnam iusto quia. Nam nesciunt
            minima odio eius rerum ratione at tempora voluptatum nulla natus
            accusamus exercitationem earum, ea vero suscipit nisi nobis
            accusantium obcaecati dolorem cumque voluptate! Fuga magni veniam,
            quaerat laboriosam quas nesciunt illum et suscipit eaque assumenda
            eius voluptatum omnis cum provident. Consequuntur cumque tempora id
            vitae qui non repudiandae deserunt optio! Blanditiis, cumque dolorum
            voluptatem atque officiis illum praesentium ea exercitationem
            numquam non id aperiam soluta explicabo voluptates voluptatum
            perspiciatis sequi consequuntur! A laudantium aliquid ea amet
            quibusdam explicabo ipsam asperiores cumque. Iusto eos, hic
            reiciendis dolorum cupiditate dolore excepturi rem repellat dicta
            quibusdam ea corrupti commodi perspiciatis nulla non, inventore
            voluptatibus dolores! Et doloremque modi sunt nihil nobis
            perferendis natus illum consectetur enim, quod excepturi
            consequuntur culpa officia. Dignissimos consectetur beatae
            distinctio delectus facilis odit debitis aspernatur possimus aperiam
            consequuntur, deserunt id sed quas cumque itaque qui earum! Hic
            facilis est at quidem nostrum voluptatum exercitationem ducimus
            sequi ratione perspiciatis? Mollitia animi ut optio soluta sapiente
            obcaecati quae est aliquid modi minus ullam voluptatem qui, ex
            magni. Facere reprehenderit magni vitae autem atque quo nesciunt
            suscipit beatae porro eveniet minus nisi ipsum corrupti iure,
            dignissimos aperiam repellat modi, veniam itaque ratione provident
            est repudiandae? Excepturi, ducimus, suscipit corrupti consequuntur
            mollitia, placeat aperiam illo voluptatum facilis magnam hic dolores
            nam eum quaerat ut dignissimos qui ullam pariatur labore rem at ex
            voluptates! Architecto molestias laudantium nisi dolores, iusto eum
            voluptatibus, accusamus at porro ex tempore eveniet alias
            dignissimos quas suscipit sapiente expedita inventore unde numquam
            illo vel excepturi dicta vero? Possimus doloremque autem blanditiis
            dolores corporis at earum, explicabo exercitationem voluptas! Iste
            nulla excepturi, laudantium, amet esse aliquam ratione illo
            provident reiciendis, cupiditate distinctio doloribus corrupti
            quisquam saepe illum aperiam dolore vel debitis nemo magni. Quos
            assumenda impedit ut suscipit nam, harum aut neque a, quidem alias
            omnis error, id ipsa perspiciatis dicta. Consectetur, debitis
            excepturi qui sapiente odio quibusdam enim sit tempora accusantium
            magni molestias ducimus sequi corporis veritatis, officiis sunt.
            Iste maxime enim dolores possimus vero, veritatis pariatur debitis
            quae nam corrupti laborum exercitationem earum quo necessitatibus
            commodi deserunt optio! Alias fuga earum quasi distinctio animi nisi
            autem, id rem sed cupiditate corporis natus itaque provident non
            tenetur dolorem voluptas eos error quas officiis! Quisquam accusamus
            aperiam ducimus ipsum laudantium praesentium accusantium sunt
            voluptates quas pariatur eos nostrum beatae similique tempore quidem
            nisi, incidunt illum vero culpa. Molestias nulla illum labore
            tenetur fugit quibusdam reprehenderit cumque nisi? Quaerat sunt
            neque modi voluptates optio accusantium voluptatibus facere tenetur
            quidem quod consequuntur quae consequatur eum animi ratione rerum, a
            odit explicabo rem dolor repellat repudiandae iusto. Quisquam
            laboriosam assumenda inventore expedita quas, repudiandae
            temporibus. Voluptas repellat, amet dolorum totam maxime assumenda.
            Dolorem in minima nesciunt odio sequi, porro error vero sit eveniet
            maxime nobis perspiciatis excepturi totam recusandae repellendus
            expedita minus dicta facere aliquam voluptatem commodi repudiandae
            debitis reiciendis exercitationem! Impedit, quaerat. Reprehenderit
            ipsa aliquam consectetur provident veniam deleniti soluta facilis
            nemo eos veritatis omnis voluptatibus aperiam incidunt, temporibus,
            accusantium ipsum officia dolores rerum odio! Voluptate quo
            mollitia, voluptatem ipsam expedita, itaque veritatis obcaecati
            fugiat in accusamus laboriosam facilis enim. Sit architecto,
            voluptate earum amet eaque odio nobis nesciunt ad dolor temporibus
            qui iusto distinctio hic, aliquid eius. Sequi aut, placeat facere
            inventore illum non nostrum nesciunt fugit. Voluptate quidem, optio
            hic sint nobis dignissimos, et ut tempora unde, repudiandae illum ea
            nostrum mollitia cum. Voluptatum error ex adipisci totam, incidunt
            asperiores expedita nobis repudiandae? Totam laudantium dicta
            eveniet beatae quasi at doloribus veniam dolor voluptatibus
            repudiandae sequi necessitatibus, vero corporis in esse omnis quos
            repellat sit dolores explicabo tenetur. Error rerum, accusamus vel
            quae odit fugiat, officia similique explicabo fuga qui, ut enim
            voluptate! Deserunt dolore provident tempore itaque facere eveniet
            porro perspiciatis beatae quae dicta veritatis totam quidem, animi
            labore. In magnam laborum deserunt doloremque ipsam maiores? Dolorem
            nemo nostrum neque quos, porro officia perferendis error assumenda
            hic, quis, quia eius dolores! Accusamus minus architecto dicta modi
            temporibus, nostrum omnis. Magnam rerum eaque quasi ipsam similique,
            doloremque dolor dignissimos, quia consequuntur maiores corporis!
            Qui praesentium facere cupiditate est? Atque maiores harum et earum
            iusto hic blanditiis ab aperiam alias nobis pariatur officia
            doloremque a repellendus voluptatum quaerat accusantium, amet quos
            quas! Consequuntur magnam quam possimus velit, sit quae,
            exercitationem aperiam vero, iure nisi a error et corrupti? Voluptas
            perspiciatis accusantium cumque a necessitatibus iste itaque nemo
            voluptatem, id placeat ex consequuntur temporibus quidem ab odio
            impedit omnis nobis repellat expedita explicabo vero minima. Amet
            cumque ad sapiente reiciendis deserunt illo, perspiciatis
            reprehenderit culpa quasi, praesentium odit corrupti veniam.
            Deserunt quia officia, aut voluptate suscipit tenetur sequi,
            asperiores in sed maxime nulla esse reiciendis fuga at aperiam illum
            assumenda, veniam amet? Veritatis, perferendis ipsum optio vel neque
            nihil, sed repudiandae iste, voluptate beatae delectus odit tempore
            sunt inventore! Harum officiis voluptates, est suscipit itaque nulla
            fugiat ducimus et obcaecati autem accusantium numquam odio, quo quas
            earum beatae commodi laborum a minima. Harum earum quis quasi
            suscipit, voluptate vero quos quia perspiciatis natus. Eveniet
            pariatur quam at ab obcaecati maxime temporibus iure iusto
            voluptatum. Id tempora minus officiis atque facere debitis quis
            perferendis, dolorem fuga sint maxime soluta omnis. Id quia eos vel
            excepturi expedita. Porro velit culpa deserunt praesentium laborum
            veniam. Perferendis, debitis mollitia suscipit facilis eos
            laudantium tenetur illo tempora minus? Placeat, maxime quos eum sed
            necessitatibus veniam ex nobis quam deserunt? Beatae id molestias
            aliquam deleniti ipsa quaerat reiciendis, ad laborum minima odio
            repellat sed tenetur incidunt voluptatum, assumenda voluptates est
            suscipit ipsam a, veritatis accusantium iusto quo commodi? Quaerat
            impedit excepturi enim nobis sequi corporis voluptate eaque, quam
            magnam! Adipisci accusantium amet saepe consequatur possimus fugiat
            nulla laudantium maiores recusandae, a similique facere deleniti
            tempore temporibus velit, sint at molestiae rem deserunt laborum
            perferendis voluptas aliquam? Quasi provident aliquid, vitae
            inventore tempora eaque alias quam quibusdam minima quaerat aut
            magni! Sequi debitis dolorem voluptatibus quas sit ipsum quae.
            Debitis, voluptatibus repellendus optio dolorum esse, facilis omnis
            quod dolore molestiae in ad odio eos temporibus vel fuga dicta
            dolorem autem fugit nemo cupiditate asperiores! Vitae odio ab sit
            cum reiciendis nulla soluta ullam enim quasi asperiores, hic impedit
            earum vel! Provident, tempore libero maiores accusantium saepe eaque
            nulla nihil assumenda impedit facilis praesentium sit temporibus ea
            nostrum perferendis odit fugit tenetur aliquam eius molestias
            blanditiis alias! Maiores, voluptate earum sunt iste animi, saepe
            ullam accusamus in dignissimos labore aliquid soluta aspernatur
            mollitia odit. Dolorem, harum? Recusandae, perferendis facilis
            quibusdam velit non similique accusantium saepe, distinctio debitis
            ut, tempora doloremque vel quod quasi! Vel quod placeat nulla
            cupiditate voluptatibus repellat perferendis, iure tenetur facere
            consectetur fugiat dicta odio, velit numquam? Quae sequi pariatur
            animi sit sapiente voluptatem sint esse voluptates quaerat?
            Exercitationem cupiditate sequi non! Eligendi pariatur quam soluta
            perspiciatis minus in expedita dignissimos quos, nisi, provident
            illo quidem ullam molestias atque a corrupti maiores perferendis id
            repellendus! Sit, nulla omnis. Ipsam accusamus, eveniet
            exercitationem magnam officiis doloribus quam, quisquam aut impedit
            quo numquam, qui delectus illo dolorum reprehenderit cupiditate
            iusto autem! Velit, sint! Obcaecati ullam ipsa ipsum nam quis, eum
            error voluptas at? At inventore ducimus voluptatibus earum debitis
            eaque aut, eum accusamus blanditiis sed magnam explicabo maxime cum
            accusantium incidunt aspernatur laborum adipisci quaerat itaque.
            Natus aperiam possimus ab adipisci ipsum provident neque, cupiditate
            optio officia aut, illum laboriosam excepturi exercitationem
            corrupti ex, libero soluta nesciunt vitae maxime vel dolor. Fugiat
            ratione aspernatur labore saepe dolorem veniam soluta id
            necessitatibus! Consequuntur minima dolore iure facilis, amet vel
            nulla vero in repellat tenetur, dolores alias eaque obcaecati
            excepturi praesentium illo quasi reiciendis exercitationem.
            Dignissimos dolor error adipisci recusandae non soluta suscipit
            commodi unde, eveniet eaque? Officiis magni provident ipsa itaque
            unde veritatis laudantium voluptate eveniet, aut officia rem minus,
            recusandae eos mollitia, nam iste vitae ex sequi voluptatem
            repellendus totam cupiditate nesciunt. Odit autem consequuntur ipsam
            consequatur architecto nemo, cupiditate repellat reiciendis animi
            est omnis quia ullam numquam, earum ut et veniam. Doloremque
            consequuntur deleniti nesciunt. Laboriosam repellendus vero hic in
            voluptatem cupiditate nobis, possimus commodi, dolore alias quam ab
            consequatur incidunt assumenda doloremque? Ad ratione eaque
            obcaecati deleniti, odit pariatur earum reiciendis qui nihil sit?
            Dignissimos veritatis quibusdam beatae labore cum inventore deleniti
            temporibus libero consectetur dolores tempore, dolorum, fugiat
            repellendus, facilis ipsa rerum? Sed exercitationem assumenda
            expedita, animi porro voluptatem molestias. Animi voluptatem tenetur
            eligendi corrupti dolor. Reprehenderit numquam natus repellat eos
            iure eligendi molestias esse temporibus fugit doloremque ipsam illo
            blanditiis culpa, error quibusdam ipsa facilis, nihil cupiditate
            odit officia repellendus id? A neque, facilis libero, porro dolorum
            nam doloribus architecto eveniet, molestiae voluptate ratione nobis
            perspiciatis recusandae veniam. Veniam atque consectetur, provident
            ipsum dolore soluta, ex quia mollitia assumenda doloribus natus. Sed
            beatae adipisci obcaecati aperiam saepe debitis temporibus sapiente
            ab officia, officiis tempora repudiandae a, harum eius aliquid
            asperiores. Recusandae corporis, voluptate, praesentium eius
            repellendus illo suscipit, saepe cum molestias impedit commodi?
            Maiores architecto a ipsam saepe possimus aspernatur distinctio, sed
            quod quidem? In necessitatibus praesentium asperiores natus itaque
            dolor repudiandae fuga voluptas iure, ullam laboriosam illum eveniet
            laudantium non minus numquam at quia repellendus harum? Pariatur
            fugiat aspernatur fugit quidem reiciendis maxime quaerat doloremque,
            exercitationem cumque consequatur itaque voluptate repudiandae sit
            hic! Facere tenetur, ratione reprehenderit optio illum aperiam
            officia praesentium aspernatur. Delectus ut blanditiis tenetur sint
            dicta accusantium, deleniti voluptatem officia ipsam saepe culpa cum
            architecto ea vel nulla mollitia quibusdam aliquid recusandae vero
            ducimus debitis dolore atque ratione! Neque officia dicta blanditiis
            culpa at. Unde modi minima harum hic facilis itaque, illum impedit
            nulla quos eveniet vel tempore quam reiciendis inventore, excepturi
            at distinctio animi iste dignissimos possimus totam quod quo
            explicabo blanditiis! Id quas ut voluptates nemo cupiditate illo
            consequatur dolore eos laboriosam? Quos illo similique in tenetur
            tempora doloremque dolores voluptate, facere esse enim inventore
            ullam iusto eos aspernatur saepe rerum ad autem fugit commodi magni
            at. Tempora consectetur, facilis assumenda perspiciatis totam earum
            magnam, voluptates saepe enim nisi dicta! Aspernatur nisi sequi
            optio quasi? Possimus expedita unde fuga laudantium quos, dicta
            perspiciatis voluptate dolorum eum nesciunt, atque ab ipsum nisi
            tempore accusantium repudiandae labore nobis molestias numquam
            neque? Voluptatibus, nam! Dolorum sit iusto non quae quidem
            voluptatem neque dolor magni blanditiis dolorem libero nulla saepe,
            quis, sapiente sint commodi maiores, aspernatur repudiandae veniam
            amet molestiae alias pariatur? Dolorem quae cum molestiae
            necessitatibus itaque expedita nihil unde iusto quaerat! Facere
            dolor, natus quidem deleniti nihil itaque nisi officia dolores harum
            nulla blanditiis aut. Perferendis eos amet error optio quae odit
            suscipit doloribus inventore, illum nesciunt unde libero nostrum id
            quidem alias corrupti labore! Temporibus nam cumque aperiam iste, ut
            labore distinctio, beatae modi delectus sit minima atque reiciendis
            nobis, officia quia doloremque dolores ad voluptas dolor. Illum qui
            cupiditate laboriosam ex debitis minima odit velit aliquid ut!
            Iusto, obcaecati temporibus veritatis impedit, eius nam delectus
            porro explicabo odio natus saepe, beatae illo itaque quasi!
            Obcaecati, unde numquam assumenda reiciendis quis aut nisi, autem
            voluptatum deleniti exercitationem fugit labore aliquam id, minima
            dolorum at nihil quia ex quod sapiente ipsam! A, impedit. Beatae
            voluptates non a corporis reiciendis vel, repudiandae neque porro
            consequatur nobis, sapiente voluptas velit, nisi delectus qui illo.
            Quidem ipsa nihil dicta expedita officiis ullam, iusto voluptatum.
            Commodi ipsa suscipit velit atque quod doloremque eius iusto optio!
            Enim quo ut dolores commodi, adipisci pariatur perspiciatis magnam
            repellat ad fuga fugit illum officia eligendi! Ipsum id, cupiditate
            iusto culpa distinctio aliquam aut vel similique ipsam vitae sequi
            accusantium! Praesentium eligendi quisquam nostrum, explicabo dicta
            natus modi vero nulla excepturi soluta accusamus labore esse amet
            sed laborum eius doloribus voluptate maxime molestiae. At velit ut
            sit adipisci, recusandae molestias eius dolorum accusamus a natus
            placeat ullam corporis repudiandae nihil cum minus dicta odio
            tempora? Quaerat, ullam? Maiores soluta aut nam earum ex rerum,
            itaque minima enim eligendi iste, similique velit error! Doloribus
            reiciendis quod error nobis officia adipisci, libero dolorem
            consectetur iure corrupti iusto fugiat nam doloremque hic corporis
            quidem vero quis eveniet odit voluptas earum aliquam. Dignissimos
            eum facere itaque explicabo harum neque eligendi est quibusdam?
            Possimus, iure. Odio odit voluptates nihil officiis sunt doloremque
            reprehenderit mollitia, vel aperiam! Officiis saepe tempore, veniam,
            ab perferendis placeat deserunt ipsum exercitationem cum corrupti
            soluta impedit maxime tenetur, nulla dolores laudantium magnam
            mollitia repudiandae quo? Aliquam nam in iure nostrum et illum nemo
            iusto ipsam deleniti ad corrupti exercitationem velit porro
            molestias temporibus beatae voluptatem architecto doloremque
            facilis, facere neque saepe hic itaque. Nostrum totam quaerat fugit
            deleniti quae nesciunt obcaecati, numquam explicabo necessitatibus
            illo magnam porro hic veniam accusamus ea? Asperiores autem sint
            dolore non alias, quas harum. Illum soluta itaque cupiditate,
            excepturi reprehenderit necessitatibus ea fugit, repudiandae
            eligendi ratione doloribus provident obcaecati consequuntur rerum.
            Debitis, repellendus quo ducimus quos tenetur quidem cumque eum
            atque vel voluptates maxime perspiciatis maiores nobis dolore magni,
            sequi neque! Iusto quia quo provident veniam repellat? Neque
            accusamus ipsa dolorum maxime? Illo, est in! Distinctio aperiam iure
            amet vero quidem sint delectus mollitia autem impedit doloribus
            debitis quis, perferendis ex repudiandae laudantium eveniet
            laboriosam tempora quaerat quae nisi illo eaque illum corporis.
            Nihil tenetur dolor temporibus error ut cupiditate alias nulla
            incidunt beatae quod facilis amet vel consectetur iure, eligendi
            voluptatibus architecto quaerat fuga corporis accusantium! Modi enim
            repellendus distinctio accusantium. Odit ducimus atque fugit rerum
            eius quia eos officiis possimus perferendis quos recusandae ea
            mollitia, nemo ad, praesentium eveniet quis dicta illum alias
            necessitatibus aliquid, provident temporibus! Animi nam nihil
            doloribus ab ex quidem ipsam fuga eos aliquam sed optio perspiciatis
            nemo ullam cumque aliquid vel accusantium voluptatem saepe deleniti
            repudiandae totam, magnam ducimus veritatis alias! Doloremque amet
            laboriosam qui esse eos sint distinctio, laudantium quas molestiae
            ullam pariatur voluptas soluta sunt quasi cupiditate. Incidunt ex
            recusandae earum quia. Non expedita ullam impedit blanditiis
            possimus voluptate rem qui cum alias eos officia libero, incidunt
            voluptas natus, quos modi optio, cumque laboriosam velit fugiat?
            Commodi laudantium dolores aut mollitia facilis quibusdam eos
            voluptates cum quis sint necessitatibus itaque nulla aperiam ratione
            vero rerum nam odit, accusamus distinctio? Error modi nulla
            blanditiis, fugit perspiciatis voluptas optio cumque voluptates
            sapiente molestias earum quasi aspernatur! Voluptatem deleniti velit
            tempore consectetur dolorum ex natus sunt est suscipit? Animi
            mollitia harum quas, neque unde delectus, nobis deserunt sequi
            eligendi, nam aliquam consectetur quasi aperiam nemo quibusdam
            placeat obcaecati quae possimus! Voluptatem rerum voluptatibus
            doloremque perferendis incidunt voluptatum? Consectetur dolorum nisi
            consequuntur ad impedit vitae tempora quos laborum itaque,
            repudiandae laudantium illum ratione officiis. Quia consequuntur
            maxime aspernatur modi voluptate odit provident eaque dolores iure
            blanditiis quibusdam architecto nam, molestiae excepturi magnam,
            totam quod possimus pariatur ipsum quos? Quia dolore id nisi
            voluptates odit, unde iusto maxime sit quis. Placeat, aliquam
            quaerat itaque modi, numquam aspernatur repudiandae consequatur
            dicta quis, optio sunt quos aperiam! Error iure dolorem magni eius
            cupiditate? Dolorem, provident quasi. Ipsum repellendus aperiam
            voluptates. Eveniet error qui animi quidem, consequatur magni fuga
            ab! Libero non eaque unde eligendi sequi sed a assumenda. Iure eos
            dolorum officiis ad id tempore voluptas quaerat et doloremque
            consequatur. Voluptatum, quos consequuntur dignissimos ratione
            facilis id quia, hic sapiente nemo deserunt quibusdam accusantium
            eos veniam. Laboriosam, expedita nostrum dolores modi,
            necessitatibus sit earum voluptates aspernatur consequatur sunt
            perferendis dolor doloribus harum ex blanditiis quod exercitationem
            magni esse distinctio consectetur minima dolorum eveniet? Error
            nesciunt quibusdam voluptas sequi, repellat porro perferendis
            tenetur rem, natus architecto ex illo. Placeat ipsum rerum iste. Eos
            nostrum nemo nesciunt eius, accusantium eaque? Necessitatibus
            molestiae deleniti quam hic quasi et veniam suscipit voluptatum
            facere vitae optio, ducimus delectus. Ratione accusantium deserunt
            qui error voluptatibus totam aliquid culpa odit adipisci nihil hic
            eveniet ipsam dolorum in dolor, quaerat earum tempora temporibus
            placeat. Ipsam laborum doloribus quibusdam nesciunt temporibus earum
            doloremque reprehenderit aliquid id maxime! Error, dolores. Neque
            ducimus voluptatem quis facere sequi odit qui ad excepturi,
            dignissimos laborum accusamus. Quam iure, natus officiis nihil
            beatae quis vitae, ab magnam eligendi ipsum, nulla amet fugit
            voluptate labore iusto deserunt odit dolores asperiores placeat eum
            explicabo aliquam exercitationem! Commodi asperiores fugiat nam
            deleniti sequi magnam modi dolorem culpa? Dolor labore voluptas ex
            aspernatur aliquam iure ut culpa nobis vitae itaque minus quas ipsum
            nesciunt consequuntur, saepe incidunt alias. Quod excepturi ipsa
            perferendis earum eum cupiditate animi neque ipsam nemo molestiae
            quia in eius vitae libero quasi quibusdam ex repudiandae dignissimos
            enim nisi mollitia sit voluptate, voluptatibus ut! Perferendis
            temporibus, magni veritatis nam ex iusto in illo delectus suscipit
            expedita beatae cum quisquam at officia vel laudantium voluptatibus
            soluta omnis impedit iure! Quisquam, dignissimos perferendis. Sunt
            magnam quod facilis sit?
          </div>
        </div>
      </div>

      {isProcess && (
        <div className="fixed top-0 right-0 left-0 z-50 bg-white/50">
          <BarLoader
            color="#1447e6"
            height={3}
            loading={true}
            speedMultiplier={1}
            width="100%"
          />
        </div>
      )}
    </Fragment>
  );
};

const routeLoader = (module: ModuleT): WrapRoute["loader"] => {
  return async () =>
    new Promise<ModuleT>((resolve) => {
      setTimeout(() => {
        resolve(module);
      }, 1000);
    });
};

const appendLoader = (routes: WrapRoute[]): WrapRoute[] =>
  routes.map(
    (route) =>
      ({
        ...route,
        ...(route.module ? { loader: routeLoader(route.module) } : {}),
        ...(route.children ? { children: appendLoader(route.children) } : {}),
      } as WrapRoute)
  );

const App: FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: appendLoader(routes),
      HydrateFallback: LoadingOverlay,
    },
    { path: "*", element: <Error404 /> },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
