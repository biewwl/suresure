import Betano from "../assets/betano.webp";
import Betfair from "../assets/betfair.png";
import Bet365 from "../assets/bet365.png";
import Superbet from "../assets/superbet.png";
import KTO from "../assets/kto.png";
import Pinnacle from "../assets/pinnacle.png";
import EstrelaBet from "../assets/estrelabet.webp";
import SportingBet from "../assets/sportingbet.png";
import Novibet from "../assets/novibet.png";
import CassinoBet from "../assets/cassinobet.png";
import ApostaGanha from "../assets/apostaganha.png";
import Bet7k from "../assets/bet7k.png";
import VeraBet from "../assets/verabet.jpeg";
import BetNacional from "../assets/betnacional.png";
import McGames from "../assets/mcgames.png";
import ApostaTudo from "../assets/apostatudo.png";
import ReiDoPitaco from "../assets/reidopitaco.png";
import JogoDeOuro from "../assets/jogodeouro.png";
import Betfast from "../assets/betfast.png";
import UxBet from "../assets/uxbet.png";
import Bateu from "../assets/bateubet.webp";
import EsportivaBet from "../assets/esportivabet.png";
import Br4Bet from "../assets/br4.jpeg";
import VaiDeBet from "../assets/vaidebet.jpeg";
import BetfairExchange from "../assets/betfairexchange.webp";
import Betao from "../assets/betao.jpg";
import Lotogreen from "../assets/lotogreen.jpg";
import Blaze from "../assets/blaze.png";
import SeguroBet from "../assets/segurobet.jpeg";
import CasaDeApostas from "../assets/casadeapostas.png";
import BravoBet from "../assets/bravo.png";
import PixBet from "../assets/pixbet.png";
import LuvaBet from "../assets/luvabet.png";
import GolDeBet from "../assets/goldebet.png";
import FlaBet from "../assets/flabet.jpeg";
import HiperBet from "../assets/hiperbet.jpeg";
import BrasilDaSorte from "../assets/brasildasorte.png";
import F12Bet from "../assets/f12bet.jpg";
import MrJackBet from "../assets/mrjackbet.jpg";
import LanceDaSorte from "../assets/lancedasorte.webp";
import PagolBet from "../assets/pagol.jpeg";
import FourPlayBet from "../assets/4playbet.jpeg";
import VivaSorte from "../assets/vivasorte.jpeg";
import BetDaSorte from "../assets/betdasorte.png";
import BetPix365 from "../assets/betpix365.png";
import BolsaDeAposta from "../assets/bolsadeaposta.png";
import MultiBet from "../assets/multibet.png";
import BetEsporte from "../assets/betesporte.png";
import AlfaBet from "../assets/alfabet.png";
import QGbet from "../assets/qgbet.png";
import Fulltbet from "../assets/fulltbet.jpg";
import BetMgm from "../assets/betmgm.png";

export const getLogo = (name) => {
  const betName = name.toLowerCase();

  const firstLetter = betName.charAt(0).toUpperCase();
  const restOfName = betName.slice(1);
  const formattedName = firstLetter + restOfName;

  switch (betName) {
    case "betano":
      return { logo: Betano, site: "https://betano.bet.br" };
    case "betfair":
      return { logo: Betfair, site: "https://betfair.bet.br/apostas/" };
    case "bet365":
      return { logo: Bet365, site: "https://bet365.bet.br/#/HO/" };
    case "superbet":
      return { logo: Superbet, site: "https://superbet.bet.br/" };
    case "kto":
      return { logo: KTO, site: "https://kto.bet.br/esportes/" };
    case "pinnacle":
      return { logo: Pinnacle, site: "https://pinnacle.bet.br/sportsbook" };
    case "estrelabet":
      return {
        logo: EstrelaBet,
        site: "https://estrelabet.bet.br/pb/esportes#/overview",
      };
    case "sportingbet":
      return {
        logo: SportingBet,
        site: "https://sports.sportingbet.bet.br/pt-br/sports",
      };
    case "novibet":
      return {
        logo: Novibet,
        site: "https://novibet.bet.br/apostas-esportivas",
      };
    case "cassinobet":
      return { logo: CassinoBet, site: "https://cassino.bet.br/sports" };
    case "apostaganha":
      return { logo: ApostaGanha, site: "https://apostaganha.bet.br/esportes" };
    case "bet7k":
      return { logo: Bet7k, site: "https://7k.bet.br/sports" };
    case "verabet":
      return { logo: VeraBet, site: "https://vera.bet.br/sports" };
    case "betnacional":
      return { logo: BetNacional, site: "https://betnacional.bet.br/" };
    case "mcgames":
      return { logo: McGames, site: "https://mcgames.bet.br/sports" };
    case "apostatudo":
      return { logo: ApostaTudo, site: "https://apostatudo.bet.br/sports" };
    case "reidopitaco":
      return { logo: ReiDoPitaco, site: "https://reidopitaco.bet.br/betting" };
    case "jogodeouro":
      return { logo: JogoDeOuro, site: "https://jogodeouro.bet.br/pt/sports" };
    case "betfast":
      return { logo: Betfast, site: "https://betfast.bet.br/br" };
    case "uxbet":
      return { logo: UxBet, site: "https://ux.bet.br/home/events-area" };
    case "bateu":
      return { logo: Bateu, site: "https://bateu.bet.br/sports" };
    case "esportivabet":
      return { logo: EsportivaBet, site: "https://esportiva.bet.br/sports" };
    case "br4bet":
      return { logo: Br4Bet, site: "https://br4.bet.br/sports#/overview" };
    case "vaidebet":
      return { logo: VaiDeBet, site: "https://vaidebet.com/ptb/bet/main" };
    case "betfairexchange":
      return {
        logo: BetfairExchange,
        site: "https://betfair.bet.br/exchange/plus/",
      };
    case "betao":
      return {
        logo: Betao,
        site: "https://betao.bet.br/pb/sports/pre-match/event-view",
      };
    case "lotogreen":
      return {
        logo: Lotogreen,
        site: "https://lotogreen.bet.br/sports#/overview",
      };
    case "blaze":
      return {
        logo: Blaze,
        site: "https://blaze.bet.br/pt/sports",
      };
    case "segurobet":
      return {
        logo: SeguroBet,
        site: "https://www.seguro.bet.br/pre-jogo",
      };
    case "casadeapostas":
      return {
        logo: CasaDeApostas,
        site: "https://casadeapostas.bet.br/br/sports",
      };
    case "bravobet":
      return {
        logo: BravoBet,
        site: "https://bravo.bet.br/esports",
      };
    case "pixbet":
      return {
        logo: PixBet,
        site: "https://pix.bet.br/sports",
      };
    case "luvabet":
      return {
        logo: LuvaBet,
        site: "https://luva.bet.br/sportsbook/Football/International",
      };
    case "goldebet":
      return {
        logo: GolDeBet,
        site: "https://goldebet.bet.br/sports#/overview",
      };
    case "flabet":
      return {
        logo: FlaBet,
        site: "https://fla.bet.br/",
      };
    case "hiperbet":
      return {
        logo: HiperBet,
        site: "https://m.hiper.bet.br/ptb/bet/sports",
      };
    case "brasildasorte":
      return {
        logo: BrasilDaSorte,
        site: "https://brasildasorte.bet.br/home/events-area",
      };
    case "f12bet":
      return {
        logo: F12Bet,
        site: "https://f12.bet.br/prejogo/",
      };
    case "mrjackbet":
      return {
        logo: MrJackBet,
        site: "https://mrjack.bet.br/",
      };
    case "lancedasorte":
      return {
        logo: LanceDaSorte,
        site: "https://lancedesorte.bet.br/",
      };
    case "pagolbet":
      return {
        logo: PagolBet,
        site: "https://pagol.bet.br/br/aposta-esportiva/home",
      };
    case "fourplaybet":
      return {
        logo: FourPlayBet,
        site: "https://4play.bet.br/apostas-esportivas/destaques",
      };
    case "vivasorte":
      return {
        logo: VivaSorte,
        site: "https://vivasorte.bet.br/",
      };
    case "betdasorte":
      return {
        logo: BetDaSorte,
        site: "https://betdasorte.bet.br/sports",
      };
    case "betpix365":
      return {
        logo: BetPix365,
        site: "https://betpix365.bet.br/ptb/bet/main",
      };
    case "bolsadeaposta":
      return {
        logo: BolsaDeAposta,
        site: "https://bolsadeaposta.bet.br/b/exchange",
      };
    case "multibet":
      return {
        logo: MultiBet,
        site: "https://multi.bet.br/sports#/overview",
      };
    case "betesporte":
      return {
        logo: BetEsporte,
        site: "https://betesporte.bet.br/sports",
      };
    case "alfabet":
      return {
        logo: AlfaBet,
        site: "https://alfabet.bet.br",
      };
    case "qgbet":
      return {
        logo: QGbet,
        site: "https://qg.bet.br/",
      };

    case "fulltbet":
      return {
        logo: Fulltbet,
        site: "https://fulltbet.bet.br/b/exchange",
      };

    case "betmgm":
      return {
        logo: BetMgm,
        site: "https://www.betmgm.bet.br/aposta-esportiva#featured",
      };
    // Add more cases as needed
    default:
      return {
        logo: `https://ui-avatars.com/api/?name=${formattedName}&background=99999925&color=999&uppercase=false`,
        site: "/",
      };
    // break;
  }
};

export const allLogos = {
  Betano,
  Betfair,
  BetfairExchange,
  Bet365,
  Superbet,
  KTO,
  Pinnacle,
  EstrelaBet,
  SportingBet,
  Novibet,
  ApostaGanha,
  CassinoBet,
  Bet7k,
  VeraBet,
  BetNacional,
  McGames,
  ApostaTudo,
  ReiDoPitaco,
  JogoDeOuro,
  Betfast,
  UxBet,
  Bateu,
  EsportivaBet,
  Br4Bet,
  VaiDeBet,
  Betao,
  Lotogreen,
  Blaze,
  SeguroBet,
  CasaDeApostas,
  BravoBet,
  PixBet,
  LuvaBet,
  GolDeBet,
  FlaBet,
  HiperBet,
  BrasilDaSorte,
  F12Bet,
  MrJackBet,
  LanceDaSorte,
  PagolBet,
  FourPlayBet,
  VivaSorte,
  BetDaSorte,
  BetPix365,
  BolsaDeAposta,
  MultiBet,
  BetEsporte,
  AlfaBet,
  QGbet,
  Fulltbet,
  BetMgm,
};
